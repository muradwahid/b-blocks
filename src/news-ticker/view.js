
/**
 * Use this file for JavaScript code that you want to run in the front-end
 * on posts/pages that contain this block.
 */

import './style.scss';
document.addEventListener('DOMContentLoaded', function() {
	const tickers = document.querySelectorAll('.wp-block-b-blocks-news-ticker');
	
	tickers.forEach(function(ticker) {
		const speed = ticker.dataset.speed || 50;
		const items = ticker.querySelector('.news-ticker-items');
		
		if (items) {
			items.style.setProperty('--ticker-speed', speed + 's');
			
			const clone = items.cloneNode(true);
			items.parentNode.appendChild(clone);
		}
	});
});
