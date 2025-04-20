import { createRoot } from 'react-dom/client';

import { ImageCompare } from './Common/ImageCompare';

import Style from './Common/Style';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	const imgCompareEls = document.querySelectorAll('.wp-block-icb-image-compare');
	imgCompareEls.forEach(imgCompareEl => {
		const attributes = JSON.parse(imgCompareEl.dataset.attributes);
		const { isLabel, label, beforeLabel, afterLabel, isCap, cap, orientation } = attributes;
		const { hAlign, vAlign } = label;

		const beforeLabelEl = isLabel && beforeLabel && <div className={`icb-label icb-before-label icb-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: beforeLabel }} />

		const afterLabelEl = isLabel && afterLabel && <div className={`icb-label icb-after-label icb-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: afterLabel }} />

		const captionEl = isCap && cap && <div className='icb-caption' dangerouslySetInnerHTML={{ __html: cap }} />

		createRoot(imgCompareEl).render(<>
			<Style attributes={attributes} id={imgCompareEl.id} />

			<ImageCompare {...{ afterLabelEl, beforeLabelEl, captionEl }} attributes={attributes} />
		</>);

		imgCompareEl?.removeAttribute('data-attributes');
	});
});