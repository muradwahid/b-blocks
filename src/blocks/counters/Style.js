import { getBackgroundCSS, getBorderCSS, getIconCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { counters = [], columnGap, rowGap, background, padding, textAlign, counterWidth, counterHeight, iconSize, numberTypo, labelTypo, counterPadding, counterBorder, counterShadow } = attributes;

	const mainSl = `#bBlocksCounters-${clientId}`;
	const countersSl = `${mainSl} .bBlocksCounters`;
	const gCounterSl = `${countersSl} .bBlocksCounter`;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', numberTypo)?.googleFontLink}
			${getTypoCSS('', labelTypo)?.googleFontLink}
			${getTypoCSS(`${gCounterSl} .counterNumber`, numberTypo)?.styles}
			${getTypoCSS(`${gCounterSl} .counterLabel`, labelTypo)?.styles}
			
			${countersSl}{
				grid-gap: ${rowGap} ${columnGap};
				${getBackgroundCSS(background)}
				padding: ${getSpaceCSS(padding)};
			}
			${gCounterSl}{
				text-align: ${textAlign};
				width: ${'0px' === counterWidth || '0%' === counterWidth || '0em' === counterWidth ? '250px' : counterWidth};
				height: ${'0px' === counterHeight || '0%' === counterHeight || '0em' === counterHeight ? '250px' : counterHeight};
				padding: ${getSpaceCSS(counterPadding)};
				${getBorderCSS(counterBorder)}
				box-shadow: ${getShadowCSS(counterShadow)};
			}
			${gCounterSl} .counterIcon,
			${gCounterSl} .counterIconLabel{
				font-size: ${iconSize || 50}px;
			}

			${counters?.map((item, index) => {
				const { background, icon, number, label } = item;

				const counterSl = `${mainSl} #bBlocksCounter-${index}`;

				return `
					${counterSl} .bBlocksCounter{
						${getBackgroundCSS(background)}
					}
					${counterSl} .counterIcon i,
					${counterSl} .counterIconLabel i{
						${getIconCSS(icon)}
						font-size: inherit;
					}
					${counterSl} .counterNumber{
						color: ${number.color};
					}
					${counterSl} .counterLabel{
						color: ${label.color};
					}
				`
			}).join(' ')}
			`.replace(/\s+/g, ' ')
		}} />
	</>
}
export default Style;