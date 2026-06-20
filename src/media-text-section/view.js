/**
 * Media & Text Section — frontend view script.
 *
 * Two small jobs:
 *  1. Import style.scss so the build emits view.css (the front-end stylesheet
 *     referenced from block.json as `"style": "file:./view.css"`).
 *  2. If no explicit aria-label was set on the <section>, derive one from the
 *     first heading inside the content panel so the landmark is named for AT.
 *     Also pause decorative video when prefers-reduced-motion is set.
 */
import './style.scss';

const init = () => {
	const sections = document.querySelectorAll('.bb-mts[data-bb-mts-label]');

	sections.forEach((section) => {
		const explicit = (section.getAttribute('data-bb-mts-label') || '').trim();

		if (!explicit && !section.getAttribute('aria-label')) {
			const heading = section.querySelector(
				'.bb-mts-content h1, .bb-mts-content h2, .bb-mts-content h3, .bb-mts-content h4, .bb-mts-content h5, .bb-mts-content h6'
			);
			const text = heading ? heading.textContent.trim() : '';
			if (text) {
				section.setAttribute('aria-label', text);
			}
		}
	});

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		document.querySelectorAll('.bb-mts .bb-mts-media-el[data-bb-video]').forEach((video) => {
			if (typeof video.pause === 'function') {
				video.pause();
			}
		});
	}
};

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
