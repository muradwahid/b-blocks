import { getBackgroundCSS, getBorderCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { cards = [], columnGap, rowGap, textAlign, padding, imgHeight, catTypo, catMargin, titleTypo, titleMargin, descTypo } = attributes;

	const gCardSl = `#bBlocksCards-${clientId} .bBlocksCards .bBlocksCard`;
	const cardDetailsSl = `${gCardSl} .cardDetails`;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS(`${cardDetailsSl} .cardCategory`, catTypo)}
			${getTypoCSS(`${gCardSl} .cardTitle`, titleTypo)}
			${getTypoCSS(`${gCardSl} .cardDescription`, descTypo)}

			#bBlocksCards-${clientId} .bBlocksCards{
				grid-gap: ${rowGap} ${columnGap};
			}
			${gCardSl} .cardImage img{ height: ${imgHeight}; }
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

				const cardSl = `#bBlocksCards-${clientId} #bBlocksCard-${index}`;

				return `
					${cardSl} .bBlocksCard{
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
			})}
			`.replace(/\s+/g, ' ')
		}} />
	</>;
}
export default Style;