import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { colPrefix } from '../row/utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const columnEls = document.querySelectorAll('.wp-block-b-blocks-column');
	columnEls.forEach(columnEl => {
		const attributes = JSON.parse(columnEl.dataset.attributes);
		const columns = columnEl.dataset.columns;
		const columnGap = columnEl.dataset.columnGap;

		const styleEl = document.querySelector(`#${columnEl.id} .${colPrefix}Style`);

		createRoot(styleEl).render(<>
			<Style {...{ attributes, id: columnEl.id, columns, columnGap }} />
		</>);

		columnEl?.removeAttribute('data-attributes');
	});
});