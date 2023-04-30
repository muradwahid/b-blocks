import { render } from 'react-dom';

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

			<Countdown attributes={attributes} Box={Box} />
		</>, countdown);

		countdown?.removeAttribute('data-attributes');
	});
});

const Box = (props) => {
	const { is, boxClass, digit, isLabels, label } = props;

	return is && <div className={`countdownItem ${boxClass}`}>
		<span className='digit'>{digit}</span>
		{(isLabels && label) && <label className='label' dangerouslySetInnerHTML={{ __html: label }} />}
	</div>;
}