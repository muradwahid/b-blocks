import { createRoot } from 'react-dom/client';

import './style.scss';
import SVGShape from './Components/Common/SVGShape';
import { shapeCSS } from './utils/functions';

const containerEls = document.querySelectorAll('.wp-block-b-blocks-container');
containerEls?.forEach(containerEl => {
	const attributes = JSON.parse(containerEl.dataset.attributes);
	const { shape } = attributes;
	const { top, bottom } = shape;

	const styleEl = document.createElement('style');
	styleEl.innerHTML = shapeCSS(shape, containerEl.id);
	containerEl.prepend(styleEl);

	const topShapedEl = containerEl.querySelector('.topShaped');
	const bottomShapedEl = containerEl.querySelector('.bottomShaped');

	if (topShapedEl) {
		createRoot(topShapedEl).render(<SVGShape data={top} />);
	}

	if (bottomShapedEl) {
		createRoot(bottomShapedEl).render(<SVGShape data={bottom} />);
	}

	containerEl?.removeAttribute('data-attributes');
})