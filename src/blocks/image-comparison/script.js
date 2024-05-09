import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import ImageCompare from './Components/Common/ImageCompare';

document.addEventListener('DOMContentLoaded', () => {
	const imageCompareEls = document.querySelectorAll('.wp-block-b-blocks-image-comparison');
	imageCompareEls.forEach(imageCompareEl => {
		const attributes = JSON.parse(imageCompareEl.dataset.attributes);
		const { cId, isLabel, beforeLabel, afterLabel, isCap, cap } = attributes;

		const beforeLabelEl = isLabel && beforeLabel && <div className='overlay beforeLabel' dangerouslySetInnerHTML={{ __html: beforeLabel }} />
		const afterLabelEl = isLabel && afterLabel && <div className='overlay afterLabel' dangerouslySetInnerHTML={{ __html: afterLabel }} />
		const captionEl = isCap && cap && <div className='caption' dangerouslySetInnerHTML={{ __html: cap }} />

		createRoot(imageCompareEl).render(<>
			<Style attributes={attributes} clientId={cId} />

			<ImageCompare attributes={attributes} beforeLabelEl={beforeLabelEl} afterLabelEl={afterLabelEl} captionEl={captionEl} />
		</>);

		imageCompareEl?.removeAttribute('data-attributes');
	});
});