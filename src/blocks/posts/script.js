import { createRoot } from 'react-dom/client';
import 'swiper/css/bundle';
// const $ = jQuery;

import './style.scss';
// import Style from './Style';
import Posts from './Components/Frontend/Posts';
// import { setSliderHeight, sliderConfig, tickerConfig } from './utils/configs';

document.addEventListener('DOMContentLoaded', () => {
	const postsEls = document.querySelectorAll('.wp-block-b-blocks-posts');
	postsEls.forEach(postsEl => {
		const nonce = JSON.parse(postsEl.dataset.nonce);
		const attributes = JSON.parse(postsEl.dataset.attributes);
		const { totalPosts } = JSON.parse(postsEl.dataset.extra);

		createRoot(postsEl).render(<Posts nonce={nonce} totalPosts={totalPosts} attributes={attributes} />);

		postsEl?.removeAttribute('data-posts');
		postsEl?.removeAttribute('data-attributes');
		postsEl?.removeAttribute('data-extra');


		// const { layout } = attributes;

		// // Style
		// const styleEl = document.querySelector(`#${postsEl.id} .bBlocksPostsStyle`);
		// createRoot(styleEl).render(<Style attributes={attributes} clientId={attributes.cId} />);


		// // Slider
		// if ('slider' === layout) {
		// 	const sliderEl = document.querySelector(`#${postsEl.id} .bBlocksSliderPosts`);

		// 	if (sliderEl) {
		// 		new Swiper(sliderEl, sliderConfig(attributes));

		// 		// Slider Height
		// 		setSliderHeight(postsEl.id);
		// 	}
		// }


		// // Ticker
		// if ('ticker' === layout) {
		// 	const tickerEl = document.querySelector(`#${postsEl.id} .bBlocksTickerPosts`);

		// 	tickerEl && $(tickerEl).easyTicker(tickerConfig(attributes));
		// }

		// postsEl?.removeAttribute('data-attributes');
	});
});