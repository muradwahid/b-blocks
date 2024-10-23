import { useEffect, forwardRef } from 'react';

import { toggleAttr } from '../../utils/functions';

const DotLottiePlayer = ({ attributes }, ref) => {
	const { file, isControls, isAutoplay, isLoop, isHover, mode, direction = 1, count, speed, intermission, background } = attributes;

	useEffect(() => {
		if (ref?.current) {
			const loopCount = 0 < count ? count : true;
			const loopVal = isLoop ? loopCount : false;

			toggleAttr(ref?.current, isControls, 'controls', '');
			toggleAttr(ref?.current, isAutoplay, 'autoplay', '');
			toggleAttr(ref?.current, isLoop, 'loop', loopVal);
			toggleAttr(ref?.current, isHover, 'hover', '');
		}
	}, [ref]);

	return <dotlottie-player
		ref={ref}
		src={file}
		autoplay
		loop
		mode={mode}
		speed={speed}
		direction={direction}
		intermission={intermission * 1000}
		background={background}
		debug
	></dotlottie-player>
}
export default forwardRef(DotLottiePlayer);