/**
 * Typing Headline Block — frontend entry point.
 *
 * Responsibilities:
 *   1. Bundle Typed.js (no CDN at runtime).
 *   2. On DOMContentLoaded, find every `.bb-th-animated[data-bb-th-config]`
 *      element in the page and start an isolated Typed.js instance.
 *   3. Respect `prefers-reduced-motion: reduce` — skip Typed entirely and
 *      render the rotating words as a single comma-joined static string.
 *   4. Per-instance scoping is enforced with a `data-bb-th-init` guard so
 *      that a second invocation of this file (e.g. Gutenberg block
 *      previews on the frontend) does not double-bind handlers.
 *
 * The wrapper heading itself carries an `aria-label` listing every word
 * + prefix + suffix so screen readers receive the full meaning in one
 * pass — the animated span is `aria-hidden="true"` and is therefore not
 * announced. This file does NOT modify the aria-label.
 */

import './style.scss';

import Typed from 'typed.js';

const prefersReducedMotion = () => {
	try {
		return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	} catch (_e) {
		return false;
	}
};

const parseConfig = (raw) => {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object') return null;
		if (!Array.isArray(parsed.strings) || parsed.strings.length === 0) return null;
		return parsed;
	} catch (_e) {
		return null;
	}
};

const initInstance = (el) => {
	if (!el || el.getAttribute('data-bb-th-init') === '1') {
		return;
	}
	el.setAttribute('data-bb-th-init', '1');

	const cfg = parseConfig(el.getAttribute('data-bb-th-config'));
	if (!cfg) {
		return;
	}

	const words = (cfg.strings || [])
		.map((w) => (w == null ? '' : String(w)))
		.filter((w) => w.length > 0);
	if (words.length === 0) {
		return;
	}

	// Per-word color overrides (empty string = inherit --bb-th-animated-color).
	// Validated server-side; safe to read as-is.
	const colors = Array.isArray(cfg.colors) ? cfg.colors : [];

	// --- Reduced-motion fallback: show every word at once, no animation.
	if (prefersReducedMotion()) {
		el.textContent = words.join(', ');
		return;
	}

	// Typed.js needs the target to be empty before it takes over (it
	// will write its own children incl. the cursor span).
	el.textContent = '';

	const options = {
		strings: words,
		typeSpeed: Number.isFinite(cfg.typeSpeed) ? cfg.typeSpeed : 80,
		backSpeed: Number.isFinite(cfg.backSpeed) ? cfg.backSpeed : 40,
		backDelay: Number.isFinite(cfg.backDelay) ? cfg.backDelay : 1500,
		startDelay: Number.isFinite(cfg.startDelay) ? cfg.startDelay : 300,
		loop: cfg.loop !== false,
		smartBackspace: cfg.smartBackspace !== false,
		showCursor: cfg.showCursor !== false,
		cursorChar: typeof cfg.cursorChar === 'string' && cfg.cursorChar.length > 0
			? cfg.cursorChar.charAt(0)
			: '|',
		// Important: Typed.js by default re-uses the contents of the
		// target element if `stringsElement` is set. We pass `strings`
		// directly, so we don't want it to read DOM either way.
		contentType: 'null',
		autoInsertCss: false,
		// Apply per-word color override at the start of each string.
		preStringTyped: (arrayPos) => {
			const override = typeof colors[arrayPos] === 'string' ? colors[arrayPos].trim() : '';
			el.style.color = override || '';
		},
	};

	try {
		const instance = new Typed(el, options);
		// Stash the instance reference for potential teardown, but don't
		// hold a global — that risks leaking memory if a page has many
		// blocks. The instance lives as long as `el` lives.
		el._bbThTyped = instance;
	} catch (_e) {
		// On any unexpected failure, fall back to plain text so the
		// heading remains readable.
		el.textContent = words.join(', ');
	}
};

const initAll = () => {
	const targets = document.querySelectorAll('.bb-th-animated[data-bb-th-config]');
	targets.forEach(initInstance);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAll);
} else {
	initAll();
}
