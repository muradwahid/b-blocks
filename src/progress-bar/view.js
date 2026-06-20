import './style.scss';

/**
 * Frontend hydration for the bBlocks Progress Bar.
 *
 * Reads data attributes from each .pbFill node and animates its width from
 * 0% to the target value when the bar enters the viewport. Honors
 * prefers-reduced-motion by snapping straight to the target with no
 * transition. Falls back to an immediate render if IntersectionObserver
 * is unavailable.
 */
document.addEventListener('DOMContentLoaded', function () {
	const bars = document.querySelectorAll('.wp-block-b-blocks-progress-bar .pbFill');

	if (!bars.length) {
		return;
	}

	const prefersReducedMotion = typeof window.matchMedia === 'function'
		&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const applyFinalValue = (fillEl, target) => {
		const clamped = Math.max(0, Math.min(100, target));
		fillEl.style.width = clamped + '%';
	};

	const setupBar = (fillEl) => {
		const target = parseFloat(fillEl.getAttribute('data-target')) || 0;
		const animate = fillEl.getAttribute('data-animate') === '1';

		if (!animate || prefersReducedMotion) {
			// Snap directly to final value without transition.
			fillEl.style.transitionDuration = '0ms';
			applyFinalValue(fillEl, target);
			return;
		}

		// Double rAF ensures the browser has painted the initial 0% width
		// (inlined in PHP) before we set the target, so the CSS transition
		// plays reliably from 0% to the target value.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				applyFinalValue(fillEl, target);
			});
		});
	};

	if (typeof window.IntersectionObserver !== 'function') {
		bars.forEach(setupBar);
		return;
	}

	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				setupBar(entry.target);
				obs.unobserve(entry.target);
			}
		});
	}, { threshold: 0.3 });

	bars.forEach((bar) => {
		observer.observe(bar);
	});
});
