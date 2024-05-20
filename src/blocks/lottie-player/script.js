import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import './style.scss';
import Style from './Components/Common/Style';
import DotLottiePlayer from './Components/Common/DotLottiePlayer';
import { toggleAttr } from './utils/functions';

document.addEventListener('DOMContentLoaded', () => {
	const lottiePlayerEls = document.querySelectorAll('.wp-block-b-blocks-lottie-player');
	lottiePlayerEls.forEach(lottiePlayerEl => {
		const attributes = JSON.parse(lottiePlayerEl.dataset.attributes);
		const { cId } = attributes;

		createRoot(lottiePlayerEl).render(<>
			<Style attributes={attributes} clientId={cId} />

			<RenderLottiePlayer attributes={attributes} clientId={cId} />
		</>);

		lottiePlayerEl?.removeAttribute('data-attributes')
	});
});

const RenderLottiePlayer = ({ attributes, clientId }) => {
	const { isControls, isAutoplay, isLoop, isHover, link, isLinkInNewTab = false, interactivity = 'noInteractivity', interactivityMode = '', interactivityContainer = '.wp-block-b-blocks-lottie-player', interactivityActions = [], isCap = false, caption = '' } = attributes;

	const lottieEl = useRef(null);

	useEffect(() => {
		const lottiePlayer = document.querySelector(`#bBlocksLottiePlayer-${clientId} .bBlocksLottiePlayer lottie-player`);

		toggleAttr(lottiePlayer, isControls, 'controls', '');
		toggleAttr(lottiePlayer, isAutoplay, 'autoplay', '');
		toggleAttr(lottiePlayer, isLoop, 'loop', '');
		toggleAttr(lottiePlayer, isHover, 'hover', '');
	}, []);

	// Interactivity
	useEffect(() => {
		const player = lottieEl?.current;

		if (player && interactivity && 'noInteractivity' !== interactivity) {
			player.addEventListener('ready', () => {
				LottieInteractivity.create({
					player: player.getLottie(),
					container: 'scrollRelativeToContainer' === interactivity ? interactivityContainer : `#bBlocksLottiePlayer-${clientId}`,
					mode: interactivityMode,
					actions: interactivityActions
				});
			});
		}
	}, [lottieEl?.current]);

	return <div className='bBlocksLottiePlayer'>
		{link ?
			<a href={link} target={isLinkInNewTab ? '_blank' : '_self'} rel='noreferrer'>
				<DotLottiePlayer ref={lottieEl} attributes={attributes} />
			</a> :
			<DotLottiePlayer ref={lottieEl} attributes={attributes} />}

		{isCap && <><br /><span className='caption'>{caption}</span></>}
	</div>
}