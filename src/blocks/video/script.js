import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Style';
import { controlsHandler } from './utils/functions';

// Countdown Time
document.addEventListener('DOMContentLoaded', () => {
	const allVideos = document.querySelectorAll('.wp-block-b-blocks-video');
	allVideos.forEach(video => {
		const attributes = JSON.parse(video.dataset.attributes);

		createRoot(video).render(<>
			<Style attributes={attributes} clientId={attributes.clientId} />

			<RenderVideo attributes={attributes} />
		</>);

		video?.removeAttribute('data-attributes');
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

	return <div className='bBlocksVideo'>
		<div className='videoWrapper'>
			{/* eslint-disable-next-line react/no-unknown-property */}
			<video controls playsinline data-poster={poster} preload='metadata' ref={videoEl}>
				Your browser does not support the video tag.
				<source src={source} type='video/mp4' />
			</video>
		</div>
	</div>
} 