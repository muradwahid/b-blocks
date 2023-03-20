import { getBackgroundCSS, getBorderCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { boxPosition, width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, sepType, sepSize, sepColor } = attributes;

	const mainSl = `#bBlocksCountdown-${clientId}`;
	const itemsSl = `${mainSl} .countdownItems`;
	const itemSl = `${itemsSl} .countdownItem`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS(`${itemSl} .digit`, digitTypo)}
		${getTypoCSS(`${itemSl} .label`, labelTypo)}

		${mainSl}{
			align-items: ${alignment};
			justify-content: ${alignment};
		}
		${itemsSl}{
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
			margin-left: calc(${boxSpace} / 2);
			margin-right: calc(${boxSpace} / 2);
			${getBorderCSS(boxBorder)}
			box-shadow: ${getShadowCSS(boxShadow)};
		}
		@media (max-width: 575px){
			${itemSl}{
				margin-top: calc(${boxSpace} / 2);
				margin-bottom: calc(${boxSpace} / 2);
			}
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