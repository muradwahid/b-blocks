import { useEffect, useRef } from 'react';

import { BplMediaPlaceholder } from '../../../../Components';

import Settings from './Settings';
import Style from './Style';
import { controlsHandler } from './utils/functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { source, poster, controls, repeat, muted, autoHideControl } = attributes;

	useEffect(() => { clientId && setAttributes({ clientId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to clientId

	const videoWrapper = useRef(null);
	const videoElement = useRef(null);

	useEffect(() => {
		if (source) {
			videoWrapper.current.innerHTML = '';
			videoWrapper.current.innerHTML = videoElement.current.outerHTML;

			new Plyr(videoWrapper.current.children[0], {
				controls: controlsHandler(controls),
				clickToPlay: false,
				loop: { active: repeat },
				muted,
				hideControls: autoHideControl,
			});
		}
	}, [source, poster, controls, videoWrapper]);

	return source ? <>
		<Settings attributes={attributes} setAttributes={setAttributes} clientId={clientId} />

		<div className={className} id={`bBlocksVideo-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className='bBlocksVideo'>
				<div className='videoWrapper' ref={videoWrapper}></div>

				{/* eslint-disable-next-line react/no-unknown-property */}
				<video controls playsinline data-poster={poster} preload={'metadata'} ref={videoElement}>
					Your browser does not support the video tag.
					<source src={source} type='video/mp4' />
				</video>
			</div>
		</div>
	</> : <BplMediaPlaceholder type='video' icon={<svg xmlns='http://www.w3.org/2000/svg' width={24} height={24} viewBox='0 0 24 24' className='html5-block-icon' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<polygon points='23 7 16 12 23 17 23 7'></polygon>
		<rect x='1' y='5' width='15' height='14' rx='2' ry='2'></rect>
	</svg>} onChange={val => setAttributes({ source: val.url })} />;
};
export default Edit;