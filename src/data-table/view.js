import { createRoot } from 'react-dom/client';

import Style from './Components/Common/Style';
import DataTable from './Components/Frontend/DataTable';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const dataTableEls = document.querySelectorAll('.wp-block-b-blocks-data-table');
	dataTableEls.forEach(dataTableEl => {
		const attributes = JSON.parse(dataTableEl.dataset.attributes);

		createRoot(dataTableEl).render(<>
			<Style attributes={attributes} id={dataTableEl.id} />

			<DataTable attributes={attributes} />
		</>);

		dataTableEl?.removeAttribute('data-attributes');
	});
});