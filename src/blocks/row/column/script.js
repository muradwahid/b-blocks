import { render } from '@wordpress/element';

import './style.scss';
import Style from './Style';

// Column
document.addEventListener('DOMContentLoaded', () => {
	const allColumns = document.querySelectorAll('.wp-block-b-blocks-column');
	allColumns.forEach(column => {
		const attributes = JSON.parse(column.dataset.attributes);

		const bBlocksColumnStyle = document.querySelector(`#${column.id} .bBlocksColumnStyle`);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
		</>, bBlocksColumnStyle);

		column?.removeAttribute('data-attributes');
	});
});