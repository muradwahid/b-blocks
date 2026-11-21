import { getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { playerAlign, link, width, controlsHeight, controlsBG, controlsIconColor, controlsIconHoverColor, controlsIconActiveColor, controlsTrackColor, controlsThumbColor, capAlign = 'center', capTypo = {}, capColors = { color: '#333' }, capPadding = {}, capMargin = {}, isSeeker = true } = attributes;

	const lottiePlayerSl = `#${id} .${prefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', capTypo)?.googleFontLink}
		${getTypoCSS(`${lottiePlayerSl} .caption`, capTypo)?.styles}

		${lottiePlayerSl}{
			text-align: ${playerAlign};
		}
		${lottiePlayerSl} dotlottie-player{
			width: ${width};
			cursor: ${link ? 'pointer' : 'auto'};
			--lottie-player-toolbar-height: ${controlsHeight};
			--lottie-player-toolbar-background-color: ${controlsBG};
			--lottie-player-toolbar-icon-color: ${controlsIconColor};
			--lottie-player-toolbar-icon-hover-color: ${controlsIconHoverColor};
			--lottie-player-toolbar-icon-active-color: ${controlsIconActiveColor};
			--lottie-player-seeker-track-color: ${controlsTrackColor};
			--lottie-player-seeker-thumb-color: ${controlsThumbColor};
			${isSeeker ? '' : '--lottie-player-seeker-display: none;'}
		}
		${lottiePlayerSl} .caption{
			width: ${width};
			text-align: ${capAlign};
			${getColorsCSS(capColors)};
			padding: ${getSpaceCSS(capPadding)};
			margin: ${getSpaceCSS(capMargin)};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;