import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import OffCanvas from './Components/Frontend/OffCanvas';

document.addEventListener('DOMContentLoaded', () => {
	const blocks = document.querySelectorAll('.wp-block-b-blocks-off-canvas[data-attributes]');

	blocks.forEach((wrapper) => {
		let attributes = {};
		try {
			const raw = wrapper.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			attributes = {};
		}

		const templateContent = wrapper.querySelector('.b-blocks-off-canvas-innerBlocks-contents');
		if (!templateContent) return;

		createRoot(wrapper).render(<>
			<Style attributes={attributes} id={wrapper.id} />
			<OffCanvas attributes={attributes} templateContent={templateContent} />
		</>);

		wrapper.removeAttribute('data-attributes');
	});
});