import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import { controlsHandler } from './utils/functions';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const videoEls = document.querySelectorAll('.wp-block-b-blocks-video');
	videoEls.forEach(videoEl => {
		const attributes = JSON.parse(videoEl.dataset.attributes);

		createRoot(videoEl).render(<>
			<Style attributes={attributes} id={videoEl.id} />

			<RenderVideo attributes={attributes} />
		</>);

		videoEl?.removeAttribute('data-attributes');
	});
});

const RenderVideo = ({ attributes }) => {
	const { source, poster, controls, repeat, autoplay, muted, resetOnEnd, autoHideControl } = attributes;

	const videoEl = useRef(null);

	useEffect(() => {
		new Plyr(videoEl.current, {
			controls: controlsHandler(controls),
			clickToPlay: false,
			loop: { active: repeat },
			muted,
			autoplay,
			resetOnEnd,
			hideControls: autoHideControl,
		});
	}, []);

	return <div className={prefix}>
		<div className='videoWrapper'>
			<video controls playsInline data-poster={poster} preload='metadata' ref={videoEl}>
				Your browser does not support the video tag.
				<source src={source} type='video/mp4' />
			</video>
		</div>
	</div>
} 