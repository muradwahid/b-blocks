import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import EventCard from './Components/Frontend/EventCard';
import EventSchema from './Components/Frontend/EventSchema';

const init = () => {
	const eventCardEls = document.querySelectorAll('.wp-block-b-blocks-event-card');

	eventCardEls.forEach(eventCardEl => {
		if (!eventCardEl.dataset.attributes) {
			return;
		}
		try {
			const attributes = JSON.parse(eventCardEl.dataset.attributes);

			createRoot(eventCardEl).render(<>
				<Style attributes={attributes} id={eventCardEl.id} />

				<EventCard attributes={attributes} />

				<EventSchema attributes={attributes} />
			</>);

			eventCardEl.removeAttribute('data-attributes');
		} catch (e) {
			// Ignore json parse errors
		}
	});
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
