/**
 * Parallax Section — frontend view script.
 *
 * Hydrates scroll-driven parallax for every
 * `.bb-px[data-parallax-mode="scroll"]` section:
 *  - Reads speed / mobile-disable flags from data-* attributes.
 *  - Honours prefers-reduced-motion (skips all transforms → static background).
 *  - Skips registration when disableOnMobile is set and the viewport is < 768px.
 *  - The single scroll listener is passive and throttled with requestAnimationFrame.
 *
 * No-JS fallback: render.php already paints the background statically (the
 * --bblocks-parallax-offset custom property defaults to 0px), so content is
 * never hidden before this script runs.
 */
import './style.scss';

const init = () => {
	const reduceMotion =
		window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const isMobile = window.innerWidth < 768;

	const sections = Array.prototype.slice.call(
		document.querySelectorAll('.bb-px[data-parallax-mode="scroll"]')
	);

	// Build the list of sections we will actually animate.
	const active = sections.filter((section) => {
		if (reduceMotion) return false;
		const disableMobile = section.getAttribute('data-disable-mobile') === '1';
		if (disableMobile && isMobile) return false;
		return true;
	});

	if (active.length === 0) {
		return;
	}

	const entries = active.map((section) => {
		let speed = parseInt(section.getAttribute('data-parallax-speed'), 10);
		if (Number.isNaN(speed)) speed = 40;
		speed = Math.max(0, Math.min(100, speed));
		const bg = section.querySelector('.bb-px-bg');
		return { section, bg, speed };
	}).filter((entry) => entry.bg);

	if (entries.length === 0) {
		return;
	}

	// Must match the background overscan in render.php / Common/style.js:
	// the .bb-px-bg is sized `top:-30%;height:160%`, giving 30% of the section
	// height of spare buffer above and below. Travel is clamped to this so the
	// image can never slide out of its container and reveal the fallback color.
	const OVERSCAN = 0.3;

	let ticking = false;

	const update = () => {
		const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

		entries.forEach(({ section, bg, speed }) => {
			const rect = section.getBoundingClientRect();

			// Skip work for sections far outside the viewport.
			if (rect.bottom < -viewportHeight || rect.top > viewportHeight * 2) {
				return;
			}

			const height = rect.height;

			// How far the section center has travelled relative to viewport center.
			const sectionCenter = rect.top + height / 2;
			const fromCenter = sectionCenter - viewportHeight / 2;

			// Normalise to [-1, 1] over the full passage of the section through
			// the viewport (center at bottom edge → 1, at top edge → -1).
			const range = (viewportHeight + height) / 2 || 1;
			const normalized = Math.max(-1, Math.min(1, fromCenter / range));

			// Bound the travel to the overscan buffer; speed scales intensity.
			const maxTravel = height * OVERSCAN;
			const offset = -normalized * maxTravel * (speed / 100);
			bg.style.setProperty('--bblocks-parallax-offset', `${offset.toFixed(2)}px`);
		});

		ticking = false;
	};

	const onScroll = () => {
		if (!ticking) {
			ticking = true;
			window.requestAnimationFrame(update);
		}
	};

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll, { passive: true });

	// Initial paint.
	update();
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
