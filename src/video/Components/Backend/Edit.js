import { useEffect, useRef } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import { BplMediaPlaceholder } from '../../../../../Components';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { controlsHandler } from '../../utils/functions';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { source, poster, controls, repeat, muted, autoHideControl } = attributes;

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

	const id = `${prefix}-${clientId}`;

	return source ? <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<div className={prefix}>
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