import { render } from '@wordpress/element';

import Style from './Style';
import Service from './Service';

// Service
document.addEventListener('DOMContentLoaded', () => {
	const allService = document.querySelectorAll('.wp-block-b-blocks-service');
	allService.forEach(service => {
		const attributes = JSON.parse(service.dataset.attributes);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<Service attributes={attributes} />
		</>, service);

		service?.removeAttribute('data-attributes');
	});
});