import { render } from 'react-dom';

import './child/script';
import './style.scss';
import Style from './Style';
// import Service from './Service';

// // Services
document.addEventListener('DOMContentLoaded', () => {
	const allServices = document.querySelectorAll('.wp-block-b-blocks-services');
	allServices.forEach(services => {
		const attributes = JSON.parse(services.dataset.attributes);

		const bBlocksServicesStyle = document.querySelector(`#${services.id} .bBlocksServicesStyle`);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
		</>, bBlocksServicesStyle);

		services?.removeAttribute('data-attributes');
	});
});