import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { rowPrefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const rowEls = document.querySelectorAll('.wp-block-b-blocks-row');
	rowEls.forEach(rowEl => {
		const attributes = JSON.parse(rowEl.dataset.attributes);

		const styleEl = document.querySelector(`#${rowEl.id} .${rowPrefix}Style`);

		createRoot(styleEl).render(<>
			<Style attributes={attributes} id={rowEl.id} />
		</>);

		rowEl?.removeAttribute('data-attributes');
	});
});