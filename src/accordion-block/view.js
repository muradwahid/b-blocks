import { createRoot } from 'react-dom/client';
import FrontEnd from './FrontEnd';
import './style.scss';
document.addEventListener('DOMContentLoaded', function () {
	const accordions = document.querySelectorAll('.wp-block-b-blocks-accordion-block');

	accordions.forEach(accordion => {
		const attributes = JSON.parse(accordion.dataset.attributes);

		createRoot(accordion).render(<>
			<FrontEnd attributes={attributes} />
		</>);

		accordion?.removeAttribute('data-attributes');
	});
});
