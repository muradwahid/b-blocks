import './style.scss';

/**
 * Frontend hydration for the bBlocks Progress Circle.
 *
 * Each `.pcVisual` node carries data attributes (percentage, circumference,
 * target offset, animation toggle, duration, label prefix/suffix). On scroll
 * into view, the SVG fill arc transitions from "empty" (stroke-dashoffset
 * = circumference) to the target offset, while the center label counter
 * tweens from 0 to the target value via requestAnimationFrame. Honors
 * prefers-reduced-motion and gracefully degrades when IntersectionObserver
 * is unavailable.
 */
document.addEventListener('DOMContentLoaded', function () {
	const visuals = document.querySelectorAll('.wp-block-b-blocks-progress-circle .pcVisual');

	if (!visuals.length) {
		return;
	}

	const prefersReducedMotion = typeof window.matchMedia === 'function'
		&& window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

	const formatNumber = (value) => {
		// Render integers without a decimal point; preserve up to 2 dp for
		// fractional targets while trimming trailing zeros.
		if (Number.isInteger(value)) {
			return String(value);
		}
		return value.toFixed(2).replace(/\.?0+$/, '');
	};

	const applyFinalState = (visual) => {
		const fill = visual.querySelector('.pcFill');
		const label = visual.querySelector('.pcLabel');
		const targetOffset = parseFloat(visual.getAttribute('data-target-offset'));

		if (fill && !Number.isNaN(targetOffset)) {
			fill.style.transition = 'none';
			fill.style.strokeDashoffset = String(targetOffset);
		}

		if (label) {
			const finalLabel = label.getAttribute('data-final-label');
			if (finalLabel !== null) {
				label.textContent = finalLabel;
			}
		}
	};

	const runAnimation = (visual) => {
		const fill = visual.querySelector('.pcFill');
		const label = visual.querySelector('.pcLabel');
		const percentage = parseFloat(visual.getAttribute('data-percentage')) || 0;
		const targetOffset = parseFloat(visual.getAttribute('data-target-offset'));
		const duration = Math.max(1, parseInt(visual.getAttribute('data-duration'), 10) || 1200);
		const labelType = visual.getAttribute('data-label-type') || 'percentage';
		const labelPrefix = visual.getAttribute('data-label-prefix') || '';
		const labelSuffix = visual.getAttribute('data-label-suffix') || '';

		if (!fill || Number.isNaN(targetOffset)) {
			return;
		}

		// Trigger the CSS stroke-dashoffset transition after the browser has
		// painted the initial (empty) state. Double rAF guarantees a paint
		// has happened between the two frames.
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				fill.style.strokeDashoffset = String(targetOffset);
			});
		});

		// Tween the center label counter independently. Only animate the
		// number when the label is a percentage; custom labels are static.
		if (label && labelType === 'percentage') {
			const startTime = performance.now();
			let rafId = 0;

			const step = (now) => {
				const elapsed = now - startTime;
				const progress = Math.min(1, elapsed / duration);
				const eased = easeOutCubic(progress);
				const current = percentage * eased;

				label.textContent = labelPrefix + formatNumber(
					Number.isInteger(percentage) ? Math.round(current) : Math.round(current * 100) / 100
				) + labelSuffix;

				if (progress < 1) {
					rafId = requestAnimationFrame(step);
					// Keep the stored ID current so callers can cancel mid-tween.
					visual._bbProgressCircleRafId = rafId;
				} else {
					visual._bbProgressCircleRafId = 0;
					const finalLabel = label.getAttribute('data-final-label');
					if (finalLabel !== null) {
						label.textContent = finalLabel;
					}
				}
			};

			rafId = requestAnimationFrame(step);

			// Store the current rAF id on the element. Updated on every step so
			// it is always valid; callers may cancelAnimationFrame(visual._bbProgressCircleRafId).
			visual._bbProgressCircleRafId = rafId;
		} else if (label) {
			const finalLabel = label.getAttribute('data-final-label');
			if (finalLabel !== null) {
				label.textContent = finalLabel;
			}
		}
	};

	const setupVisual = (visual) => {
		const animate = visual.getAttribute('data-animate') === '1';

		if (!animate || prefersReducedMotion) {
			applyFinalState(visual);
			return;
		}

		runAnimation(visual);
	};

	if (typeof window.IntersectionObserver !== 'function') {
		visuals.forEach(setupVisual);
		return;
	}

	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				setupVisual(entry.target);
				obs.unobserve(entry.target);
			}
		});
	}, { threshold: 0.3 });

	visuals.forEach((visual) => {
		observer.observe(visual);
	});
});
