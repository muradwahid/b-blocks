import { createRoot } from 'react-dom/client';

import ContentTicker from './Components/Common/ContentTicker';
import Style from './Components/Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const contentTickers = document.querySelectorAll('.wp-block-b-blocks-content-ticker');
	contentTickers.forEach((contentTicker) => {
		const attributes = JSON.parse(contentTicker.dataset.attributes);
		createRoot(contentTicker).render(
			<>
				<Style attributes={attributes} id={contentTicker.id} />
				<ContentTicker attributes={attributes} />
			</>
		);

		contentTicker?.removeAttribute('data-attributes');
	});
});
