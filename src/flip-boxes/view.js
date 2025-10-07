import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import FlipBoxes from './Components/Common/FlipBoxes';

document.addEventListener('DOMContentLoaded', () => {
	const flipBoxesEls = document.querySelectorAll('.wp-block-b-blocks-flip-boxes');
	flipBoxesEls.forEach(flipBoxesEl => {
		const attributes = JSON.parse(flipBoxesEl.dataset.attributes);

		createRoot(flipBoxesEl).render(<>
			<Style attributes={attributes} id={flipBoxesEl.id} />

			<FlipBoxes attributes={attributes} />
		</>);

		flipBoxesEl?.removeAttribute('data-attributes');
	});
});