/**
 * Click to Share Block — frontend entry point.
 *
 * Responsibilities:
 *   1. Intercept share-link clicks and open the share intent URL inside a
 *      compact popup window (the anchor's href is still valid so right-click
 *      → "Open in new tab" and no-JS visitors continue to work).
 *   2. Wire the Copy Link button to write the quote + page URL to the
 *      clipboard (with an execCommand fallback for insecure contexts) and
 *      announce success via an aria-live region.
 *
 * Per-instance scoping with a `data-bb-cts-init` guard prevents double-bind
 * if this file is ever included more than once on a page.
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

const openSharePopup = (url) => {
	if (!url) {
		return false;
	}
	const width = 600;
	const height = 540;
	const screenLeft = typeof window.screenLeft === 'number' ? window.screenLeft : window.screenX || 0;
	const screenTop = typeof window.screenTop === 'number' ? window.screenTop : window.screenY || 0;
	const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1024;
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 768;
	const left = Math.max(0, screenLeft + Math.round((viewportWidth - width) / 2));
	const top = Math.max(0, screenTop + Math.round((viewportHeight - height) / 2));

	const features = [
		`width=${width}`,
		`height=${height}`,
		`top=${top}`,
		`left=${left}`,
		'menubar=no',
		'toolbar=no',
		'location=no',
		'status=no',
		'scrollbars=yes',
		'resizable=yes',
		'noopener=yes',
		'noreferrer=yes'
	].join(',');

	const popup = window.open(url, 'bbClickToShare', features);
	if (popup) {
		try {
			popup.opener = null;
		} catch (_e) {
			// Cross-origin write may throw — safe to ignore.
		}
		try {
			popup.focus();
		} catch (_e) {
			// Same.
		}
		return true;
	}
	return false;
};

const wireShareLink = (link) => {
	link.addEventListener('click', (event) => {
		if (link.getAttribute('data-popup') !== '1') {
			// Email (mailto:) — let the browser handle it natively.
			return;
		}
		// Honor modifier-clicks so power users can open in a new tab/window.
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
			return;
		}
		const url = link.getAttribute('href');
		if (!url) {
			return;
		}
		if (openSharePopup(url)) {
			event.preventDefault();
		}
		// If the popup was blocked, fall through to the default anchor
		// navigation so the share still happens (in a new tab via target).
	});
};

const wireCopyButton = (root, btn) => {
	const text = btn.getAttribute('data-copy-text') || '';
	const defaultLabel = btn.getAttribute('data-copy-label') || 'Copy Link';
	const copiedLabel = btn.getAttribute('data-copied-label') || 'Copied!';
	const labelSpan = btn.querySelector('.bb-cts-btn__text');
	const liveEl = root.querySelector('.bb-cts-live');

	let resetTimer = 0;

	const onSuccess = () => {
		btn.classList.add('is-copied');
		btn.setAttribute('aria-label', copiedLabel);
		if (labelSpan) {
			labelSpan.textContent = copiedLabel;
		}
		if (liveEl) {
			liveEl.textContent = copiedLabel;
		}

		if (resetTimer) {
			clearTimeout(resetTimer);
		}
		resetTimer = window.setTimeout(() => {
			btn.classList.remove('is-copied');
			btn.setAttribute('aria-label', defaultLabel);
			if (labelSpan) {
				labelSpan.textContent = defaultLabel;
			}
			if (liveEl) {
				liveEl.textContent = '';
			}
			resetTimer = 0;
		}, COPY_RESET_MS);
	};

	btn.addEventListener('click', () => {
		if (!text) {
			return;
		}
		if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
			navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
				if (fallbackCopy(text)) {
					onSuccess();
				}
			});
		} else if (fallbackCopy(text)) {
			onSuccess();
		}
	});
};

const initBlock = (root) => {
	if (!root || root.getAttribute('data-bb-cts-init') === '1') {
		return;
	}
	root.setAttribute('data-bb-cts-init', '1');

	const links = root.querySelectorAll('a.bb-cts-btn');
	links.forEach(wireShareLink);

	const copyBtn = root.querySelector('button.bb-cts-btn--copy');
	if (copyBtn) {
		wireCopyButton(root, copyBtn);
	}
};

const initAll = () => {
	const roots = document.querySelectorAll('.wp-block-b-blocks-click-to-share');
	roots.forEach(initBlock);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
