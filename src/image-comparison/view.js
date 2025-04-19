import { createRoot } from 'react-dom/client';

import { sanitizeHTML } from '../../../bpl-tools/utils/common';

import './style.scss';
import Style from './Components/Common/Style';
import ImageCompareTwo from './Components/Common/ImageCompareTwo';

document.addEventListener('DOMContentLoaded', () => {
	const imageCompareEls = document.querySelectorAll('.wp-block-b-blocks-image-comparison');
	imageCompareEls.forEach(imageCompareEl => {
		const attributes = JSON.parse(imageCompareEl.dataset.attributes);
		const { isLabel, label, beforeLabel, afterLabel, isCap, cap, orientation } = attributes;
		const { hAlign, vAlign } = label;

		const beforeLabelEl = isLabel && beforeLabel && <div className={`icb-label icb-before-label icb-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: sanitizeHTML(beforeLabel) }} />

		const afterLabelEl = isLabel && afterLabel && <div className={`icb-label icb-after-label icb-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: sanitizeHTML(afterLabel) }} />

		const captionEl = isCap && cap && <div className='icb-caption' dangerouslySetInnerHTML={{ __html: sanitizeHTML(cap) }} />

		createRoot(imageCompareEl).render(<>
			<Style attributes={attributes} id={imageCompareEl.id} />

			<ImageCompareTwo {...{ afterLabelEl, beforeLabelEl, captionEl }} attributes={attributes} />
		</>);
		imageCompareEl?.removeAttribute('data-attributes');
	});
});