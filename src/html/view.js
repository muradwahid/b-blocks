import { createRoot } from 'react-dom/client';

import Style from './Components/Common/Style';
import HTMLBlock from './Components/Frontend/HTMLBlock';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const htmlblockEls = document.querySelectorAll('.wp-block-b-blocks-html-block');
	htmlblockEls.forEach(htmlblockEl => {
		const attributes = JSON.parse(htmlblockEl.dataset.attributes);

		createRoot(htmlblockEl).render(
			<>
				<Style attributes={attributes} id={htmlblockEl.id} />
				<HTMLBlock attributes={attributes} />
			</>
		);

		htmlblockEl?.removeAttribute('data-attributes');
	});
});