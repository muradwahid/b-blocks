/**
 * Modal Popup – frontend behavior.
 *
 * - Reads the trigger element rendered by render.php.
 * - Extracts the modal template, appends it once to <body>.
 * - Handles open / close, focus trap, focus return, Escape and overlay click.
 * - Multiple instances per page are isolated via unique IDs.
 *
 * Respects prefers-reduced-motion (handled in style.scss).
 */
import './style.scss';

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'area[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'iframe',
	'object',
	'embed',
	'[contenteditable="true"]',
	'[tabindex]:not([tabindex="-1"])'
].join(',');

const openModals = new Set();

const getFocusable = (root) => {
	if (!root) return [];
	return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
		return !el.hasAttribute('disabled') && el.offsetParent !== null;
	});
};

const trapFocus = (event, dialog) => {
	if (event.key !== 'Tab') return;
	const focusable = getFocusable(dialog);
	if (focusable.length === 0) {
		event.preventDefault();
		dialog.focus();
		return;
	}
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	const active = document.activeElement;
	if (event.shiftKey) {
		if (active === first || !dialog.contains(active)) {
			event.preventDefault();
			last.focus();
		}
	} else if (active === last) {
		event.preventDefault();
		first.focus();
	}
};

/**
 * Apply aria-hidden="true" to all direct body children that are not the modal,
 * so screen readers skip the background content while the dialog is open.
 * Only applies when this is the first open modal (so we don't double-apply).
 */
const hideBgFromSR = (modalEl) => {
	if (openModals.size !== 1) return; // already hidden by a previous open call
	Array.from(document.body.children).forEach((child) => {
		if (child === modalEl) return;
		if (child.hasAttribute('aria-hidden')) {
			child.dataset.bbWasAriaHidden = 'true';
		} else {
			child.setAttribute('aria-hidden', 'true');
			child.dataset.bbWasAriaHidden = 'false';
		}
	});
};

/**
 * Restore aria-hidden to whatever it was before we hid background content.
 * Only restore when the last open modal closes.
 */
const restoreBgFromSR = () => {
	if (openModals.size !== 0) return;
	Array.from(document.body.children).forEach((child) => {
		if (child.dataset.bbWasAriaHidden === 'false') {
			child.removeAttribute('aria-hidden');
		}
		delete child.dataset.bbWasAriaHidden;
	});
};

const openModal = (modalEl, trigger, config) => {
	if (!modalEl) return;
	openModals.add(modalEl);
	modalEl.removeAttribute('hidden');
	// Force a paint before adding the .is-open class so transitions run.
	requestAnimationFrame(() => {
		modalEl.classList.add('is-open');
	});
	document.body.classList.add('bBlocksModalOpen');
	trigger.setAttribute('aria-expanded', 'true');
	hideBgFromSR(modalEl);

	const dialog = modalEl.querySelector('.modalDialog');
	if (dialog) {
		// Move focus into the dialog. Prefer the first focusable child
		// (close button, link, input), otherwise focus the dialog itself.
		const focusable = getFocusable(dialog);
		const target = focusable[0] || dialog;
		// Slight delay to ensure visibility before focus shifts (some screen readers).
		setTimeout(() => target.focus(), 10);
	}

	const onKeyDown = (e) => {
		if (e.key === 'Escape' && config.closeOnEscape) {
			e.preventDefault();
			closeModal(modalEl, trigger, config);
			return;
		}
		if (dialog) {
			trapFocus(e, dialog);
		}
	};

	modalEl._bbKeyHandler = onKeyDown;
	document.addEventListener('keydown', onKeyDown);
};

const closeModal = (modalEl, trigger, config) => {
	if (!modalEl) return;
	modalEl.classList.remove('is-open');
	trigger.setAttribute('aria-expanded', 'false');
	openModals.delete(modalEl);

	if (modalEl._bbKeyHandler) {
		document.removeEventListener('keydown', modalEl._bbKeyHandler);
		delete modalEl._bbKeyHandler;
	}

	restoreBgFromSR();

	if (openModals.size === 0) {
		document.body.classList.remove('bBlocksModalOpen');
	}

	// Hide after transition completes so it leaves the a11y tree.
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const delay = reduced || config.animation === 'none' ? 0 : 280;
	setTimeout(() => {
		if (!modalEl.classList.contains('is-open')) {
			modalEl.setAttribute('hidden', '');
		}
	}, delay);

	// Return focus to the originally focused trigger.
	if (trigger && typeof trigger.focus === 'function') {
		setTimeout(() => trigger.focus(), 10);
	}
};

const initBlock = (wrapper) => {
	let config = {};
	try {
		config = JSON.parse(wrapper.dataset.modalConfig || '{}');
	} catch (e) {
		config = {};
	}

	const trigger = wrapper.querySelector('.modalTrigger');
	const template = wrapper.querySelector('template.modalTemplate');
	if (!trigger || !template) return;

	// Move the modal root from the <template> to <body>. Only do this once,
	// even if view.js runs multiple times.
	const existing = document.getElementById(config.modalId);
	let modalEl = existing;
	if (!modalEl) {
		const fragment = template.content.cloneNode(true);
		const root = fragment.querySelector('.bBlocksModalPopupRoot');
		if (root) {
			document.body.appendChild(root);
			modalEl = root;
		}
	}
	// The template is no longer needed in-place.
	template.remove();

	if (!modalEl) return;

	trigger.addEventListener('click', (e) => {
		e.preventDefault();
		openModal(modalEl, trigger, config);
	});

	const closeBtn = modalEl.querySelector('[data-modal-close]');
	if (closeBtn) {
		closeBtn.addEventListener('click', (e) => {
			e.preventDefault();
			closeModal(modalEl, trigger, config);
		});
	}

	const overlay = modalEl.querySelector('[data-modal-overlay]');
	if (overlay && config.closeOnOverlayClick) {
		overlay.addEventListener('click', (e) => {
			e.preventDefault();
			closeModal(modalEl, trigger, config);
		});
	}

	// Strip data attribute after initialization to avoid re-parsing.
	wrapper.removeAttribute('data-modal-config');
};

document.addEventListener('DOMContentLoaded', () => {
	const blocks = document.querySelectorAll('.wp-block-b-blocks-modal-popup');
	blocks.forEach((wrapper) => initBlock(wrapper));
});
