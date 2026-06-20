/**
 * Scroll Reveal — frontend view script.
 *
 * Reveals each `[data-bb-scroll-reveal]` wrapper with a fade + slide entrance
 * when it scrolls into view, using a shared IntersectionObserver per unique
 * threshold value. Everything is progressive enhancement:
 *
 *  - The pre-animation hidden state (opacity:0 + transform) is applied ONLY by
 *    this script, so with JS disabled the content is fully visible.
 *  - `prefers-reduced-motion: reduce` short-circuits all animation: content is
 *    left/shown immediately. A `change` listener handles mid-session OS toggles.
 *  - While hidden, the wrapper receives `inert` so off-screen, opacity-0
 *    children are kept out of the keyboard tab order; `inert` is removed the
 *    moment the reveal fires.
 *
 * No libraries, no innerHTML, no requestAnimationFrame polling — the animation
 * is driven entirely by CSS transitions triggered by inline style changes.
 */

import './style.scss';

const SELECTOR = '[data-bb-scroll-reveal]';
const INIT_FLAG = 'bbSrInit';

const readInt = (el, attr, fallback) => {
	const raw = parseInt(el.getAttribute(attr) || '', 10);
	return Number.isNaN(raw) ? fallback : raw;
};

const readFloat = (el, attr, fallback) => {
	const raw = parseFloat(el.getAttribute(attr) || '');
	return Number.isNaN(raw) ? fallback : raw;
};

// Pre-animation transform for each preset.
const hiddenTransform = (animation, distance) => {
	switch (animation) {
		case 'fade-up':
			return `translate3d(0, ${distance}px, 0)`;
		case 'fade-down':
			return `translate3d(0, -${distance}px, 0)`;
		case 'fade-left':
			return `translate3d(${distance}px, 0, 0)`;
		case 'fade-right':
			return `translate3d(-${distance}px, 0, 0)`;
		default:
			return 'none';
	}
};

const showImmediately = (el) => {
	el.style.opacity = '';
	el.style.transform = '';
	el.style.transition = '';
	el.removeAttribute('inert');
	el.classList.add('bb-sr-revealed');
};

const applyHidden = (el, cfg) => {
	el.style.opacity = '0';
	el.style.transform = hiddenTransform(cfg.animation, cfg.distance);
	el.style.transition = 'none';
	el.setAttribute('inert', '');
	el.classList.add('bb-sr-init');
	el.classList.remove('bb-sr-revealed');
};

const reveal = (el, cfg) => {
	el.style.transition = `opacity ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms, transform ${cfg.duration}ms ${cfg.easing} ${cfg.delay}ms`;
	el.style.opacity = '1';
	el.style.transform = 'none';
	el.removeAttribute('inert');
	el.classList.add('bb-sr-revealed');
};

const unreveal = (el, cfg) => {
	el.style.transition = `opacity ${cfg.duration}ms ${cfg.easing}, transform ${cfg.duration}ms ${cfg.easing}`;
	el.style.opacity = '0';
	el.style.transform = hiddenTransform(cfg.animation, cfg.distance);
	el.setAttribute('inert', '');
	el.classList.remove('bb-sr-revealed');
};

const buildConfig = (el) => ({
	animation: el.getAttribute('data-bb-animation') || 'fade-up',
	duration: Math.min(2000, Math.max(200, readInt(el, 'data-bb-duration', 600))),
	delay: Math.min(2000, Math.max(0, readInt(el, 'data-bb-delay', 0))),
	easing: ['ease-out', 'ease-in-out', 'linear'].includes(
		el.getAttribute('data-bb-easing') || ''
	)
		? el.getAttribute('data-bb-easing')
		: 'ease-out',
	distance: Math.min(120, Math.max(10, readInt(el, 'data-bb-translate', 40))),
	threshold: Math.min(0.5, Math.max(0, readFloat(el, 'data-bb-threshold', 0.15))),
	once: el.getAttribute('data-bb-once') !== '0',
});

let observers = new Map();
let configs = new WeakMap();
let prefersReduced = false;

const observerFor = (threshold) => {
	if (observers.has(threshold)) {
		return observers.get(threshold);
	}
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const el = entry.target;
				const cfg = configs.get(el);
				if (!cfg) {
					return;
				}
				if (entry.isIntersecting) {
					reveal(el, cfg);
					if (cfg.once) {
						observer.unobserve(el);
					}
				} else if (!cfg.once) {
					unreveal(el, cfg);
				}
			});
		},
		{ threshold }
	);
	observers.set(threshold, observer);
	return observer;
};

const teardownObservers = () => {
	observers.forEach((observer) => observer.disconnect());
	observers = new Map();
};

const init = () => {
	const elements = Array.prototype.slice.call(document.querySelectorAll(SELECTOR));
	if (!elements.length) {
		return;
	}

	if (window.matchMedia) {
		prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	elements.forEach((el) => {
		if (el.dataset[INIT_FLAG]) {
			return;
		}
		el.dataset[INIT_FLAG] = '1';

		const cfg = buildConfig(el);
		configs.set(el, cfg);

		if (prefersReduced || typeof IntersectionObserver === 'undefined') {
			showImmediately(el);
			return;
		}

		applyHidden(el, cfg);
		// Force a reflow so the transition runs from the hidden state.
		// eslint-disable-next-line no-unused-expressions
		el.offsetHeight;
		observerFor(cfg.threshold).observe(el);
	});
};

// Respond to a mid-session OS reduced-motion toggle.
const handleMotionChange = (matches) => {
	prefersReduced = matches;
	if (!matches) {
		return;
	}
	teardownObservers();
	document.querySelectorAll(SELECTOR).forEach((el) => showImmediately(el));
};

const start = () => {
	init();
	if (window.matchMedia) {
		const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
		const onChange = (event) => handleMotionChange(event.matches);
		if (typeof mql.addEventListener === 'function') {
			mql.addEventListener('change', onChange);
		} else if (typeof mql.addListener === 'function') {
			mql.addListener(onChange);
		}
	}
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', start);
} else {
	start();
}
