import { render } from 'react-dom';

import './style.scss';
import Style from './Style';
import AlertBox from './AlertBox';

// Alert Box
document.addEventListener('DOMContentLoaded', () => {
	const allAlert = document.querySelectorAll('.wp-block-b-blocks-alert');
	allAlert.forEach(alert => {
		const attributes = JSON.parse(alert.dataset.attributes);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<AlertBox attributes={attributes} />
		</>, alert);

		// Alert Close Script
		const alertCloseEl = document.querySelector(`#${alert.id} .bBlocksAlert .alert .alertClose`);
		alertCloseEl && alertCloseEl.addEventListener('click', () => {
			alert.classList.add('transformHidden');

			setTimeout(() => {
				alert.style.display = 'none';
			}, 400);
		});

		alert?.removeAttribute('data-attributes');
	});
});