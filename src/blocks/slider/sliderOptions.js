const sliderOptions = (attributes, initialSlide, isBackend = false) => {
	const { columns, columnGap, isLoop, isAutoplay, speed, effect, isTouchMove, isPageClickable, isPageDynamic } = attributes;

	return {
		// Optional parameters
		direction: 'horizontal',
		initialSlide,
		slidesPerView: columns?.mobile,
		breakpoints: {
			// when window width is >= 576px
			576: { slidesPerView: columns?.tablet },
			// when window width is >= 768px
			768: { slidesPerView: columns?.desktop },
		},
		spaceBetween: columnGap,
		loop: isLoop,
		allowTouchMove: isTouchMove,
		grabCursor: isTouchMove,
		// autoplay: false,
		autoplay: isAutoplay && !isBackend ? { delay: speed * 1000 } : false,
		speed: speed * 1000,
		effect,
		fadeEffect: { crossFade: true },
		creativeEffect: {
			prev: {
				shadow: true,
				translate: ['-120%', 0, -500],
			},
			next: {
				shadow: true,
				translate: ['120%', 0, -500],
			}
		},
		allowSlideNext: true,
		allowSlidePrev: true,
		autoHeight: false,
		notificationClass: null,

		// Controllers
		pagination: {
			el: '.swiper-pagination',
			clickable: isPageClickable,
			dynamicBullets: isPageDynamic
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		}
	}
}
export default sliderOptions;