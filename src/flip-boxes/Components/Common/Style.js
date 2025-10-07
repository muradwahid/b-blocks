import { getBackgroundCSS, getBorderCSS, getColorsCSS, getIconCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { boxes, columnGap, rowGap, boxHeight, textAlign, boxPadding, iconMargin, titleTypo, titleMargin, descTypo, btnTypo, btnPadding } = attributes;

	const mainSl = `#${id}`;
	const gFlipBoxSl = `${mainSl} .flipBox`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', descTypo)?.googleFontLink}
		${getTypoCSS('', btnTypo)?.googleFontLink}
		${getTypoCSS(`${gFlipBoxSl} .flipTitle`, titleTypo)?.styles}
		${getTypoCSS(`${gFlipBoxSl} .flipDescription`, descTypo)?.styles}
		${getTypoCSS(`${gFlipBoxSl} .flipBtn`, btnTypo)?.styles}

		${mainSl} .${prefix}{ grid-gap: ${rowGap} ${columnGap}; }
		${gFlipBoxSl}{
			height: ${boxHeight};
		}
		${gFlipBoxSl} .box{
			text-align: ${textAlign};
			padding: ${getSpaceCSS(boxPadding)};
		}
		${gFlipBoxSl} i.flipIcon{
			margin: ${getSpaceCSS(iconMargin)};
		}
		${gFlipBoxSl} .flipTitle{
			margin: ${getSpaceCSS(titleMargin)};
		}
		${gFlipBoxSl} .flipBtn{
			padding: ${getSpaceCSS(btnPadding)};
		}
			
		${boxes.map((item, index) => {
			const { frontBG, backBG, border, shadow, frontIcon = {}, frontIconWidth = '70px', backIcon = {}, backIconWidth = '70px', frontTitleColor, backTitleColor, descColor, btnBorder, btnColors, btnHovColors } = item;

			const flipBoxSl = `${mainSl} #flipBox-${index}`;

			return `
				${flipBoxSl} .box{
					${getBorderCSS(border)}
					box-shadow: ${getShadowCSS(shadow)};
				}
				${flipBoxSl} .box.front{
					${getBackgroundCSS(frontBG)}
				}
				${flipBoxSl} .box.back{
					${getBackgroundCSS(backBG)}
				}
				${flipBoxSl} img.flipIcon.frontIcon{
					width: ${frontIconWidth};
				}
				${flipBoxSl} i.flipIcon.frontIcon{
					${getIconCSS(frontIcon)}
				}
				${flipBoxSl} img.flipIcon.backIcon{
					width: ${backIconWidth};
				}
				${flipBoxSl} i.flipIcon.backIcon{
					${getIconCSS(backIcon)}
				}
				${flipBoxSl} .flipTitle.flipFrontTitle{
					color: ${frontTitleColor};
				}
				${flipBoxSl} .flipTitle.flipBackTitle{
					color: ${backTitleColor};
				}
				${flipBoxSl} .flipDescription{
					color: ${descColor};
				}
				${flipBoxSl} .flipBtn{
					${getColorsCSS(btnColors)}
					${getBorderCSS(btnBorder)}
				}
				${flipBoxSl} .flipBtn:hover{
					${getColorsCSS(btnHovColors)}
				}
			`;
		}).join(' ')}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;