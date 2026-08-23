import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import GoogleMap from './Components/Frontend/GoogleMap';

document.addEventListener('DOMContentLoaded', () => {
	const maps = document.querySelectorAll('.wp-block-b-blocks-google-map[data-attributes]');

	maps.forEach((el) => {
		let attributes = {};
		try {
			const raw = el.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			attributes = {};
		}

		// render.php injects the key so it never ends up in saved post content.
		const apiKey = el.dataset.mapkey || '';

		createRoot(el).render(<>
			<Style attributes={attributes} id={el.id} />

			<GoogleMap attributes={attributes} apiKey={apiKey} />
		</>);

		el.removeAttribute('data-attributes');
		el.removeAttribute('data-mapkey');
	});
});
