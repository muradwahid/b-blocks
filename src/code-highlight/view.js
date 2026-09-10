import { createRoot } from 'react-dom/client';

import './style.scss';
import CodeHighlight from './Components/Common/CodeHighlight';
import Style from './Components/Common/Style';

document.addEventListener('DOMContentLoaded', () => {
	const codeEls = document.querySelectorAll('.wp-block-b-blocks-code-highlight');

	codeEls.forEach((codeEl) => {
		let attributes;

		// One block saved with malformed JSON must not stop every later block on
		// the page from mounting.
		try {
			attributes = JSON.parse(codeEl.dataset.attributes || '');
		} catch (error) {
			return;
		}

		createRoot(codeEl).render(<>
			<Style attributes={attributes} id={codeEl.id} />

			<CodeHighlight attributes={attributes} />
		</>);

		codeEl.removeAttribute('data-attributes');
	});
});
