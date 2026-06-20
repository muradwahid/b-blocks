/**
 * Off-Canvas Drawer — frontend behavior.
 *
 * - Trigger toggles a slide-in panel (left or right edge).
 * - Closes on close-button click, backdrop click, or Escape.
 * - Traps focus inside the panel while open; returns focus to the trigger on close.
 * - Locks body scroll while open.
 * - Hides background content from screen readers via aria-hidden.
 * - Respects prefers-reduced-motion (animation duration is overridden to 0ms
 *   via a CSS custom property set in render.php / style.scss).
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

const openDrawers = new Set();

const getFocusable = (root) => {
	if (!root) return [];
	return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter((el) => {
		return !el.hasAttribute('disabled') && el.offsetParent !== null;
	});
};

const trapFocus = (event, panel) => {
	if (event.key !== 'Tab') return;
	const focusable = getFocusable(panel);
	if (focusable.length === 0) {
		event.preventDefault();
		panel.focus();
		return;
	}
	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	const active = document.activeElement;
	if (event.shiftKey) {
		if (active === first || !panel.contains(active)) {
			event.preventDefault();
			last.focus();
		}
	} else if (active === last) {
		event.preventDefault();
		first.focus();
	}
};

/**
 * Hide all top-level body children from screen readers while a drawer is open
 * (except the drawer's own wrapper). Only applies on the first open drawer
 * so we never double-toggle.
 */
const hideBgFromSR = (wrapper) => {
	if (openDrawers.size !== 1) return;
	Array.from(document.body.children).forEach((child) => {
		if (child === wrapper) return;
		if (child.hasAttribute('aria-hidden')) {
			child.dataset.bbOcWasAriaHidden = 'true';
		} else {
			child.setAttribute('aria-hidden', 'true');
			child.dataset.bbOcWasAriaHidden = 'false';
		}
	});
};

const restoreBgFromSR = () => {
	if (openDrawers.size !== 0) return;
	Array.from(document.body.children).forEach((child) => {
		if (child.dataset.bbOcWasAriaHidden === 'false') {
			child.removeAttribute('aria-hidden');
		}
		delete child.dataset.bbOcWasAriaHidden;
	});
};

const openDrawer = (state) => {
	const { wrapper, trigger, panel, overlay, config } = state;
	if (!panel) return;

	openDrawers.add(panel);

	panel.removeAttribute('hidden');
	if (overlay && config.showOverlay) {
		overlay.removeAttribute('hidden');
	}

	// Force a paint before adding .is-open so the slide transition runs.
	requestAnimationFrame(() => {
		panel.classList.add('is-open');
		if (overlay && config.showOverlay) {
			overlay.classList.add('is-open');
		}
	});

	document.body.classList.add('bBlocksOffCanvasOpen');
	trigger.setAttribute('aria-expanded', 'true');
	hideBgFromSR(wrapper);

	// Move focus into the panel.
	const focusable = getFocusable(panel);
	const target = focusable[0] || panel;
	setTimeout(() => {
		try {
			target.focus();
		} catch (e) {
			// Ignore focus errors on detached elements.
		}
	}, 10);

	const onKeyDown = (e) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			closeDrawer(state);
			return;
		}
		trapFocus(e, panel);
	};

	state._keyHandler = onKeyDown;
	document.addEventListener('keydown', onKeyDown);
};

const closeDrawer = (state) => {
	const { wrapper, trigger, panel, overlay, config } = state;
	if (!panel) return;

	panel.classList.remove('is-open');
	if (overlay) {
		overlay.classList.remove('is-open');
	}
	trigger.setAttribute('aria-expanded', 'false');
	openDrawers.delete(panel);

	if (state._keyHandler) {
		document.removeEventListener('keydown', state._keyHandler);
		state._keyHandler = null;
	}

	restoreBgFromSR();

	if (openDrawers.size === 0) {
		document.body.classList.remove('bBlocksOffCanvasOpen');
	}

	// After the slide-out finishes, hide from the a11y tree.
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const delay = reduced ? 0 : Math.max(0, (config.animationMs || 300) + 20);
	setTimeout(() => {
		if (!panel.classList.contains('is-open')) {
			panel.setAttribute('hidden', '');
			if (overlay) {
				overlay.setAttribute('hidden', '');
			}
		}
	}, delay);

	// Return focus to the originating trigger.
	if (trigger && typeof trigger.focus === 'function') {
		setTimeout(() => {
			try {
				trigger.focus();
			} catch (e) {
				// Ignore.
			}
		}, 10);
	}

	// Ignore reference to silence eslint about unused destructure.
	void wrapper;
};

const initBlock = (wrapper) => {
	let config = {};
	try {
		config = JSON.parse(wrapper.dataset.offCanvasConfig || '{}');
	} catch (e) {
		config = {};
	}

	const trigger = wrapper.querySelector('[data-off-canvas-trigger]');
	const panel = wrapper.querySelector('[data-off-canvas-panel]');
	const overlay = wrapper.querySelector('[data-off-canvas-overlay]');
	const closeBtn = wrapper.querySelector('[data-off-canvas-close]');
	if (!trigger || !panel) return;

	const state = {
		wrapper,
		trigger,
		panel,
		overlay,
		config: {
			showOverlay: config.showOverlay !== false,
			animationMs: typeof config.animationMs === 'number' ? config.animationMs : 300
		},
		_keyHandler: null
	};

	trigger.addEventListener('click', (e) => {
		e.preventDefault();
		if (panel.classList.contains('is-open')) {
			closeDrawer(state);
		} else {
			openDrawer(state);
		}
	});

	if (closeBtn) {
		closeBtn.addEventListener('click', (e) => {
			e.preventDefault();
			closeDrawer(state);
		});
	}

	if (overlay) {
		overlay.addEventListener('click', (e) => {
			e.preventDefault();
			closeDrawer(state);
		});
	}

	// Strip the config attribute after init to avoid re-parsing.
	wrapper.removeAttribute('data-off-canvas-config');
};

document.addEventListener('DOMContentLoaded', () => {
	const blocks = document.querySelectorAll('.wp-block-b-blocks-off-canvas');
	blocks.forEach((wrapper) => initBlock(wrapper));
});
