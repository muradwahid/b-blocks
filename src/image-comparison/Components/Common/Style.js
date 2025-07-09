import { isExist } from '../../../../../bpl-tools/utils/common';
import { getBackgroundCSS, getBorderBoxCSS, getBorderCSS, getBoxCSS, getColorsCSS, getSpaceCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';
import { handlerBorder } from '../../utils/options';

const Style = ({ attributes, id }) => {
	const { alignment, width, border, dragg: draggHandler, labelTypo, labelColors, labelPadding, capTypo, capColors, capPadding, styles, theme, sliderStyle } = attributes;
	const { dragg } = styles;

	const { pagination, navigation } = sliderStyle;
	const { icon, container } = navigation;

	const mainSl = `#${id}`;
	const imgCompareSl = `${mainSl} .${prefix}`;
	const wrapperSl = `${imgCompareSl} .b-blocks-comparison-wrapper`;
	const labelSl = `${wrapperSl} .b-blocks-label`;
	const capSl = `${imgCompareSl} .b-blocks-caption`;
	const sliderSl = `${wrapperSl} .b-blocks-comparison-slider-handle`;


	//slider selectors
	const sliderContainerSl = `${mainSl} .b-blocks-image-compare-slider-wrapper`;
	const navigationSl = `${sliderContainerSl} .slick-arrow`;
	const paginationSl = `${sliderContainerSl} .slick-dots`;

	const isClExist = (cl) => handlerBorder.includes(cl) ? true : false;
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

		${isClExist(draggHandler.handleType) ? `${sliderSl} .b-blocks-${draggHandler.handleType}-icon{
		${isValidCSS('border-color', dragg.handler.color)}
		${isValidCSS('border-width', isExist(dragg.line.size) ? dragg.line.size + 'px' : '')}
			}` : `${sliderSl} .b-blocks-${draggHandler.handleType}-icon{
				${isValidCSS('background-color', dragg.handler.color)}
				${isValidCSS('border-color', dragg.handler.color)}
			}`}

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
		${theme === "slider" ? `
				${navigationSl}{
					${isValidCSS("height", container.height)}
					${isValidCSS("width", container.width)}
					${getBackgroundCSS(container.normal.bg)}
					${getBorderBoxCSS(container.normal.border)}
					${isValidCSS("border-radius", getBoxCSS(container.normal.radius))}
				}

				${navigationSl}:hover{
					${getBackgroundCSS(container.hover.bg)}
					${getBorderBoxCSS(container.hover.border)}
					${isValidCSS("border-radius", getBoxCSS(container.hover.radius))}
				}

				${navigationSl} > svg{
					${isValidCSS("width", icon.normal.size)}
					${isValidCSS("fill", icon.normal.color)}
				}
				${navigationSl}:hover svg{
					${isValidCSS("fill", icon.hover.color)}
					${isValidCSS("width", icon.hover.size)}
				}
				${paginationSl}>li>button::before{
					${isValidCSS("background-color", pagination.active)}
				}
				${paginationSl}>li.slick-active>button::before{
					${isValidCSS("background-color", pagination.active)}
				}
				`: ""
			}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;