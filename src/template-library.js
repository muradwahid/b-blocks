import { subscribe } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';

import TemplateLibrary from './TemplateLibrary/TemplateLibrary';

const mountTemplateLibrary = () => {
	// Render our button.
	const templateLibraryWrap = document.createElement('div');
	templateLibraryWrap.classList.add('bBlocksTemplateLibraryWrap');
	createRoot(templateLibraryWrap).render(<TemplateLibrary />);

	// Just keep on checking because there are times when the toolbar gets
	// unmounted.
	subscribe(() => {
		setTimeout(() => {
			const toolbar = document.querySelector('.edit-post-header-toolbar');
			if (toolbar) {
				if (!toolbar.querySelector('.bBlocksTemplateLibraryWrap')) {
					toolbar.appendChild(templateLibraryWrap);
				}
			}
		}, 1);
	});
};
domReady(mountTemplateLibrary);