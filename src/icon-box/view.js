import { createRoot } from 'react-dom/client';

import Style from './Components/Common/Style';
import IconBox from './Components/Common/IconBox';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const els = document.querySelectorAll('.wp-block-b-blocks-icon-box');
	els.forEach(el => {
		const attributes = JSON.parse(el.dataset.attributes);

		createRoot(el).render(<>
			<Style attributes={attributes} id={el.id} />

			<IconBox attributes={attributes} />
		</>);

		el?.removeAttribute('data-attributes');
	});
});