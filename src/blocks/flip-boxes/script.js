import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';
import FlipBoxes from './FlipBoxes';

document.addEventListener('DOMContentLoaded', () => {
	const allFlipBoxes = document.querySelectorAll('.wp-block-b-blocks-flip-boxes');
	allFlipBoxes.forEach(flipBoxes => {
		const attributes = JSON.parse(flipBoxes.dataset.attributes);

		createRoot(flipBoxes).render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
			<FlipBoxes attributes={attributes} />
		</>);

		flipBoxes?.removeAttribute('data-attributes');
	});
});