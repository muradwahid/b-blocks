import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import StackedCards from './Components/Frontend/StackedCards';

document.addEventListener('DOMContentLoaded', () => {
	const stackedCardEls = document.querySelectorAll('.wp-block-b-blocks-stacked-cards');
	stackedCardEls.forEach(stackedCardEl => {
		let attributes = {};
		try {
			const raw = stackedCardEl.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn('Carousel: Invalid attributes JSON', e);
		}
		const slidesHost = stackedCardEl.querySelector('.b-blocks-stacked-cards-innerBlocks');

		if (!slidesHost) return;

		createRoot(stackedCardEl).render(<>
			<Style attributes={attributes} id={stackedCardEl.id} />

			<StackedCards attributes={attributes} slidesHost={slidesHost} />
		</>);

		stackedCardEl?.removeAttribute('data-attributes');
	});
});