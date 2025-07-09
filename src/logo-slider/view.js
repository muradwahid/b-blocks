import { createRoot } from 'react-dom/client';

import SliderFront from './Components/Frontend/SliderFront';
import './style.scss';
import Style from './Components/Common/Style';

document.addEventListener('DOMContentLoaded', () => {
	const logoSliders = document.querySelectorAll('.wp-block-b-blocks-logo-slider');
	logoSliders.forEach(logoSlider => {
		const attributes = JSON.parse(logoSlider.dataset.attributes);
		createRoot(logoSlider).render(
			<>
				<Style attributes={attributes} id={logoSlider.id} />
				<SliderFront attributes={attributes} />
			</>
		);
		logoSlider?.removeAttribute('data-attributes');
	});
});