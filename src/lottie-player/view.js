import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import { sanitizeURL } from '../../../bpl-tools/utils/common';

import './style.scss';
import Style from './Components/Common/Style';
import DotLottiePlayer from './Components/Common/DotLottiePlayer';
import { toggleAttr } from './utils/functions';
import { prefix } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const playerEls = document.querySelectorAll('.wp-block-b-blocks-lottie-player');
	playerEls.forEach(playerEl => {
		const attributes = JSON.parse(playerEl.dataset.attributes);

		createRoot(playerEl).render(<>
			<Style attributes={attributes} id={playerEl.id} />

			<RenderLottiePlayer attributes={attributes} id={playerEl.id} />
		</>);

		playerEl?.removeAttribute('data-attributes')
	});
});

const RenderLottiePlayer = ({ attributes, id }) => {
	const { isControls, isAutoplay, isLoop, isHover, count, link, isLinkInNewTab = false, interactivity = 'noInteractivity', interactivityMode = '', interactivityContainer = '.wp-block-b-blocks-lottie-player', interactivityActions = [], isCap = false, caption = '' } = attributes;

	const lottieEl = useRef(null);

	useEffect(() => {
		const lottiePlayer = document.querySelector(`#${id} .${prefix} lottie-player`);

		const loopCount = 0 < count ? count : true;
		const loopVal = isLoop ? loopCount : false;

		toggleAttr(lottiePlayer, isControls, 'controls', '');
		toggleAttr(lottiePlayer, isAutoplay, 'autoplay', '');
		toggleAttr(lottiePlayer, isLoop, 'loop', loopVal);
		toggleAttr(lottiePlayer, isHover, 'hover', '');
	}, []);

	// Interactivity
	useEffect(() => {
		const player = lottieEl?.current;

		if (player && interactivity && 'noInteractivity' !== interactivity) {
			player.addEventListener('ready', () => {
				LottieInteractivity.create({
					player: player.getLottie(),
					container: 'scrollRelativeToContainer' === interactivity ? interactivityContainer : `#${id}`,
					mode: interactivityMode,
					actions: interactivityActions
				});
			});
		}
	}, [lottieEl?.current]);

	return <div className={prefix}>
		{link ?
			<a href={sanitizeURL(link)} target={isLinkInNewTab ? '_blank' : '_self'} rel='noreferrer'>
				<DotLottiePlayer ref={lottieEl} attributes={attributes} />
			</a> :
			<DotLottiePlayer ref={lottieEl} attributes={attributes} />}

		{isCap && <><br /><span className='caption'>{caption}</span></>}
	</div>
}