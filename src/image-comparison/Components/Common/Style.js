import { getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../../Components/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { alignment, width, border, labelTypo, labelColors, labelPadding, capTypo, capColors, capPadding } = attributes;

	const mainSl = `#${id}`;
	const imgCompareSl = `${mainSl} .${prefix}`;

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
			${getBorderCSS(border)};
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