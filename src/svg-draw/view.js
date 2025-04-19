import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import SVGDraw from './Components/Frontend/SVGDraw';

document.addEventListener('DOMContentLoaded', () => {
	const svgDrawEls = document.querySelectorAll('.wp-block-b-blocks-svg-draw');
	svgDrawEls.forEach(svgDrawEl => {
		const attributes = JSON.parse(svgDrawEl.dataset.attributes);

		createRoot(svgDrawEl).render(
      <>
        <Style attributes={attributes} id={svgDrawEl.id} />
        <SVGDraw attributes={attributes} />
      </>
    );

		svgDrawEl?.removeAttribute('data-attributes');
	});
});