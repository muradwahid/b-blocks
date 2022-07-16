import { render } from '@wordpress/element';

import './style.scss';
import Style from './Style';
import FlipBoxes from './FlipBoxes';

// Flip Boxes
document.addEventListener('DOMContentLoaded', () => {
	const allFlipBoxes = document.querySelectorAll('.wp-block-b-blocks-flip-boxes');
	allFlipBoxes.forEach(flipBoxes => {
		const attributes = JSON.parse(flipBoxes.dataset.attributes);

		render(<>
			<Style attributes={attributes} clientId={attributes.cId} />
			<FlipBoxes attributes={attributes} />
		</>, flipBoxes);

		flipBoxes?.removeAttribute('data-attributes');
	});
});