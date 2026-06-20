/**
 * Anchor Navigation — frontend view script.
 *
 * Dependency-free. Handles:
 *  - Smooth scroll on link click (instant under reduced motion), with a
 *    configurable scroll offset so the target heading clears the sticky bar.
 *  - Optional show-after-scroll reveal once the window scrolls past a
 *    threshold (passive scroll + requestAnimationFrame throttle).
 *  - Scroll-spy active-link highlighting via IntersectionObserver; the
 *    topmost visible section wins. Only classes + aria-current change — focus
 *    is never moved on scroll.
 *
 * Also imports style.scss so the build emits view.css (referenced from
 * block.json as the front-end stylesheet).
 */
import './style.scss';

const reducedMotion =
	window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initBlock = (root) => {
	if (root.dataset.bbAnchorNavInit === '1') {
		return;
	}
	root.dataset.bbAnchorNavInit = '1';

	let config = { scrollOffset: 72, showAfterPx: 0, anchors: [] };
	try {
		const raw = root.getAttribute('data-bb-an-config');
		if (raw) {
			config = { ...config, ...JSON.parse(raw) };
		}
	} catch (e) {
		// Keep defaults on malformed config.
	}

	const links = Array.prototype.slice.call(root.querySelectorAll('.bb-an-link'));
	if (!links.length) {
		return;
	}

	// Map anchor id -> link element.
	const linkByAnchor = {};
	links.forEach((link) => {
		const anchor = link.getAttribute('data-anchor');
		if (anchor) {
			linkByAnchor[anchor] = link;
		}
	});

	const setActive = (anchor) => {
		links.forEach((link) => {
			const on = link.getAttribute('data-anchor') === anchor;
			link.classList.toggle('is-active', on);
			if (on) {
				link.setAttribute('aria-current', 'location');
			} else {
				link.removeAttribute('aria-current');
			}
		});
	};

	// --- Smooth scroll on click -----------------------------------------
	links.forEach((link) => {
		link.addEventListener('click', (event) => {
			const anchor = link.getAttribute('data-anchor');
			if (!anchor) {
				return;
			}
			const target = document.getElementById(anchor);
			if (!target) {
				return;
			}
			event.preventDefault();
			const top =
				target.getBoundingClientRect().top + window.pageYOffset - config.scrollOffset;
			window.scrollTo({
				top: Math.max(0, top),
				behavior: reducedMotion ? 'auto' : 'smooth',
			});
		});
	});

	// --- Show-after-scroll reveal ---------------------------------------
	if (config.showAfterPx > 0 && root.classList.contains('bb-an-revealable')) {
		let ticking = false;
		const evaluate = () => {
			ticking = false;
			const shouldShow = window.pageYOffset >= config.showAfterPx;
			root.classList.toggle('is-visible', shouldShow);
		};
		const onScroll = () => {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(evaluate);
			}
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		evaluate();
	}

	// --- Scroll-spy (active link highlight) -----------------------------
	const anchors = Array.isArray(config.anchors) ? config.anchors : [];
	const targets = anchors
		.map((anchor) => document.getElementById(anchor))
		.filter((el) => !!el);

	if (!targets.length || typeof IntersectionObserver === 'undefined') {
		return;
	}

	const visible = new Set();

	const updateFromVisible = () => {
		if (!visible.size) {
			return;
		}
		// Topmost visible section wins.
		let best = null;
		let bestTop = Infinity;
		visible.forEach((el) => {
			const top = el.getBoundingClientRect().top;
			if (top < bestTop) {
				bestTop = top;
				best = el;
			}
		});
		if (best && best.id && linkByAnchor[best.id]) {
			setActive(best.id);
		}
	};

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					visible.add(entry.target);
				} else {
					visible.delete(entry.target);
				}
			});
			updateFromVisible();
		},
		{
			threshold: 0,
			rootMargin: `-${config.scrollOffset}px 0px -40% 0px`,
		}
	);

	targets.forEach((el) => observer.observe(el));
};

const init = () => {
	document.querySelectorAll('.bb-an[data-bb-an-config]').forEach(initBlock);
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
