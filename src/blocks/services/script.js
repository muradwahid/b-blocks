import { createRoot } from 'react-dom/client';

import './child/script';
import './style.scss';
import Style from './Components/Common/Style';

document.addEventListener('DOMContentLoaded', () => {
	const servicesEls = document.querySelectorAll('.wp-block-b-blocks-services');
	servicesEls.forEach(servicesEl => {
		const attributes = JSON.parse(servicesEl.dataset.attributes);

		const bBlocksServicesStyle = document.querySelector(`#${servicesEl.id} .bBlocksServicesStyle`);

		createRoot(bBlocksServicesStyle).render(<Style attributes={attributes} clientId={attributes.cId} />);

		servicesEl?.removeAttribute('data-attributes');
	});
});