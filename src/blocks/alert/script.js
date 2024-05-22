import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import AlertBox from './Components/Common/AlertBox';

document.addEventListener('DOMContentLoaded', () => {
	const alertEls = document.querySelectorAll('.wp-block-b-blocks-alert');
	alertEls.forEach(alertEl => {
		const attributes = JSON.parse(alertEl.dataset.attributes);

		createRoot(alertEl).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<AlertBox attributes={attributes} />
		</>);

		// Alert Close Script
		const alertCloseEl = document.querySelector(`#${alertEl.id} .bBlocksAlert .alert .alertClose`);
		alertCloseEl && alertCloseEl.addEventListener('click', () => {
			alertEl.classList.add('transformHidden');

			setTimeout(() => {
				alertEl.style.display = 'none';
			}, 400);
		});

		alertEl?.removeAttribute('data-attributes');
	});
});