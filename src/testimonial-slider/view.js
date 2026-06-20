/**
 * Testimonial Slider — frontend behavior (dependency-free carousel engine).
 *
 * Drives a per-instance slider: translateX paging, arrows, dots, touch swipe,
 * auto-play with pause-on-hover/focus and a play/pause toggle, and the
 * ARIA-APG carousel pattern. No external library, no innerHTML writes — only
 * style, classList, and aria-* mutations. Honors prefers-reduced-motion.
 */
import { __ } from '@wordpress/i18n';
import './style.scss';

const reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

const slidesVisibleForViewport = config => {
	const sv = config.slidesVisible || {};
	const width = window.innerWidth;
	if (width >= 1024) {
		return Math.max(1, parseInt(sv.desktop, 10) || 1);
	}
	if (width >= 768) {
		return Math.max(1, parseInt(sv.tablet, 10) || 1);
	}
	return Math.max(1, parseInt(sv.mobile, 10) || 1);
};

const initSlider = root => {
	if (root.dataset.bbTsInit === 'true') {
		return;
	}
	root.dataset.bbTsInit = 'true';

	let config = {};
	try {
		config = JSON.parse(root.dataset.bbTsConfig || '{}');
	} catch (e) {
		config = {};
	}

	const track = root.querySelector('.bb-ts-track');
	const slides = Array.from(root.querySelectorAll('.bb-ts-slide'));
	const dots = Array.from(root.querySelectorAll('.bb-ts-dot'));
	const prevBtn = root.querySelector('.bb-ts-prev');
	const nextBtn = root.querySelector('.bb-ts-next');
	const playBtn = root.querySelector('.bb-ts-playpause');

	if (!track || slides.length === 0) {
		return;
	}

	const total = slides.length;
	const loop = config.loop !== false;
	let reducedMotion = reducedMotionMQ.matches;
	let currentIndex = 0;
	let autoplayTimer = null;
	let isPaused = false;
	let userPausedViaButton = false;

	// How many full pages exist given the current slides-per-view.
	const maxIndex = () => {
		const perView = slidesVisibleForViewport(config);
		return Math.max(0, total - perView);
	};

	const clamp = i => Math.max(0, Math.min(maxIndex(), i));

	const applyTransition = () => {
		track.style.transition = reducedMotion
			? 'none'
			: `transform ${Math.max(0, parseInt(config.transitionSpeed, 10) || 400)}ms ease`;
	};

	const updateA11y = () => {
		const perView = slidesVisibleForViewport(config);
		slides.forEach((slide, i) => {
			const visible = i >= currentIndex && i < currentIndex + perView;
			if (visible) {
				slide.removeAttribute('aria-hidden');
			} else {
				slide.setAttribute('aria-hidden', 'true');
			}
			slide.classList.toggle('is-active', i === currentIndex);
			// Keep off-screen interactive content out of the tab order.
			slide.querySelectorAll('a, button').forEach(el => {
				if (visible) {
					el.removeAttribute('tabindex');
				} else {
					el.setAttribute('tabindex', '-1');
				}
			});
			slide.setAttribute('aria-current', i === currentIndex ? 'true' : 'false');
		});

		dots.forEach((dot, i) => {
			const active = i === currentIndex;
			dot.classList.toggle('is-active', active);
			dot.setAttribute('aria-selected', active ? 'true' : 'false');
		});

		if (!loop) {
			const atStart = currentIndex <= 0;
			const atEnd = currentIndex >= maxIndex();
			if (prevBtn) {
				prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
				prevBtn.classList.toggle('is-disabled', atStart);
			}
			if (nextBtn) {
				nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
				nextBtn.classList.toggle('is-disabled', atEnd);
			}
		}
	};

	const render = () => {
		const first = slides[0];
		const slideWidth = first.getBoundingClientRect().width;
		const styles = window.getComputedStyle(track);
		const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
		const offset = currentIndex * (slideWidth + gap);
		track.style.transform = `translateX(-${offset}px)`;
		updateA11y();
	};

	const goTo = (index, fromUser = false) => {
		if (loop) {
			const limit = maxIndex();
			if (index < 0) {
				index = limit;
			} else if (index > limit) {
				index = 0;
			}
		} else {
			index = clamp(index);
		}
		currentIndex = index;
		render();
		if (fromUser) {
			// A deliberate jump restarts the dwell timer so users get a full interval.
			restartAutoplay();
		}
	};

	const next = (fromUser = false) => goTo(currentIndex + 1, fromUser);
	const prev = (fromUser = false) => goTo(currentIndex - 1, fromUser);

	// ---- Autoplay ----
	const canAutoplay = () =>
		config.autoPlay && !reducedMotion && !userPausedViaButton && total > 1;

	const startAutoplay = () => {
		if (!canAutoplay() || isPaused || autoplayTimer) {
			return;
		}
		const speed = Math.max(1000, parseInt(config.autoPlaySpeed, 10) || 5000);
		autoplayTimer = window.setInterval(() => next(false), speed);
	};

	const stopAutoplay = () => {
		if (autoplayTimer) {
			window.clearInterval(autoplayTimer);
			autoplayTimer = null;
		}
	};

	const restartAutoplay = () => {
		stopAutoplay();
		startAutoplay();
	};

	const updatePlayButton = () => {
		if (!playBtn) {
			return;
		}
		const playing = canAutoplay() && !userPausedViaButton;
		playBtn.setAttribute('aria-pressed', playing ? 'false' : 'true');
		playBtn.setAttribute(
			'aria-label',
			playing
				? __('Pause testimonial auto-rotation', 'b-blocks')
				: __('Play testimonial auto-rotation', 'b-blocks')
		);
		playBtn.classList.toggle('is-paused', !playing);
	};

	// ---- Arrows ----
	if (prevBtn) {
		prevBtn.addEventListener('click', () => prev(true));
	}
	if (nextBtn) {
		nextBtn.addEventListener('click', () => next(true));
	}

	// ---- Dots ----
	dots.forEach((dot, i) => {
		dot.addEventListener('click', () => goTo(i, true));
	});

	// ---- Dot keyboard roving (Left/Right within the tablist) ----
	const dotsContainer = root.querySelector('.bb-ts-dots');
	if (dotsContainer) {
		dotsContainer.addEventListener('keydown', e => {
			if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
				return;
			}
			e.preventDefault();
			const dir = e.key === 'ArrowRight' ? 1 : -1;
			let target = currentIndex + dir;
			const limit = maxIndex();
			if (target < 0) {
				target = loop ? limit : 0;
			} else if (target > limit) {
				target = loop ? 0 : limit;
			}
			goTo(target, true);
			if (dots[target]) {
				dots[target].focus();
			}
		});
	}

	// ---- Play / Pause toggle ----
	if (playBtn) {
		playBtn.addEventListener('click', () => {
			userPausedViaButton = !userPausedViaButton;
			if (userPausedViaButton) {
				stopAutoplay();
			} else {
				startAutoplay();
			}
			updatePlayButton();
		});
	}

	// ---- Pause on hover / focus ----
	root.addEventListener('mouseenter', () => {
		isPaused = true;
		stopAutoplay();
	});
	root.addEventListener('mouseleave', () => {
		isPaused = false;
		startAutoplay();
	});
	root.addEventListener('focusin', () => {
		isPaused = true;
		stopAutoplay();
	});
	root.addEventListener('focusout', e => {
		if (!root.contains(e.relatedTarget)) {
			isPaused = false;
			startAutoplay();
		}
	});

	// ---- Touch swipe ----
	let startX = 0;
	let swiping = false;

	track.addEventListener(
		'touchstart',
		e => {
			startX = e.touches[0].clientX;
			swiping = true;
		},
		{ passive: true }
	);
	track.addEventListener(
		'touchend',
		e => {
			if (!swiping) {
				return;
			}
			swiping = false;
			const delta = e.changedTouches[0].clientX - startX;
			if (Math.abs(delta) > 50) {
				if (delta < 0) {
					next(true);
				} else {
					prev(true);
				}
			}
		},
		{ passive: true }
	);

	// ---- Resize: recompute offset and visible slides ----
	let resizeRaf = null;
	window.addEventListener('resize', () => {
		if (resizeRaf) {
			window.cancelAnimationFrame(resizeRaf);
		}
		resizeRaf = window.requestAnimationFrame(() => {
			currentIndex = clamp(currentIndex);
			render();
		});
	});

	// ---- React to OS reduced-motion changes mid-session ----
	const onReducedMotionChange = e => {
		reducedMotion = e.matches;
		applyTransition();
		if (reducedMotion) {
			stopAutoplay();
		} else {
			startAutoplay();
		}
		updatePlayButton();
	};
	if (typeof reducedMotionMQ.addEventListener === 'function') {
		reducedMotionMQ.addEventListener('change', onReducedMotionChange);
	} else if (typeof reducedMotionMQ.addListener === 'function') {
		reducedMotionMQ.addListener(onReducedMotionChange);
	}

	// ---- Pause when scrolled out of view ----
	if ('IntersectionObserver' in window) {
		const io = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						isPaused = false;
						startAutoplay();
					} else {
						isPaused = true;
						stopAutoplay();
					}
				});
			},
			{ threshold: 0.2 }
		);
		io.observe(root);
	}

	// ---- Boot ----
	applyTransition();
	render();
	updatePlayButton();
	startAutoplay();
};

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.bb-ts-slider').forEach(initSlider);
});
