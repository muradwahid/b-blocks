import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { boxPosition, width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, sepType, sepSize, sepColor } = attributes;

	const mainSl = `#bBlocksCountdown-${clientId}`;
	const itemsSl = `${mainSl} .countdownItems`;
	const itemSl = `${itemsSl} .countdownItem`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', digitTypo)?.googleFontLink}
		${getTypoCSS('', labelTypo)?.googleFontLink}
		${getTypoCSS(`${itemSl} .digit`, digitTypo)?.styles}
		${getTypoCSS(`${itemSl} .label`, labelTypo)?.styles}

		${mainSl}{
			align-items: ${alignment};
			justify-content: ${alignment};
		}
		${itemsSl}{
			gap: ${boxSpace};
			width: ${'0px' === width || '0%' === width || '0em' === width ? 'auto' : width};
			${getBackgroundCSS(background)}
			padding: ${getSpaceCSS(padding)};
			box-shadow: ${getShadowCSS(shadow)};
			justify-content: ${boxPosition};
		}
		${itemSl}{
			${getBackgroundCSS(boxBG)}
			width: ${boxWidth};
			height: ${boxHeight};
			${getBorderCSS(boxBorder)}
			box-shadow: ${getShadowCSS(boxShadow)};
		}
		${itemsSl} .separator::before{
			content: '${sepType}';
			font-size: ${sepSize}px;
			color: ${sepColor};
		}
		${itemSl} .digit{
			color: ${digitColor};
		}
		${itemSl} .label{
			color: ${labelColor};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;