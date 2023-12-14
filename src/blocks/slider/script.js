import { renderToString } from '@wordpress/element';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Slider from './Slider';
import Style from './Style';
import sliderOptions from './utils/sliderOptions';

// Content Slider
document.addEventListener('DOMContentLoaded', () => {
	const allSlider = document.querySelectorAll('.wp-block-b-blocks-slider');
	allSlider.forEach(slider => {
		const attributes = JSON.parse(slider.dataset.attributes);

		// Slider in wrapper
		const bBlocksSliderWrapper = document.querySelector(`#${slider.id} .bBlocksSliderWrapper`);
		bBlocksSliderWrapper.innerHTML = renderToString(<Slider attributes={attributes} />);

		// Render Style
		createRoot(document.querySelector(`#${slider.id} .bBlocksSliderStyle`)).render(<Style attributes={attributes} clientId={attributes.cId} />);

		// Initialize Slider
		new Swiper(`#${slider.id} .bBlocksSlider`, sliderOptions(attributes, 0));

		slider?.removeAttribute('data-attributes');
	});
});