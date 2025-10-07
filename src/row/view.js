import './style.scss';
import  { style } from './Components/Common/Style';

document.addEventListener('DOMContentLoaded', () => {
	const rowEls = document.querySelectorAll('.wp-block-b-blocks-row');
	rowEls.forEach(rowEl => {
		const attributes = JSON.parse(rowEl.dataset.attributes);

		const styleEl = document.createElement('style');
		styleEl.innerHTML = style(attributes, rowEl.id);
		rowEl.prepend(styleEl);
		rowEl?.removeAttribute('data-attributes');
	});
});