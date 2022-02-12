// Import Sass
import './style.scss';

// Swiper CSS
import 'swiper/css/bundle';

const $ = jQuery;

// Posts
document.addEventListener('DOMContentLoaded', () => {
	const allBBlocksPosts = document.querySelectorAll('.wp-block-b-blocks-posts');
	Object.values(allBBlocksPosts).map(posts => {
		const postsId = posts.id;

		// Slider
		const sliderEl = document.querySelector(`#${postsId} .bBlocksSliderPosts`);
		if (sliderEl) {
			const { layout, columns, columnGap, sliderIsLoop, sliderIsTouchMove, sliderIsAutoplay, sliderSpeed, sliderEffect, sliderIsPageClickable, sliderIsPageDynamic } = JSON.parse(sliderEl.dataset.slider);

			'slider' === layout && new Swiper(sliderEl, {
				// Optional parameters
				direction: 'horizontal',
				slidesPerView: columns?.mobile,
				breakpoints: {
					// when window width is >= 576px
					576: { slidesPerView: columns?.tablet },
					// when window width is >= 768px
					768: { slidesPerView: columns?.desktop },
				},
				spaceBetween: columnGap,
				loop: sliderIsLoop,
				allowTouchMove: sliderIsTouchMove,
				grabCursor: sliderIsTouchMove,
				autoplay: sliderIsAutoplay ? { delay: sliderSpeed * 1000 } : false,
				speed: sliderSpeed * 1000,
				effect: sliderEffect,
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
					clickable: sliderIsPageClickable,
					dynamicBullets: sliderIsPageDynamic
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				}
			});
		}

		const slideHeightArray = [];
		const swiperSlide = document.querySelectorAll(`#${postsId} .bBlocksSliderPosts .swiper-slide`);
		const swiperSlideText = document.querySelectorAll(`#${postsId} .bBlocksSliderPosts .swiper-slide .bBlocksPostText`);
		swiperSlideText?.length && swiperSlideText.forEach(slideText => {
			slideHeightArray.push(slideText?.clientHeight);
		});
		swiperSlide?.length && swiperSlide.forEach(slide => {
			slide.style.height = `${Math.max(...slideHeightArray)}px`;
		});

		// Remove data slider attributes
		sliderEl?.removeAttribute('data-slider');

		// Ticker
		const tickerEl = document.querySelector(`#${postsId} .bBlocksTickerPosts`);
		if (tickerEl) {
			const { rowGap } = JSON.parse(tickerEl.dataset.ticker);

			sliderEl?.removeAttribute('data-slider');
			$(tickerEl).easyTicker({
				direction: 'up',
				easing: 'swing',
				speed: 'slow',
				interval: 2000,
				height: 'auto',
				visible: 3,
				gap: rowGap,
				mousePause: true
			});
		}

		// Remove data ticker attributes
		tickerEl?.removeAttribute('data-ticker');
	});
});