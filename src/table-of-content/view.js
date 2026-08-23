import { createRoot } from 'react-dom/client';

import generateCSS from '../../../bpl-tools/Advanced/generateCSS';
import TableOfContent from './Components/Frontend/TableOfContent';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const tableOfContentEls = document.querySelectorAll('.wp-block-b-blocks-table-of-content');
	tableOfContentEls.forEach(tableOfContentEl => {
		const attributes = JSON.parse(tableOfContentEl.dataset.attributes);

		createRoot(tableOfContentEl).render(<>
			<style dangerouslySetInnerHTML={{ __html: `${generateCSS(tableOfContentEl.id, attributes.advanced, false)}` }}></style>
			<TableOfContent attributes={attributes} id={tableOfContentEl.id} />
		</>);

		tableOfContentEl?.removeAttribute('data-attributes');
	});
});