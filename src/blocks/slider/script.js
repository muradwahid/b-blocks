// import 'swiper/css/bundle'; // Swiper CSS

// import './style.scss';

// // Slider
// document.addEventListener('DOMContentLoaded', () => {
// 	const allSlider = document.querySelectorAll('.wp-block-b-blocks-slider');
// 	Object.values(allSlider).map(slider => {
// 		const sliderEl = document.getElementById(slider.id);

// 		const { slides, columns, columnGap, isLoop, isTouchMove, isAutoplay, speed, effect, isPageClickable, isPageDynamic } = JSON.parse(sliderEl.dataset.slider);

// 		new Swiper(`#${slider.id} .bBlocksSlider`, {
// 			// Optional parameters
// 			direction: 'horizontal',
// 			slidesPerView: columns?.mobile,
// 			breakpoints: {
// 				// when window width is >= 576px
// 				576: { slidesPerView: columns?.tablet },
// 				// when window width is >= 768px
// 				768: { slidesPerView: columns?.desktop },
// 			},
// 			spaceBetween: columnGap,
// 			loop: isLoop,
// 			allowTouchMove: isTouchMove,
// 			grabCursor: isTouchMove,
// 			autoplay: isAutoplay ? { delay: speed * 1000 } : false,
// 			speed: speed * 1000,
// 			effect,
// 			fadeEffect: { crossFade: true },
// 			creativeEffect: {
// 				prev: {
// 					shadow: true,
// 					translate: ['-120%', 0, -500],
// 				},
// 				next: {
// 					shadow: true,
// 					translate: ['120%', 0, -500],
// 				}
// 			},
// 			allowSlideNext: true,
// 			allowSlidePrev: true,
// 			autoHeight: false,
// 			notificationClass: null,

// 			// Controllers
// 			pagination: {
// 				el: '.swiper-pagination',
// 				clickable: isPageClickable,
// 				dynamicBullets: isPageDynamic
// 			},
// 			navigation: {
// 				nextEl: '.swiper-button-next',
// 				prevEl: '.swiper-button-prev',
// 			}
// 		});

// 		const bBlocksSliderStyle = document.querySelector(`#${slider.id} .bBlocksSliderStyle`); // Style Tag
// 		let childElPositionCSS = ''; // Style holder
// 		slides.map((item, index) => {
// 			const { childPositions = [{ left: 5.8, top: 11 }, { left: 5.8, top: 22 }, { left: 5.8, top: 33 }] } = item;

// 			// Select Slider Content and Child
// 			const contentChild = document.querySelector(`#${slider.id} .bBlocksSlider .slide-${index}:not(.swiper-slide-duplicate) .sliderContent`)?.children || [];

// 			// For CSS styling
// 			for (let i = 0; i < contentChild.length; i++) {
// 				childPositions[i] = childPositions[i] || { left: 5.8, top: (i + 1) * 11 };

// 				childElPositionCSS += `#${slider.id} .bBlocksSlider .slide-${index} .sliderContent > *:nth-child(${i + 1}){ top: ${childPositions[i].top}%; left: ${childPositions[i].left}%; } `;
// 			}
// 			bBlocksSliderStyle.innerText = childElPositionCSS;
// 		});

// 		sliderEl?.removeAttribute('data-slider');
// 	});
// });


import { render, renderToString } from '@wordpress/element';

import './style.scss';
import Slider from './Slider';
import Style from './Style';
import sliderOptions from './sliderOptions';

// Content Slider
document.addEventListener('DOMContentLoaded', () => {
	const allSlider = document.querySelectorAll('.wp-block-b-blocks-slider');
	allSlider.forEach(slider => {
		const attributes = JSON.parse(slider.dataset.attributes);

		// Slider in wrapper
		const bBlocksSliderWrapper = document.querySelector(`#${slider.id} .bBlocksSliderWrapper`);
		bBlocksSliderWrapper.innerHTML = renderToString(<Slider attributes={attributes} />);

		// Render Style
		render(<Style attributes={attributes} clientId={attributes.cId} />, document.querySelector(`#${slider.id} .bBlocksSliderStyle`));

		// Initialize Slider
		new Swiper(`#${slider.id} .bBlocksSlider`, sliderOptions(attributes, 0));

		slider?.removeAttribute('data-attributes');
	});
});