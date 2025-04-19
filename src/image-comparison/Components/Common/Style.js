import { isExist } from '../../../../../bpl-tools/utils/common';
import { getBackgroundCSS, getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';
import { handlerBorder } from '../../utils/options';

const Style = ({ attributes, id }) => {
	const { alignment, width, border, dragg: draggHandler, labelTypo, labelColors, labelPadding, capTypo, capColors, capPadding, styles } = attributes;
	const { dragg } = styles

	const mainSl = `#${id}`;
	const imgCompareSl = `${mainSl} .${prefix}`;
	const wrapperSl = `${imgCompareSl} .icb-comparison-wrapper`;
	const labelSl = `${wrapperSl} .icb-label`;
	const capSl = `${imgCompareSl} .icb-caption`;
	const sliderSl = `${wrapperSl} .icb-comparison-slider-handle`;

	const isClExist = (cl) => handlerBorder.includes(cl) ? true : false
	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', labelTypo)?.googleFontLink}
		${getTypoCSS('', capTypo)?.googleFontLink}
		${getTypoCSS(labelSl, labelTypo)?.styles}
		${getTypoCSS(capSl, capTypo)?.styles}

		${mainSl}{
			text-align: ${alignment};
		}
		${imgCompareSl}{
			width: ${width};
			${getBorderCSS(border)}
		}

		${labelSl}{
			${getColorsCSS(labelColors)}
			padding: ${getSpaceCSS(labelPadding)};
		}
		${capSl}{
			${getColorsCSS(capColors)}
			padding: ${getSpaceCSS(capPadding)};
		}

		${isClExist(draggHandler.handleType) ? `${sliderSl} .icb-${draggHandler.handleType}-icon{
		${isValidCSS('border-color', dragg.handler.color)}
		${isValidCSS('border-width', isExist(dragg.line.size) ? dragg.line.size + 'px' : '')}
			}` : ''}

		${sliderSl} :where(svg){
			${isValidCSS('color', dragg.icon.color)}
			${isValidCSS('fill', dragg.icon.color)}
		}
		${sliderSl}::before{
			content:"";
			${isValidCSS('width', isExist(dragg.line.size) ? dragg.line.size + 'px' : '')}
			${getBackgroundCSS(dragg.line.bg)}
		}
		${sliderSl}::after{
			content:"";
			${isValidCSS('width', isExist(dragg.line.size) ? dragg.line.size + 'px' : '')}
			${getBackgroundCSS(dragg.line.bg)}
		}
		
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;