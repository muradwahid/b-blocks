import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';

document.addEventListener('DOMContentLoaded', () => {
	const allColumns = document.querySelectorAll('.wp-block-b-blocks-column');
	allColumns.forEach(column => {
		const attributes = JSON.parse(column.dataset.attributes);

		const bBlocksColumnStyle = document.querySelector(`#${column.id} .bBlocksColumnStyle`);

		createRoot(bBlocksColumnStyle).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
		</>);

		column?.removeAttribute('data-attributes');
	});
});