import { getBackgroundCSS, getBorderCSS, getColorsCSS, getIconCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { boxes, columnGap, rowGap, boxHeight, textAlign, boxPadding, iconMargin, titleTypo, titleMargin, descTypo, btnTypo, btnPadding } = attributes;

	const mainSl = `#bBlocksFlipBoxes-${clientId}`;
	const gFlipBoxSl = `${mainSl} .bBlocksFlipBox`;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS(`${gFlipBoxSl} .flipTitle`, titleTypo)}
			${getTypoCSS(`${gFlipBoxSl} .flipDescription`, descTypo)}
			${getTypoCSS(`${gFlipBoxSl} .flipBtn`, btnTypo)}

			${mainSl} .bBlocksFlipBoxes{ grid-gap: ${rowGap} ${columnGap}; }
			${gFlipBoxSl}{
				height: ${boxHeight};
			}
			${gFlipBoxSl} .box{
				text-align: ${textAlign};
				padding: ${getSpaceCSS(boxPadding)};
			}
			${gFlipBoxSl} .flipIcon{
				margin: ${getSpaceCSS(iconMargin)};
			}
			${gFlipBoxSl} .flipTitle{
				margin: ${getSpaceCSS(titleMargin)};
			}
			${gFlipBoxSl} .flipBtn{
				padding: ${getSpaceCSS(btnPadding)};
			}
			`.replace(/\s+/g, ' ')
		}} />

		{boxes.map((item, index) => {
			const { frontBG, backBG, border, shadow, frontIcon, backIcon, frontTitleColor, backTitleColor, descColor, btnBorder, btnColors, btnHovColors } = item;

			const flipBoxSl = `${mainSl} #bBlocksFlipBox-${index}`;

			return <style key={index} dangerouslySetInnerHTML={{
				__html: `
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
				${flipBoxSl} .flipIcon.frontIcon{
					${getIconCSS(frontIcon)}
				}
				${flipBoxSl} .flipIcon.backIcon{
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
				`.replace(/\s+/g, ' ')
			}} />;
		})}
	</>;
}
export default Style;