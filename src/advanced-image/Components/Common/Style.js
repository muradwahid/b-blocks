import { getBoxCSS, getColorsCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id, isBackend = false }) => {
	const { layout, style, captionStyle, image, advanced } = attributes;
	const { width, height, isAutoHeight, isAutoFit, fitOptionType } = layout;
	const { hoverEffect, optionType, alignment } = style;
	const { typo, desktop, tablet, mobile, colors } = captionStyle;

	const mainSl = `#${id} .${prefix}`;
	const imageSl = `${mainSl} .image`;
	const captionSl = `${imageSl} .caption`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', typo)?.googleFontLink}
		${getTypoCSS(captionSl, typo)?.styles}

		${mainSl}{
			align-items:${alignment.desktop};
		}

		${imageSl}{
			width : ${image.source?.url ? width.desktop : '100%'};
			height: ${isAutoHeight ? 'auto' : height.desktop};
			border-radius: ${optionType === 'rounded' ? '15px' : optionType === 'square' ? '0px' : (optionType === 'Circle' ? '100%' : '0')};
			${isValidCSS("clip-path", optionType === 'Triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
			optionType === 'Rhombus' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' :
				optionType === 'Octagon' ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' :
					optionType === 'square' ? 'inset(0%)' : '')}
		}

		${mainSl} img{
			${isAutoFit ?
				`object-fit: ${fitOptionType};` : isValidCSS('object-fit', optionType === 'Triangle' || optionType === 'Octagon' || optionType === 'Rhombus' ? 'cover' : '')
			}
			${isValidCSS("transform", hoverEffect === "zoomOut" ? 'scale(1.5)' : '')}
			filter: ${hoverEffect === 'blur' ? 'blur(3px)' : 'blur(0px)'};
		}
		${mainSl}:hover img{
			${isValidCSS('transform', hoverEffect === 'zoomIn' ? 'scale(1.5)' : hoverEffect === 'zoomOut' ? 'scale(1)' : '')}
			${isValidCSS('filter', hoverEffect === 'blur' ? 'blur(0px)' : "")}
		}

		${captionSl}{
			width: ${desktop.width ? desktop.width : '100%'};
			text-align:${desktop.textAlign};
			${getColorsCSS(colors)}
			${isValidCSS('padding', getBoxCSS(desktop.padding))}
			${isValidCSS('margin', getBoxCSS(desktop.margin))}
			${captionAlignment(desktop.vAlign, desktop.hAlign)}
		}

		@media only screen and (min-width:641px) and (max-width: 1024px){
			${mainSl}{
				align-items:${alignment.tablet};
			}

			${imageSl}{
				width : ${image.source?.url ? width.tablet : '100%'};
				height: ${isAutoHeight ? 'auto' : height.tablet};
			}

			${captionSl}{
				width: ${tablet.width ? tablet.width : '100%'};
				text-align:${tablet.textAlign};
				${isValidCSS('padding', getBoxCSS(tablet.padding))}
				${isValidCSS('margin', getBoxCSS(tablet.margin))}
				${captionAlignment(tablet.vAlign, tablet.hAlign)}
			}
		}
			
		@media only screen and (max-width:640px){
			${mainSl}{
				align-items:${alignment.mobile};
			}

			${imageSl}{
				width : ${image.source?.url ? width.mobile : '100%'};
				height: ${isAutoHeight ? 'auto' : height.mobile};
			}

			${captionSl}{
				width: ${mobile.width ? mobile.width : '100%'};
				text-align:${mobile.textAlign};
				${isValidCSS('padding', getBoxCSS(mobile.padding))}
				${isValidCSS('margin', getBoxCSS(mobile.margin))}
				${captionAlignment(mobile.vAlign, mobile.hAlign)}
			}
		}
		${generateCSS(id, advanced, isBackend)}
	`}} />
}
export default Style;

const captionAlignment = (v, h) => `
	${h === "left" ? 'left: 0; right: auto;' : h === "center" ? `left:50%;${v !== "middle" ? "transform: translateX(-50%);" : ""}` : "right:0;left:auto;"}
	${v === "top" ? "top:0;bottom:auto;" : v === "middle" ? `top:50%;${h !== "center" ? "transform: translateY(-50%);" : ""}` : "bottom:0;top:auto;"}
	${(h === "center" && v === "middle") ? "transform:translateY(-50%) translateX(-50%);" : ""}
	`;