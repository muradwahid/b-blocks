import { getBackgroundCSS, getBorderCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { cards = [], columnGap, rowGap, textAlign, padding, imgHeight, catTypo, catMargin, titleTypo, titleMargin, descTypo } = attributes;

	const mainSl = `#${id}`;
	const gCardSl = `${mainSl} .${prefix} .card`;
	const cardDetailsSl = `${gCardSl} .cardDetails`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', catTypo)?.googleFontLink}
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', descTypo)?.googleFontLink}
		${getTypoCSS(`${cardDetailsSl} .cardCategory`, catTypo)?.styles}
		${getTypoCSS(`${gCardSl} .cardTitle`, titleTypo)?.styles}
		${getTypoCSS(`${gCardSl} .cardDescription`, descTypo)?.styles}

		${mainSl} .${prefix}{
			grid-gap: ${rowGap} ${columnGap};
		}
		${gCardSl} .cardImage,
		${gCardSl} .cardImage img{
			height: ${imgHeight};
		}
		${cardDetailsSl}{
			text-align: ${textAlign};
			padding: ${getSpaceCSS(padding)};
		}
		${cardDetailsSl} .cardCategory{
			margin: ${getSpaceCSS(catMargin)};
		}
		${gCardSl} .cardTitle{
			margin: ${getSpaceCSS(titleMargin)};
		}

		${cards.map((item, index) => {
			const { background, imgBorder, catColor, titleColor, descColor } = item;

			const cardSl = `#${id} #card-${index}`;

			return `
				${cardSl} .card{
					${getBackgroundCSS(background)}
				}
				${cardSl} .cardImage{
					${getBorderCSS(imgBorder)}
				}
				${cardSl} .cardDetails .cardCategory{
					color: ${catColor};
				}
				${cardSl} .cardTitle{
					color: ${titleColor};
				}
				${cardSl} .cardDescription{
					color: ${descColor};
				}
			`;
		}).join(' ')}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;