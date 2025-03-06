import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import ImageCompareTwo from './Components/Common/ImageCompareTwo';

document.addEventListener('DOMContentLoaded', () => {
	const imageCompareEls = document.querySelectorAll('.wp-block-b-blocks-image-comparison');
	imageCompareEls.forEach(imageCompareEl => {
		const attributes = JSON.parse(imageCompareEl.dataset.attributes);
		const { isLabel, label, beforeLabel, afterLabel, isCap, cap, orientation } = attributes;
		const { hAlign, vAlign } = label;

		const beforeLabelEl = isLabel && beforeLabel && <div className={`bBlocks-label bBlocks-before-label bBlocks-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: beforeLabel }} />

		const afterLabelEl = isLabel && afterLabel && <div className={`bBlocks-label bBlocks-after-label bBlocks-${orientation} ${orientation === "horizontal" ? hAlign : vAlign}`} dangerouslySetInnerHTML={{ __html: afterLabel }} />

		const captionEl = isCap && cap && <div className='bBlocks-caption' dangerouslySetInnerHTML={{ __html: cap }} />

		createRoot(imageCompareEl).render(<>
			<Style attributes={attributes} id={imageCompareEl.id} />

			<ImageCompareTwo {...{ afterLabelEl, beforeLabelEl, captionEl }} attributes={attributes} />
		</>);

		imageCompareEl?.removeAttribute('data-attributes');
	});
});