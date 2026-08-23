import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import ExpandContent from './Components/Frontend/ExpandContent';

document.addEventListener('DOMContentLoaded', () => {
	const expandContentEls = document.querySelectorAll('.wp-block-b-blocks-expand-content[data-attributes]');
	expandContentEls.forEach(expandContentEl => {
		let attributes = {};
		try {
			const raw = expandContentEl.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn('expand-content: Invalid attributes JSON', e);
		}
		const templateContent = expandContentEl.querySelector('.b-blocks-expand-content-innerBlocks-contents');
		if (!templateContent) return;

		createRoot(expandContentEl).render(<>
			<Style attributes={attributes} id={expandContentEl.id} />

			<ExpandContent attributes={attributes} templateContent={templateContent} />
		</>);

		expandContentEl?.removeAttribute('data-attributes');
	});
});
