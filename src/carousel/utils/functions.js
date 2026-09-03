/**
 * Vertical Swiper helpers.
 *
 * With a numeric `slidesPerView`, Swiper's updateSlides() sizes each slide as
 * `(containerSize - gaps) / slidesPerView` and writes that onto the slide --
 * and in vertical mode `getDirectionLabel('width')` resolves to `height`, so
 * every slide gets an inline pixel height instead of keeping its own content
 * height. Because Swiper reads that container size from `el.clientHeight`, an
 * auto-height container makes the two feed each other and the value runs away
 * (the 1.11848e+07px heights).
 *
 * So in vertical mode we hand Swiper `slidesPerView: 'auto'` -- it then
 * measures each slide instead of writing to it -- and give the container a
 * definite height derived from the slides that should be visible.
 */

/**
 * Resolve a { desktop, tablet, mobile } attribute for the current viewport.
 * Mirrors the `breakpoints` handed to Swiper: base = mobile, 641 = tablet, 1025 = desktop.
 */
export const getResponsiveValue = (values, width = window.innerWidth) => {
	if (width >= 1025) return values?.desktop;
	if (width >= 641) return values?.tablet;
	return values?.mobile;
};

/**
 * Natural height of the first `slideView` slides, plus the gaps between them.
 * Inline heights left behind by a previous Swiper instance are cleared first,
 * otherwise we would measure Swiper's own stale value instead of the content.
 */
export const getVerticalSlidesHeight = (swiperEl, slideView, space) => {
	const slides = Array.from(swiperEl.querySelectorAll('.swiper-slide'));
	if (!slides.length) return 0;

	slides.forEach(slide => {
		slide.style.height = '';
	});

	const perView = Math.max(1, Math.min(Math.round(slideView) || 1, slides.length));
	const gap = Number(space) || 0;

	const content = slides
		.slice(0, perView)
		.reduce((sum, slide) => sum + slide.getBoundingClientRect().height, 0);

	return Math.round(content + gap * (perView - 1));
};
