import { createRoot } from 'react-dom/client';

import './column/script';
import './style.scss';
import Style from './Style';

// Row
document.addEventListener('DOMContentLoaded', () => {
	const allRows = document.querySelectorAll('.wp-block-b-blocks-row');
	allRows.forEach(row => {
		const attributes = JSON.parse(row.dataset.attributes);

		const bBlocksRowStyle = document.querySelector(`#${row.id} .bBlocksRowStyle`);

		createRoot(bBlocksRowStyle).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
		</>);

		row?.removeAttribute('data-attributes');
	});
});