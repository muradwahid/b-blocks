import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import './style.scss';
import Swiper from 'swiper';
document.addEventListener('DOMContentLoaded', () => {
	const carouselEls = document.querySelectorAll('.wp-block-b-blocks-carousel');
	carouselEls.forEach(carouselEl => {
		const wrapperEl = carouselEl.querySelector('.bBlocks-carousel-wrapper');
		if (!wrapperEl) return;
		const el = wrapperEl.querySelector('.swiper');
		let config = {};
		try {
			const raw = wrapperEl.dataset.swiperconfig;
			config = JSON.parse(decodeURIComponent(raw));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn('Carousel config error', error);
		}
		console.log(config)

		if (!el) return;

		const slides = el.querySelectorAll('.swiper-slide');
		if (!slides.length) return;

		if (el.swiper) return;

		const { pagination, autoplay, layout, options } = config;

		const nextBtn = wrapperEl.querySelector('.swiper-button-next');
		const prevBtn = wrapperEl.querySelector('.swiper-button-prev');
		const paginationEl = carouselEl.querySelector('.swiper-pagination')

		const swiper = new Swiper(el, {
			modules: [A11y, Autoplay, Navigation, Pagination],

			slidesPerView: layout?.slideView?.mobile,
			spaceBetween: layout?.space?.mobile,
			loop: options?.loop,
			speed: options?.speed *1000,
			autoHeight: options?.autoHeight,

			autoplay: autoplay?.autoplay ? {
				delay: autoplay?.delay,
				disableOnInteraction: true,
				pauseOnMouseEnter: autoplay?.isPauseOnHover,
				reverseDirection: autoplay?.direction === 'left'
			} : false,

			breakpoints: {
			641: {
				slidesPerView: layout?.slideView?.tablet,
				spaceBetween: layout?.space?.tablet,
			},
			1025: {
				slidesPerView: layout?.slideView?.desktop,
				spaceBetween: layout?.space?.desktop,
			},
		},

			navigation: nextBtn && prevBtn ? { nextEl: nextBtn, prevEl: prevBtn } : false,

			pagination: pagination?.pagination? {
				el: paginationEl,
				clickable: pagination?.clickable,
				dynamicBullets: pagination?.dynamicPagination,
			} : false,
			
			// scrollbar: false,
			allowTouchMove: options?.touchMove,
			preventClicks: false,
			preventClicksPropagation: false,
			touchStartPreventDefault: false,
			touchStartForcePreventDefault: false
		});

		requestAnimationFrame(() => {
			swiper.update();
			swiper.updateSize();
			swiper.updateSlides();
		});
		window.addEventListener('resize', () => {
			swiper.update();
		});

		let autoplayTimer = null;

		const pauseThenResumeAutoplay = () => {
			if (!swiper.autoplay) return;
			swiper.autoplay.stop();

			if (autoplayTimer) clearTimeout(autoplayTimer);

			autoplayTimer = setTimeout(() => {
				if (swiper && swiper.autoplay) swiper.autoplay.start();
			}, 2000);
		};

		nextBtn?.addEventListener('click', (e) => {
			e.preventDefault();
			swiper.slideNext();
			pauseThenResumeAutoplay();
		});

		prevBtn?.addEventListener('click', (e) => {
			e.preventDefault();
			swiper.slidePrev();
			pauseThenResumeAutoplay();
		});


		wrapperEl.removeAttribute('data-swiperconfig');
	});
});
