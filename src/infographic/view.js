import { createRoot } from 'react-dom/client';

import './style.scss';
import Infographic from './Components/Common/Infographic';
import Style from './Components/Common/Style';

document.addEventListener('DOMContentLoaded', () => {
	const infographicEls = document.querySelectorAll('.wp-block-b-blocks-infographic');

	infographicEls.forEach((infographicEl) => {

		let attributes;

		try {
			attributes = JSON.parse(infographicEl.dataset.attributes || '');
		} catch (error) {
			return;
		}

		createRoot(infographicEl).render(<>
			<Style attributes={attributes} id={infographicEl.id} />

			<Infographic attributes={attributes} />
		</>);

		infographicEl.removeAttribute('data-attributes');
	});
});
