import { useState, useEffect, useRef } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import DotLottiePlayer from '../Common/DotLottiePlayer';
import { toggleAttr } from '../../utils/functions';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { file, isControls, isAutoplay, isLoop, isHover, mode, direction = 1, count, speed, intermission, background, isCap = false, caption = '', renderer = '', activeAnimationId = '' } = attributes;

		const isPremium = bBlocksPremiumChecker;

	const lottieEl = useRef(null);
	const [fileFrameSize, setFileFrameSize] = useState(0);
	// Animation ids inside the loaded file (a .lottie file can hold several), for the Animation setting.
	const [animationIds, setAnimationIds] = useState([]);

	const setFrameSize = (player) => {
		player.addEventListener('ready', () => {
			const { animationData } = player.getLottie() || {};

			setFileFrameSize(Math.round(animationData?.op || 100));
		});
	}

	const id = `block-${clientId}`;

	// The block is inside the editor iframe, so look the holder up by ref (a document.querySelector here searched the parent page and found nothing).
	const holderRef = useRef(null);

	// Set or Remove attributes
	useEffect(() => {
		const lottieWrapper = holderRef.current;

		lottieWrapper ? lottieWrapper.innerHTML = '' : '';

		const loopCount = 0 < count ? count : true;
		const loopVal = isLoop ? loopCount : false;

		// Created by the iframe document: a player made by the parent window cannot attach its styles inside the iframe.
		const reInitPlayer = (lottieWrapper?.ownerDocument || document).createElement('dotlottie-player');
		toggleAttr(reInitPlayer, file, 'src', file);
		toggleAttr(reInitPlayer, isControls, 'controls', '');
		toggleAttr(reInitPlayer, isAutoplay, 'autoplay', '');
		toggleAttr(reInitPlayer, isLoop, 'loop', loopVal);
		toggleAttr(reInitPlayer, isHover, 'hover', '');
		toggleAttr(reInitPlayer, mode, 'mode', mode);
		toggleAttr(reInitPlayer, speed, 'speed', speed);
		toggleAttr(reInitPlayer, true, 'direction', direction);
		toggleAttr(reInitPlayer, intermission, 'intermission', intermission * 1000);
		toggleAttr(reInitPlayer, background, 'background', background);
		toggleAttr(reInitPlayer, true, 'debug');
		toggleAttr(reInitPlayer, renderer, 'renderer', renderer);
		toggleAttr(reInitPlayer, activeAnimationId, 'activeanimationid', activeAnimationId);

		lottieWrapper ? lottieWrapper.appendChild(reInitPlayer) : '';

		setFrameSize(reInitPlayer);
		reInitPlayer.addEventListener('ready', () => setAnimationIds((reInitPlayer.getManifest()?.animations || []).map(animation => animation.id)));
	}, [file, isControls, isAutoplay, isLoop, isHover, mode, direction, count, speed, intermission, background, renderer, activeAnimationId]);

	// Set Total Frame
	useEffect(() => {
		const player = lottieEl?.current;

		setFrameSize(player);
	}, []);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} fileFrameSize={fileFrameSize} animationIds={animationIds} isPremium={isPremium} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={id} />

			<div className={prefix}>
				<span className='lottieHolder' ref={holderRef}>
					<DotLottiePlayer ref={lottieEl} attributes={attributes} />
				</span>

				{isCap && <><br /><span className='caption'>{caption}</span></>}
			</div>
		</div>
	</>;
};
export default Edit;