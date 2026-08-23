
// import './style.scss';

// const init = () => {
// 	const sections = document.querySelectorAll('.bb-mts[data-bb-mts-label]');

// 	sections.forEach((section) => {
// 		const explicit = (section.getAttribute('data-bb-mts-label') || '').trim();

// 		if (!explicit && !section.getAttribute('aria-label')) {
// 			const heading = section.querySelector(
// 				'.bb-mts-content h1, .bb-mts-content h2, .bb-mts-content h3, .bb-mts-content h4, .bb-mts-content h5, .bb-mts-content h6'
// 			);
// 			const text = heading ? heading.textContent.trim() : '';
// 			if (text) {
// 				section.setAttribute('aria-label', text);
// 			}
// 		}
// 	});

// 	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
// 		document.querySelectorAll('.bb-mts .bb-mts-media-el[data-bb-video]').forEach((video) => {
// 			if (typeof video.pause === 'function') {
// 				video.pause();
// 			}
// 		});
// 	}
// };

// if (document.readyState === 'loading') {
// 	document.addEventListener('DOMContentLoaded', init);
// } else {
// 	init();
// }

import { createRoot } from 'react-dom/client';
import './style.scss';
import Styles from './Components/Common/Styles';
import MediaText from './Components/Frontend/MediaText';

document.addEventListener('DOMContentLoaded', () => {
	const mediaTextSections = document.querySelectorAll('.wp-block-b-blocks-media-text-section[data-attributes]');
	mediaTextSections.forEach(mediaTextSection => {
		let attributes = {};
		try {
			const raw = mediaTextSection.dataset.attributes;
			if (raw && raw !== 'undefined' && raw !== '') {
				attributes = JSON.parse(raw);
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.warn('MediaTextSection: Invalid attributes JSON', e);
		}
		const mediaTextHost = mediaTextSection.querySelector('.bBlocksMediaTextSectionInnerBlockContent');
		if (!mediaTextHost) return;

		createRoot(mediaTextSection).render(
			<>
				<Styles attributes={attributes} id={mediaTextSection.id} />
				<MediaText attributes={attributes} id={mediaTextSection.id} mediaTextHost={mediaTextHost} />
			</>
		);
		mediaTextSection?.removeAttribute('data-attributes');
	});
});