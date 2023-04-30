import { render } from 'react-dom';

import './column/script';
import './style.scss';
import Style from './Style';

// Row
document.addEventListener('DOMContentLoaded', () => {
	const allRows = document.querySelectorAll('.wp-block-b-blocks-row');
	allRows.forEach(row => {
		const attributes = JSON.parse(row.dataset.attributes);

		const bBlocksRowStyle = document.querySelector(`#${row.id} .bBlocksRowStyle`);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
		</>, bBlocksRowStyle);

		row?.removeAttribute('data-attributes');
	});
});