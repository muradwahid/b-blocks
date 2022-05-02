import { render } from '@wordpress/element';

import './style.scss';
import Style from './Style';
import Countdown from './Countdown';

// Countdown Time
document.addEventListener('DOMContentLoaded', () => {
	const allCountdown = document.querySelectorAll('.wp-block-b-blocks-countdown');
	allCountdown.forEach(countdown => {
		const attributes = JSON.parse(countdown.dataset.attributes);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />

			<Countdown attributes={attributes} />
		</>, countdown);

		countdown?.removeAttribute('data-attributes');
	});
});