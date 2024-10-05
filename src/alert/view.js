import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import AlertBox from './Components/Common/AlertBox';

document.addEventListener('DOMContentLoaded', () => {
	const alertEls = document.querySelectorAll('.wp-block-b-blocks-alert');
	alertEls.forEach(alertEl => {
		const attributes = JSON.parse(alertEl.dataset.attributes);

		createRoot(alertEl).render(<>
			<Style attributes={attributes} id={alertEl.id} />

			<AlertBox attributes={attributes} alertEl={alertEl} />
		</>);

		alertEl?.removeAttribute('data-attributes');
	});
});