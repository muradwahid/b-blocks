import { render } from '@wordpress/element';

const $ = jQuery;

import './style.scss';
import { GeneralStyle } from './Style';

// Advanced Posts
document.addEventListener('DOMContentLoaded', () => {
	const allBBlocksPosts = document.querySelectorAll('.wp-block-b-blocks-posts');
	allBBlocksPosts.forEach(posts => {
		const attributes = JSON.parse(posts.dataset.attributes);
		const { layout, columns, columnGap, rowGap, sliderIsLoop, sliderIsTouchMove, sliderIsAutoplay, sliderSpeed, sliderEffect, sliderIsPageClickable, sliderIsPageDynamic } = attributes;


		// Style
		const styleEl = document.querySelector(`#${posts.id} .bBlocksPostsStyle`);

		render(<GeneralStyle attributes={attributes} clientId={attributes.cId} />, styleEl);


		// Slider
		const sliderEl = document.querySelector(`#${posts.id} .bBlocksSliderPosts`);
		if (sliderEl) {
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
		const swiperSlide = document.querySelectorAll(`#${posts.id} .bBlocksSliderPosts .swiper-slide`);
		const swiperSlideText = document.querySelectorAll(`#${posts.id} .bBlocksSliderPosts .swiper-slide .bBlocksPostText`);
		swiperSlideText?.length && swiperSlideText.forEach(slideText => {
			slideHeightArray.push(slideText?.clientHeight);
		});
		swiperSlide?.length && swiperSlide.forEach(slide => {
			slide.style.height = `${Math.max(...slideHeightArray)}px`;
		});


		// Ticker
		const tickerEl = document.querySelector(`#${posts.id} .bBlocksTickerPosts`);
		if (tickerEl) {
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


		// Remove attributes data
		posts?.removeAttribute('data-attributes');
	});
});