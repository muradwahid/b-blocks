import { createRoot } from 'react-dom/client';

import './child/script';
import './style.scss';
import Style from './Style';

document.addEventListener('DOMContentLoaded', () => {
	const allServices = document.querySelectorAll('.wp-block-b-blocks-services');
	allServices.forEach(services => {
		const attributes = JSON.parse(services.dataset.attributes);

		const bBlocksServicesStyle = document.querySelector(`#${services.id} .bBlocksServicesStyle`);

		createRoot(bBlocksServicesStyle).render(<Style attributes={attributes} clientId={attributes.cId} />);

		services?.removeAttribute('data-attributes');
	});
});