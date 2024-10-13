

import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBorderCSS, getMultiShadowCSS } from '../../../../../Components/utils/getCSS';

const Style = ({ attributes, id }) => {
	const { wrapper, content, shape, } = attributes;
	const { top, bottom } = shape;
	const { isFlip } = top;
	const { minHeight, border, shadow } = wrapper;
	const { isFullWidth, width, textAlign, color, verticalAlign, horizontalAlign } = content;
	const { normal, hover } = shadow;
	const { normalBorder, hoverBorder, } = border;

	const mainSl = `#${id}`;
	const contentSl = `${mainSl} .bBlocksContainerContent`;
	const bottomShaped = `${mainSl} .bottomShaped`;
	const topShaped = `${mainSl} .topShaped`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${generateCSS(id, attributes.advanced)}
		${mainSl}{
			min-height: ${0 === parseInt(minHeight) ? 'auto' : minHeight};
			${getBorderCSS(normalBorder)};
			box-shadow:${getMultiShadowCSS(normal)};
			align-items: ${horizontalAlign};
			justify-content: ${verticalAlign};
			overflow: hidden;
		}

		${mainSl}:hover{
			${getBorderCSS(hoverBorder)};
			box-shadow:${getMultiShadowCSS(hover)};
		}

		${contentSl}{
			width: ${(isFullWidth || 0 === parseInt(width.desktop)) ? '100%' : width.desktop};
			text-align: ${textAlign};
			color: ${color};
			z-index: 99999;
		}

		${topShaped} svg{
			width: ${top?.width.desktop};
			height: ${top?.height.desktop};
			color: ${top?.color};
			fill: ${top?.color};
			${isFlip ? `transform: translateX(0%) rotateY(180deg);` : ''}
		}

		${topShaped} svg path{
			color: ${top?.color};
			fill: ${top?.color};
		}

		${bottomShaped} svg{
			width: ${bottom?.width.desktop};
			height: ${bottom?.height.desktop};
			color: ${bottom?.color};
			fill: ${bottom?.color};

		${bottom?.isFlip ? `transform: translateX(0%) rotateX(180deg);` : `transform: rotate(180deg);`}
		${bottom?.isUpload ? `transform: none;` : ''}
		}
		${bottomShaped} svg path{
			color: ${bottom?.color};
			fill: ${bottom?.color};
		}

		@media only screen and (max-width:640px){
			${topShaped} svg{
				width: ${top?.width.mobile};
				height: ${top?.height.mobile};
			}
			${bottomShaped} svg{
				width: ${bottom?.width.mobile};
				height: ${bottom?.height.mobile};
			}
		}

		@media only screen and (min-width:641px) and (max-width: 1024px){
			${topShaped} svg{
				width: ${top?.width.tablet};
				height: ${top?.height.tablet};
			}
			${bottomShaped} svg{
				width: ${bottom?.width.tablet};
				height: ${bottom?.height.tablet};
			}
		}
	`.replace(/\s+/g, ' ')
	}} />
}
export default Style;