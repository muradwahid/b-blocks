import { createRoot } from 'react-dom/client';

import ImageScroller from './Components/Common/ImageScroller';
import Style from './Components/Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const imageScrollerEls = document.querySelectorAll('.wp-block-b-blocks-image-scroller');
	imageScrollerEls.forEach((imageScrollerEl) => {
		const attributes = JSON.parse(imageScrollerEl.dataset.attributes);

		createRoot(imageScrollerEl).render(<>
			<Style attributes={attributes} id={imageScrollerEl.id} />
			<div>
				<ImageScroller attributes={attributes} />
			</div>
		</>);
		imageScrollerEl?.removeAttribute('data-attributes');
	});
});
