
import { style } from './Components/Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const columnEls = document.querySelectorAll('.wp-block-b-blocks-column');
	columnEls.forEach(columnEl => {
		const attributes = JSON.parse(columnEl.dataset.attributes);
		const columns = columnEl.dataset.columns;
		const columnGap = columnEl.dataset.columnGap;
		const styleEl = document.createElement('style');
		styleEl.innerHTML = style(attributes, columnEl.id, columns, columnGap);
		columnEl.prepend(styleEl);
		
		columnEl?.removeAttribute('data-attributes');
	});
});