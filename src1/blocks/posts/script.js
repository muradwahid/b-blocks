import { render } from 'react-dom';
const $ = jQuery;

import './style.scss';
import Style from './Style';
import { setSliderHeight, sliderConfig, tickerConfig } from './utils/configs';

// Advanced Posts
document.addEventListener('DOMContentLoaded', () => {
	const allBBlocksPosts = document.querySelectorAll('.wp-block-b-blocks-posts');
	allBBlocksPosts.forEach(posts => {
		const attributes = JSON.parse(posts.dataset.attributes);
		const { layout } = attributes;


		// Style
		const styleEl = document.querySelector(`#${posts.id} .bBlocksPostsStyle`);
		render(<Style attributes={attributes} clientId={attributes.cId} />, styleEl);


		// Slider
		if ('slider' === layout) {
			const sliderEl = document.querySelector(`#${posts.id} .bBlocksSliderPosts`);

			if (sliderEl) {
				new Swiper(sliderEl, sliderConfig(attributes));

				// Slider Height
				setSliderHeight(posts.id);
			}
		}


		// Ticker
		if ('ticker' === layout) {
			const tickerEl = document.querySelector(`#${posts.id} .bBlocksTickerPosts`);

			tickerEl && $(tickerEl).easyTicker(tickerConfig(attributes));
		}


		// Remove attributes data
		posts?.removeAttribute('data-attributes');
	});
});