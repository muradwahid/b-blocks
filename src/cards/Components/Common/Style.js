import { getBackgroundCSS, getBorderCSS, getSpaceCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';
import { imgAlign as imageAlignment } from '../../utils/functions';

const Style = ({ attributes, id }) => {
	const { cards = [], columnGap, rowGap, textAlign, padding, imgHeight, catTypo, catMargin, titleTypo, titleMargin, descTypo,imgWidth, imgAlign,layout } = attributes;

	const mainSl = `#${id}`;
	const gCardSl = `${mainSl} .${prefix} .${prefix}-card`;
	const cardDetailsSl = `${gCardSl} .cardDetails`;

	// const imgAlign = 

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', catTypo)?.googleFontLink}
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', descTypo)?.googleFontLink}
		${getTypoCSS(`${cardDetailsSl} .${prefix}-cardCategory`, catTypo)?.styles}
		${getTypoCSS(`${gCardSl} .${prefix}-cardTitle`, titleTypo)?.styles}
		${getTypoCSS(`${gCardSl} .cardDescription`, descTypo)?.styles}

		${mainSl} .${prefix}{
			grid-gap: ${rowGap} ${columnGap};
		}
		${gCardSl} .${prefix}-cardImage{
			${isValidCSS('width',imgWidth ? `calc( ${imgWidth} - 30px)`:'' )}
			${isValidCSS('height',imgHeight)}
			${layout ==='vertical'? imageAlignment(imgAlign):''}
		}
		${cardDetailsSl}{
			text-align: ${textAlign};
			padding: ${getSpaceCSS(padding)};
		}
		${cardDetailsSl} .${prefix}-cardCategory{
			margin: ${getSpaceCSS(catMargin)};
		}
		${gCardSl} .${prefix}-cardTitle{
			margin: ${getSpaceCSS(titleMargin)};
		}

		${cards.map((item, index) => {
			const { background, imgBorder, catColor, titleColor, descColor } = item;

			const cardSl = `#${id} #${prefix}-card-${index}`;

			return `
				${cardSl} .${prefix}-card{
					${getBackgroundCSS(background)}
				}
				${cardSl} .${prefix}-cardImage{
					${getBorderCSS(imgBorder)}
				}
				${cardSl} .cardDetails .${prefix}-cardCategory{
					color: ${catColor};
				}
				${cardSl} .${prefix}-cardTitle{
					color: ${titleColor};
				}
				${cardSl} .${prefix}-cardDescription{
					color: ${descColor};
				}
			`;
		}).join(' ')}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;