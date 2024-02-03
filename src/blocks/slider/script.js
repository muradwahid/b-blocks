import { createRoot } from 'react-dom/client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style.scss';
import Slider from './Components/Common/Slider';
import Style from './Components/Common/Style';

document.addEventListener('DOMContentLoaded', () => {
	const sliderEls = document.querySelectorAll('.wp-block-b-blocks-slider');
	sliderEls.forEach(sliderEl => {
		const attributes = JSON.parse(sliderEl.dataset.attributes);
		const { cId } = attributes;

		createRoot(sliderEl).render(<>
			<Style attributes={attributes} clientId={cId} />
			<Slider attributes={attributes} />
		</>);

		sliderEl?.removeAttribute('data-attributes');
	});
});