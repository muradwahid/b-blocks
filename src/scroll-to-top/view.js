import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import ScrollToTop from './Components/Common/ScrollToTop';

document.addEventListener('DOMContentLoaded', () => {
	const scrollToTops = document.querySelectorAll('.wp-block-b-blocks-scroll-to-top');
	scrollToTops.forEach(scrollToTop => {
		const attributes = JSON.parse(scrollToTop.dataset.attributes);

		createRoot(scrollToTop).render(<>
			<Style attributes={attributes} id={scrollToTop.id} />

			<ScrollToTop attributes={attributes} />
		</>);

		scrollToTop?.removeAttribute('data-attributes');
	});
});