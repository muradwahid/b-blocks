import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import TextPath from './Components/Common/TextPath';

document.addEventListener('DOMContentLoaded', () => {
	const textPathEls = document.querySelectorAll('.wp-block-b-blocks-text-path');
	textPathEls.forEach(textPathEl => {
		const attributes = JSON.parse(textPathEl.dataset.attributes);

		createRoot(textPathEl).render(<>
			<Style attributes={attributes} id={textPathEl.id} />

			<TextPath attributes={attributes} />
		</>);

		textPathEl?.removeAttribute('data-attributes');
	});
});