import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import ComparisonTable from './Components/Frontend/ComparisonTable';
import { wrapperClasses } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const tables = document.querySelectorAll('.wp-block-b-blocks-comparison-table[data-attributes]');

	tables.forEach((el) => {
		let attributes = {};
		try {
			const raw = el.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			attributes = {};
		}

		// Theme / alignment / sticky modifiers are class-driven, and render.php
		// no longer knows the attributes, so they are applied on hydrate.
		el.className = `${el.className} ${wrapperClasses(attributes)}`.trim();

		createRoot(el).render(<>
			<Style attributes={attributes} id={el.id} />

			<ComparisonTable attributes={attributes} />
		</>);

		el.removeAttribute('data-attributes');
	});
});
