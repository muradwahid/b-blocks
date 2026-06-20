/**
 * Coupon Code Block — frontend entry point.
 *
 * Responsibilities:
 *   1. Wire the coupon code button to write the code to the clipboard
 *      (with an execCommand fallback for insecure / older contexts).
 *   2. On successful copy, swap the button label to the "Copied!" state,
 *      announce success via an aria-live region, and (if an affiliate URL
 *      is provided) open it in a new tab.
 *   3. Wire the optional Reveal button to remove the blur/mask and surface
 *      the real code button to keyboard / AT users.
 *
 * Per-instance scoping with a `data-bb-cc-init` guard prevents double-bind
 * if this file is included more than once on a page (e.g. via Gutenberg
 * block previews).
 */

import './style.scss';

const COPY_RESET_MS = 2000;

const fallbackCopy = (text) => {
	try {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.setAttribute('readonly', '');
		ta.style.position = 'absolute';
		ta.style.left = '-9999px';
		document.body.appendChild(ta);
		ta.select();
		const ok = document.execCommand('copy');
		document.body.removeChild(ta);
		return ok;
	} catch (_e) {
		return false;
	}
};

const openAffiliateUrl = (url, newTab) => {
	if (!url) {
		return;
	}
	if (newTab) {
		const w = window.open(url, '_blank', 'noopener,noreferrer');
		if (w) {
			w.opener = null;
		}
	} else {
		window.location.href = url;
	}
};

const wireRevealButton = (root) => {
	const revealBtn = root.querySelector('.bb-cc-reveal-btn');
	const codeBtn = root.querySelector('.bb-cc-code-btn');
	if (!revealBtn || !codeBtn) {
		return;
	}

	const reveal = () => {
		root.classList.remove('is-hidden');
		root.classList.add('is-revealed');
		revealBtn.setAttribute('aria-expanded', 'true');
		codeBtn.removeAttribute('aria-hidden');
		codeBtn.removeAttribute('tabindex');
		// Move focus to the now-active copy button so keyboard users
		// don't lose their place.
		codeBtn.focus();
		// Hide the reveal button from the tab order — its job is done.
		revealBtn.setAttribute('hidden', '');
	};

	revealBtn.addEventListener('click', reveal);
};

const wireCopyButton = (root) => {
	const btn = root.querySelector('.bb-cc-code-btn');
	if (!btn) {
		return;
	}
	const code = root.getAttribute('data-bb-cc-code') || '';
	const url = root.getAttribute('data-bb-cc-url') || '';
	const newTab = root.getAttribute('data-bb-cc-new-tab') === '1';
	const defaultLabel = root.getAttribute('data-bb-cc-copy-label') || 'Copy Code';
	const copiedLabel = root.getAttribute('data-bb-cc-copied-label') || 'Copied!';
	const copiedAria = root.getAttribute('data-bb-cc-copied-aria') || 'Coupon code copied to clipboard';
	const defaultAria = btn.getAttribute('data-default-aria') || btn.getAttribute('aria-label') || 'Copy coupon code';
	const labelSpan = btn.querySelector('.bb-cc-copy-label');
	const liveEl = root.querySelector('.bb-cc-live');

	let resetTimer = 0;

	const onSuccess = () => {
		if (labelSpan) {
			labelSpan.textContent = copiedLabel;
		}
		btn.classList.add('is-copied');
		btn.setAttribute('aria-label', copiedAria);
		if (liveEl) {
			liveEl.textContent = copiedAria;
		}

		// Hand off to the affiliate URL after the copy succeeded.
		openAffiliateUrl(url, newTab);

		if (resetTimer) {
			clearTimeout(resetTimer);
		}
		resetTimer = window.setTimeout(() => {
			if (labelSpan) {
				labelSpan.textContent = defaultLabel;
			}
			btn.classList.remove('is-copied');
			btn.setAttribute('aria-label', defaultAria);
			if (liveEl) {
				liveEl.textContent = '';
			}
			resetTimer = 0;
		}, COPY_RESET_MS);
	};

	btn.addEventListener('click', () => {
		if (!code) {
			return;
		}
		if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
			navigator.clipboard.writeText(code).then(onSuccess).catch(() => {
				if (fallbackCopy(code)) {
					onSuccess();
				}
			});
		} else if (fallbackCopy(code)) {
			onSuccess();
		}
	});
};

const initBlock = (root) => {
	if (!root || root.getAttribute('data-bb-cc-init') === '1') {
		return;
	}
	root.setAttribute('data-bb-cc-init', '1');

	const type = root.getAttribute('data-bb-cc-type') || 'coupon';

	if (type === 'coupon') {
		if (root.getAttribute('data-bb-cc-reveal') === '1') {
			wireRevealButton(root);
		}
		wireCopyButton(root);
	}
	// "deal" type is a plain anchor — no JS wiring needed.
};

const initAll = () => {
	const roots = document.querySelectorAll('.wp-block-b-blocks-coupon-code');
	roots.forEach(initBlock);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
