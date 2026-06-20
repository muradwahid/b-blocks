/**
 * Image Slider — frontend behavior (vanilla JS slide engine).
 *
 * No external slider library: a lean custom engine drives slide/fade
 * transitions, thumbnails, dots, arrows, autoplay, and a <dialog> lightbox.
 */
import { __ } from '@wordpress/i18n';
import './style.scss';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const initSlider = root => {
	if (root.dataset.bbIsInit === 'true') {
		return;
	}
	root.dataset.bbIsInit = 'true';

	let config = {};
	try {
		config = JSON.parse(root.dataset.bbIsConfig || '{}');
	} catch (e) {
		config = {};
	}

	const track = root.querySelector('.bb-is-track');
	const slides = Array.from(root.querySelectorAll('.bb-is-slide'));
	const dots = Array.from(root.querySelectorAll('.bb-is-dot'));
	const thumbs = Array.from(root.querySelectorAll('.bb-is-thumb'));
	const prevBtn = root.querySelector('.bb-is-prev');
	const nextBtn = root.querySelector('.bb-is-next');

	if (!track || slides.length === 0) {
		return;
	}

	const total = slides.length;
	const isFade = config.effect === 'fade';
	const isMulti = config.layout === 'multi';
	const loop = config.loop !== false;
	let currentIndex = 0;
	let userInteracted = false;

	const clamp = i => Math.max(0, Math.min(total - 1, i));

	const setTrackTransition = () => {
		if (REDUCED_MOTION) {
			track.style.transition = 'none';
		} else {
			track.style.transition = '';
		}
	};
	setTrackTransition();

	const updateA11y = () => {
		slides.forEach((slide, i) => {
			const active = i === currentIndex;
			const link = slide.querySelector('.bb-is-media');
			if (active) {
				slide.removeAttribute('aria-hidden');
				if (link) {
					link.removeAttribute('tabindex');
				}
			} else {
				slide.setAttribute('aria-hidden', 'true');
				if (link) {
					link.setAttribute('tabindex', '-1');
				}
			}
			slide.classList.toggle('is-active', active);
		});

		dots.forEach((dot, i) => {
			const active = i === currentIndex;
			dot.classList.toggle('is-active', active);
			dot.setAttribute('aria-current', active ? 'true' : 'false');
		});

		thumbs.forEach((thumb, i) => {
			const active = i === currentIndex;
			thumb.classList.toggle('is-active', active);
			if (active) {
				thumb.scrollIntoView({
					behavior: REDUCED_MOTION ? 'auto' : 'smooth',
					inline: 'center',
					block: 'nearest'
				});
			}
		});

		if (!loop) {
			if (prevBtn) {
				prevBtn.disabled = currentIndex === 0;
				prevBtn.setAttribute('aria-disabled', currentIndex === 0 ? 'true' : 'false');
			}
			if (nextBtn) {
				nextBtn.disabled = currentIndex === total - 1;
				nextBtn.setAttribute('aria-disabled', currentIndex === total - 1 ? 'true' : 'false');
			}
		}
	};

	const render = () => {
		if (isFade) {
			// Fade is purely class-driven (CSS handles opacity).
			track.style.transform = '';
		} else if (isMulti) {
			const slide = slides[0];
			const slideWidth = slide.getBoundingClientRect().width;
			const styles = window.getComputedStyle(track);
			const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
			const offset = currentIndex * (slideWidth + gap);
			// Avoid overscrolling past the last full view.
			const maxOffset = Math.max(0, track.scrollWidth - root.querySelector('.bb-is-viewport').clientWidth);
			track.style.transform = `translateX(-${Math.min(offset, maxOffset)}px)`;
		} else {
			track.style.transform = `translateX(-${currentIndex * 100}%)`;
		}
		updateA11y();
	};

	const goTo = (index, fromUser = false) => {
		if (fromUser) {
			userInteracted = true;
			stopAutoplay();
		}
		if (loop) {
			if (index < 0) {
				index = total - 1;
			} else if (index > total - 1) {
				index = 0;
			}
		} else {
			index = clamp(index);
		}
		currentIndex = index;
		render();
	};

	const next = fromUser => goTo(currentIndex + 1, fromUser);
	const prev = fromUser => goTo(currentIndex - 1, fromUser);

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

	// ---- Thumbnails ----
	thumbs.forEach((thumb, i) => {
		thumb.addEventListener('click', () => goTo(i, true));
	});

	// ---- Keyboard (scoped to the region) ----
	root.addEventListener('keydown', e => {
		if (e.target.closest('.bb-is-thumbs')) {
			return;
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev(true);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			next(true);
		}
	});

	// ---- Touch / drag ----
	let startX = 0;
	let dragging = false;

	const onStart = x => {
		startX = x;
		dragging = true;
	};
	const onEnd = x => {
		if (!dragging) {
			return;
		}
		dragging = false;
		const delta = x - startX;
		if (Math.abs(delta) > 50) {
			if (delta < 0) {
				next(true);
			} else {
				prev(true);
			}
		}
	};

	track.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
	track.addEventListener('touchend', e => onEnd(e.changedTouches[0].clientX), { passive: true });
	track.addEventListener('mousedown', e => {
		// Ignore drag start on links so clicks still open the lightbox.
		onStart(e.clientX);
	});
	window.addEventListener('mouseup', e => {
		if (dragging) {
			onEnd(e.clientX);
		}
	});

	// ---- Autoplay ----
	let autoplayTimer = null;

	function startAutoplay() {
		if (!config.autoplay || REDUCED_MOTION || userInteracted || total < 2) {
			return;
		}
		if (autoplayTimer) {
			return;
		}
		autoplayTimer = window.setInterval(() => {
			next(false);
		}, Math.max(500, config.autoplayDelay || 3000));
	}

	function stopAutoplay() {
		if (autoplayTimer) {
			window.clearInterval(autoplayTimer);
			autoplayTimer = null;
		}
	}

	if (config.autoplay && !REDUCED_MOTION) {
		if (config.pauseOnHover) {
			root.addEventListener('mouseenter', stopAutoplay);
			root.addEventListener('mouseleave', () => {
				if (!userInteracted) {
					startAutoplay();
				}
			});
		}

		// Pause when out of the viewport.
		if ('IntersectionObserver' in window) {
			const io = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						if (!userInteracted) {
							startAutoplay();
						}
					} else {
						stopAutoplay();
					}
				});
			}, { threshold: 0.1 });
			io.observe(root);
		} else {
			startAutoplay();
		}
	}

	// ---- Lightbox ----
	if (config.lightbox) {
		setupLightbox(root, slides, () => currentIndex, goTo);
	}

	// Recompute multi offsets on resize.
	if (isMulti) {
		let resizeRaf = null;
		window.addEventListener('resize', () => {
			if (resizeRaf) {
				window.cancelAnimationFrame(resizeRaf);
			}
			resizeRaf = window.requestAnimationFrame(render);
		});
	}

	render();
};

