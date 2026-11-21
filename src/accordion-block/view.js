import { createRoot } from 'react-dom/client';
import FrontEnd from './FrontEnd';
import './style.scss';
document.addEventListener('DOMContentLoaded', function () {
	const accordions = document.querySelectorAll('.wp-block-b-blocks-accordion-block');

	accordions.forEach(accordion => {
		let attributes = {};
		try {
			const raw = accordion.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			attributes = {};
		}

		createRoot(accordion).render(<>
			<FrontEnd attributes={attributes} />
		</>);

		accordion?.removeAttribute('data-attributes');
	});
});