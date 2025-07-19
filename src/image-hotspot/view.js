import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Hotspot from './Components/Frontend/Hotspot';

document.addEventListener('DOMContentLoaded', () => {
	const hotspotEls = document.querySelectorAll('.wp-block-b-blocks-image-hotspot');

	hotspotEls.forEach(hotspotEl => {
		const attributes = JSON.parse(hotspotEl.dataset.attributes);

		createRoot(hotspotEl).render(<>
			<Style attributes={attributes} id={hotspotEl.id} />

			<Hotspot attributes={attributes} />
		</>);

		hotspotEl?.removeAttribute('data-attributes');
	});
});