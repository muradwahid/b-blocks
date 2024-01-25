import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';
import Rating from './Rating';

document.addEventListener('DOMContentLoaded', () => {
	const ratingEls = document.querySelectorAll('.wp-block-b-blocks-star-rating');
	ratingEls.forEach((ratingEl) => {
		const attributes = JSON.parse(ratingEl.dataset.attributes);
		const { cId } = attributes;

		createRoot(ratingEl).render(<>
			<Style attributes={attributes} clientId={cId} />

			<Rating attributes={attributes} />
		</>);

		ratingEl?.removeAttribute('data-attributes');
	});
});