/**
 * Lazily build a native <dialog> lightbox shared by the slider.
 */
const setupLightbox = (root, slides, getIndex, goTo) => {
	const links = slides
		.map(slide => slide.querySelector('a.bb-is-media'))
		.filter(Boolean);

	if (links.length === 0) {
		return;
	}

	const items = links.map(link => ({
		full: link.dataset.bbIsFull || link.getAttribute('href') || '',
		alt: link.dataset.bbIsAlt || '',
		caption: link.dataset.bbIsCaption || '',
		trigger: link
	}));

	let dialog = null;
	let imgEl = null;
	let captionEl = null;
	let lbIndex = 0;
	let lastTrigger = null;

	const buildDialog = () => {
		dialog = document.createElement('dialog');
		dialog.className = 'bb-is-lightbox';
		dialog.setAttribute('aria-label', __('Image lightbox', 'b-blocks'));

		const inner = document.createElement('div');
		inner.className = 'bb-is-lb-inner';

		const closeBtn = document.createElement('button');
		closeBtn.type = 'button';
		closeBtn.className = 'bb-is-lb-close';
		closeBtn.setAttribute('aria-label', __('Close lightbox', 'b-blocks'));
		closeBtn.innerHTML = '&times;';

		const prevBtn = document.createElement('button');
		prevBtn.type = 'button';
		prevBtn.className = 'bb-is-lb-prev';
		prevBtn.setAttribute('aria-label', __('Previous image', 'b-blocks'));
		prevBtn.innerHTML = '&#8249;';

		const nextBtn = document.createElement('button');
		nextBtn.type = 'button';
		nextBtn.className = 'bb-is-lb-next';
		nextBtn.setAttribute('aria-label', __('Next image', 'b-blocks'));
		nextBtn.innerHTML = '&#8250;';

		imgEl = document.createElement('img');
		imgEl.className = 'bb-is-lb-img';
		imgEl.alt = '';
		imgEl.decoding = 'async';

		captionEl = document.createElement('div');
		captionEl.className = 'bb-is-lb-caption';

		inner.appendChild(closeBtn);
		if (items.length > 1) {
			inner.appendChild(prevBtn);
			inner.appendChild(nextBtn);
			prevBtn.addEventListener('click', () => showItem(lbIndex - 1));
			nextBtn.addEventListener('click', () => showItem(lbIndex + 1));
		}
		inner.appendChild(imgEl);
		inner.appendChild(captionEl);
		dialog.appendChild(inner);
		document.body.appendChild(dialog);

		closeBtn.addEventListener('click', closeLightbox);

		dialog.addEventListener('click', e => {
			if (e.target === dialog) {
				closeLightbox();
			}
		});

		dialog.addEventListener('keydown', e => {
			if (e.key === 'ArrowLeft' && items.length > 1) {
				e.preventDefault();
				showItem(lbIndex - 1);
			} else if (e.key === 'ArrowRight' && items.length > 1) {
				e.preventDefault();
				showItem(lbIndex + 1);
			}
		});

		dialog.addEventListener('close', () => {
			// Sync the slider to the last viewed image, then restore focus.
			goTo(lbIndex, true);
			if (lastTrigger) {
				lastTrigger.focus();
			}
		});
	};

	const showItem = index => {
		if (index < 0) {
			index = items.length - 1;
		} else if (index > items.length - 1) {
			index = 0;
		}
		lbIndex = index;
		const item = items[index];
		// Reset src to avoid eager-loading all images at once.
		imgEl.removeAttribute('src');
		imgEl.src = item.full;
		imgEl.alt = item.alt || '';
		captionEl.textContent = item.caption;
		captionEl.style.display = item.caption ? '' : 'none';
	};

	const closeLightbox = () => {
		if (dialog && dialog.open) {
			dialog.close();
		}
	};

	const openLightbox = index => {
		if (!dialog) {
			buildDialog();
		}
		lastTrigger = items[index] ? items[index].trigger : null;
		showItem(index);
		if (typeof dialog.showModal === 'function') {
			dialog.showModal();
		} else {
			dialog.setAttribute('open', '');
		}
		// Spec: first focusable element (close button) receives focus on open.
		const closeBtn = dialog.querySelector('.bb-is-lb-close');
		if (closeBtn) {
			closeBtn.focus();
		}
	};

	items.forEach((item, index) => {
		item.trigger.addEventListener('click', e => {
			e.preventDefault();
			openLightbox(index);
		});
	});
};

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.bb-is-slider').forEach(initSlider);
});
