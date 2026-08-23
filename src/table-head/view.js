// import { createRoot } from 'react-dom/client';

// import './style.scss';
// import Style from './Components/Common/Style';
// import TableCellFront from './Components/Frontend/TableCellFront';

// document.addEventListener('DOMContentLoaded', () => {
// 	const tableCells = document.querySelectorAll('.wp-block-b-blocks-table-cell');
// 	tableCells.forEach(tableCell => {
// 		const attributes = JSON.parse(tableCell.dataset.attributes);

// 		createRoot(tableCell).render(<>
// 			<Style attributes={attributes} id={tableCell.id} />

// 			<TableCellFront attributes={attributes} />
// 		</>);

// 		tableCell?.removeAttribute('data-attributes');
// 	});
// });