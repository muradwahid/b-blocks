import { createRoot } from 'react-dom/client';
import './style.scss';
import Style from './Components/Common/Style';
import Frontend from './Components/Frontend/Frontend';

document.addEventListener('DOMContentLoaded', () => {
	const videoEls = document.querySelectorAll('.wp-block-b-blocks-whatsapp-chat');
	videoEls.forEach(videoEl => {
		const attributes = JSON.parse(videoEl.dataset.attributes);

		createRoot(videoEl).render(<>
			<Style attributes={attributes} id={videoEl.id} />

			<Frontend attributes={attributes} />
		</>);

		videoEl?.removeAttribute('data-attributes');
	});
});

// (function () {
// 	'use strict';

// 	document.addEventListener('DOMContentLoaded', function () {
// 		var blocks = document.querySelectorAll(
// 			'.wp-block-b-blocks-whatsapp-chat'
// 		);

// 		blocks.forEach(function (block) {
// 			var link = block.querySelector('.bBlocks-whatsapp-block-btn');
// 			if (!link) {
// 				return;
// 			}

// 			// Keyboard accessibility: ensure Enter and Space activate the link.
// 			link.addEventListener('keydown', function (e) {
// 				if (e.key === 'Enter' || e.key === ' ') {
// 					e.preventDefault();
// 					link.click();
// 				}
// 			});
// 		});
// 	});
// })();
