import { createRoot } from 'react-dom/client';

import './style.scss';
import Instagram from './Components/Common/Instagram';
import Style from './Components/Common/Style';

document.addEventListener('DOMContentLoaded', () => {
	const feedEls = document.querySelectorAll('.wp-block-b-blocks-instagram');

	feedEls.forEach((feedEl) => {
		let attributes;

		// One block saved with malformed JSON must not stop every later block on
		// the page from mounting.
		try {
			attributes = JSON.parse(feedEl.dataset.attributes || '');
		} catch (error) {
			return;
		}

		createRoot(feedEl).render(<>
			<Style attributes={attributes} id={feedEl.id} />

			<Instagram attributes={attributes} id={feedEl.id} />
		</>);

		feedEl.removeAttribute('data-attributes');
	});
});
