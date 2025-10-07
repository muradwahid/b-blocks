import { createRoot } from 'react-dom/client';

import './style.scss';
import { ImageCompare } from './Components/Common/ImageCompare';
import Style from './Components/Common/Style';

document.addEventListener('DOMContentLoaded', () => {
	const imageCompareEls = document.querySelectorAll('.wp-block-b-blocks-image-comparison');
	imageCompareEls.forEach(imgCompareEl => {
		const attributes = JSON.parse(imgCompareEl.dataset.attributes);
		const { isLabel, label, beforeLabel, afterLabel, isCap, cap, orientation } = attributes;
		const { hAlign, vAlign } = label;

		const beforeLabelEl = isLabel && beforeLabel && <div className={`b-blocks-label b-blocks-before-label b-blocks-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: beforeLabel }} />

		const afterLabelEl = isLabel && afterLabel && <div className={`b-blocks-label b-blocks-after-label b-blocks-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: afterLabel }} />

		const captionEl = isCap && cap && <div className='b-blocks-caption' dangerouslySetInnerHTML={{ __html: cap }} />

		createRoot(imgCompareEl).render(<>
			<Style attributes={attributes} id={imgCompareEl.id} />

			<ImageCompare {...{ afterLabelEl, beforeLabelEl, captionEl }} attributes={attributes} />
		</>);

		imgCompareEl?.removeAttribute('data-attributes');
	});
});