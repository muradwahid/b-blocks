import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Frontend from './Components/Frontend/Frontend';
document.addEventListener('DOMContentLoaded', () => {
	const listsEls = document.querySelectorAll('.wp-block-b-blocks-list');
	listsEls.forEach(listEl => {
		const attributes = JSON.parse(listEl.dataset.attributes);

		createRoot(listEl).render(<>
			<Style attributes={attributes} id={listEl.id} />

			<Frontend attributes={attributes} />
		</>);

		listEl?.removeAttribute('data-attributes');
	});
});