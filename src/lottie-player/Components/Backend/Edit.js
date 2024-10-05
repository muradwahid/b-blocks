import { useState, useEffect, useRef } from 'react';
import { useBlockProps } from '@wordpress/block-editor';

import usePremiumInEditor from '../../../hooks/usePremiumInEditor';
import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { toggleAttr } from '../../utils/functions';
import DotLottiePlayer from '../Common/DotLottiePlayer';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { file, isControls, isAutoplay, isLoop, isHover, mode, direction = 1, count, speed, intermission, background, isCap = false, caption = '' } = attributes;

	const { isPremium = false } = usePremiumInEditor();

	const lottieEl = useRef(null);
	const [fileFrameSize, setFileFrameSize] = useState(0);

	const setFrameSize = (player) => {
		player.addEventListener('ready', () => {
			const { animationData } = player.getLottie() || {};

			setFileFrameSize(Math.round(animationData?.op || 100));
		});
	}

	const id = `${prefix}-${clientId}`;

	// Set or Remove attributes
	const lottieWrapper = document.querySelector(`#${id} .${prefix} .lottieHolder`);

	useEffect(() => {
		lottieWrapper ? lottieWrapper.innerHTML = '' : '';

		const reInitPlayer = document.createElement('dotlottie-player');
		toggleAttr(reInitPlayer, file, 'src', file);
		toggleAttr(reInitPlayer, isControls, 'controls', '');
		toggleAttr(reInitPlayer, isAutoplay, 'autoplay', '');
		toggleAttr(reInitPlayer, isLoop, 'loop', '');
		toggleAttr(reInitPlayer, isHover, 'hover', '');
		toggleAttr(reInitPlayer, mode, 'mode', mode);
		toggleAttr(reInitPlayer, count, 'count', count);
		toggleAttr(reInitPlayer, speed, 'speed', speed);
		toggleAttr(reInitPlayer, true, 'direction', direction);
		toggleAttr(reInitPlayer, intermission, 'intermission', intermission * 1000);
		toggleAttr(reInitPlayer, background, 'background', background);
		toggleAttr(reInitPlayer, true, 'debug');

		lottieWrapper ? lottieWrapper.appendChild(reInitPlayer) : '';

		setFrameSize(reInitPlayer);
	}, [file, isControls, isAutoplay, isLoop, isHover, mode, direction, count, speed, intermission, background]);

	// Set Total Frame
	useEffect(() => {
		const player = lottieEl?.current;

		setFrameSize(player);
	}, []);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} fileFrameSize={fileFrameSize} isPremium={isPremium} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<div className={prefix}>
				<span className='lottieHolder'>
					<DotLottiePlayer ref={lottieEl} attributes={attributes} />
				</span>

				{isCap && <><br /><span className='caption'>{caption}</span></>}
			</div>
		</div>
	</>;
};
export default Edit;