import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const servicesEls = document.querySelectorAll('.wp-block-b-blocks-services');
	servicesEls.forEach(servicesEl => {
		const attributes = JSON.parse(servicesEl.dataset.attributes);

		const styleSl = document.querySelector(`#${servicesEl.id} .${prefix}Style`);

		createRoot(styleSl).render(<Style attributes={attributes} id={servicesEl.id} />);

		servicesEl?.removeAttribute('data-attributes');
	});
});