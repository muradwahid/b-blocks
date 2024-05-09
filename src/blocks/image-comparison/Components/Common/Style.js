import { getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { alignment, width, border, labelTypo, labelColors, labelPadding, capTypo, capColors, capPadding } = attributes;

	const mainSl = `#bBlocksImageComparison-${clientId}`;
	const imgCompareSl = `${mainSl} .bBlocksImageComparison`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', labelTypo)?.googleFontLink}
		${getTypoCSS('', capTypo)?.googleFontLink}
		${getTypoCSS(`${imgCompareSl} .overlay`, labelTypo)?.styles}
		${getTypoCSS(`${imgCompareSl} .caption`, capTypo)?.styles}

		${mainSl}{
			text-align: ${alignment};
		}
		${imgCompareSl}{
			width: ${width};
			${getSpaceCSS(border)};
		}

		${imgCompareSl} .overlay{
			${getColorsCSS(labelColors)}
			padding: ${getSpaceCSS(labelPadding)};
		}
		${imgCompareSl} .caption{
			${getColorsCSS(capColors)}
			padding: ${getSpaceCSS(capPadding)};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;