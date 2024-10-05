import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import Rating from './Components/Common/Rating';

document.addEventListener('DOMContentLoaded', () => {
	const ratingEls = document.querySelectorAll('.wp-block-b-blocks-star-rating');
	ratingEls.forEach((ratingEl) => {
		const attributes = JSON.parse(ratingEl.dataset.attributes);

		createRoot(ratingEl).render(<>
			<Style attributes={attributes} id={ratingEl.id} />

			<Rating attributes={attributes} />
		</>);

		ratingEl?.removeAttribute('data-attributes');
	});
});