import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const Style = ({ attributes, id, isBackend = false }) => {
    const { image, options, spots, tooltip, advanced, hotspot } = attributes;

    const mainSl = `#${id}`;
    const blockSl = `${mainSl} .b-blocks-hotspot-image-wrapper`;
    const imageSl = `${blockSl} .b-blocks-hotspot-image`;
    const spotsContainerSl = `${blockSl} .b-blocks-bphb-hotspot-container`;
    const spotsSl = `${spotsContainerSl} .b-blocks-bphb-hotspot`;
    const spotsIconSl = `${spotsSl} .b-blocks-imghp-upload-icon`;
    const textIconSl = `${spotsSl} .b-blocks-imghp-text-icon`;
    const tooltipSl = `${spotsSl} .b-blocks-tooltip-reader`;

    return <style
        dangerouslySetInnerHTML={{
            __html: `
		${getTypoCSS('', tooltip.typo).googleFontLink}
		${getTypoCSS(tooltipSl, tooltip.typo).styles}
		${blockSl}{
			${isValidCSS('width', image.desktop.width)}
			${isValidCSS('height', image.desktop.height)}
		}
		${hotspot?.map((spot, index) => {
                return `${spotsContainerSl}#b-blocks-bphb-hotspot-container-${index}{
				${isValidCSS('left', `${spot.position.desktop.x}%`)}
				${isValidCSS('top', `${spot.position.desktop.y}%`)}
			}`
       }).join(' ')}
		${spotsSl} .b-blocks-imghp-library-icon>svg{
			${isValidCSS('fill', spots.normal.color.icon)}
			${isValidCSS('color', spots.iconColor)}
			${isValidCSS('height', spots.desktop.iconSize)}
			${isValidCSS('width', spots.desktop.iconSize)}
		}
		${spotsSl}{
			${isValidCSS('height', spots.desktop.height)}
			${isValidCSS('width', spots.desktop.width)}
			${isValidCSS('border-radius', getBoxCSS(spots.desktop.radius))}
			${isValidCSS('background-color', spots.normal.color.bg)}
			${isValidCSS('padding', getBoxCSS(spots.desktop.padding))}
			${getBorderBoxCSS(spots.normal.border)}
		}
        ${spotsIconSl}{
            ${isValidCSS('fill', spots.normal.color.icon)}
			${isValidCSS('color', spots.iconColor)}
			${isValidCSS('height', spots.desktop.iconSize)}
			${isValidCSS('width', spots.desktop.iconSize)}
        }
        ${textIconSl}{
            ${isValidCSS('color', spots.normal.color.icon)}
			${isValidCSS('font-size', spots.desktop.iconSize)}
        }
			${spotsSl}.three{
			border:unset;
			}
			${spotsSl}.three>span{
			${getBorderBoxCSS(spots.normal.border)}
			}

			${spotsSl}>svg{
			${isValidCSS('color', spots.normal.color.icon)}
			${isValidCSS('height', spots.desktop.iconSize)}
			${isValidCSS('width', spots.desktop.iconSize)}
		}
		${spotsSl}>svg path{
			${isValidCSS('fill', spots.normal.color.icon)}
		}
		${spotsSl}:hover{
			${isValidCSS('background-color', spots.hover.color.bg)}
			${getBorderBoxCSS(spots.hover.border)}
		}
		${spotsSl}:hover>span{
			${isValidCSS('color', spots.hover.color.icon)}
		}
		${spotsSl}:hover>svg{
			${isValidCSS('color', spots.hover.color.icon)}
		}
		${spotsSl}:hover>svg path{
			${isValidCSS('fill', spots.hover.color.icon)}
		}
		${spotsSl}:where(span,img){
			${isValidCSS('color', spots.normal.color.icon)}
			${isValidCSS('font-size', spots.desktop.iconSize)}
			${getBorderBoxCSS(spots.normal.border)}
		}

		${tooltipSl}{
			transition-duration: ${options.speed}ms;
			transition-delay: ${options.delay}ms;
			${getBorderBoxCSS(tooltip.border)}
			${isValidCSS('box-shadow', getMultiShadowCSS(tooltip?.shadow || []))}
			${isValidCSS('width', tooltip.desktop.width)}
			${isValidCSS('background-color', tooltip.bgColor)}
			${isValidCSS('padding', getBoxCSS(tooltip.desktop.padding))}
			${isValidCSS('border-radius', getBoxCSS(tooltip.desktop.radius))}
		}
		${tooltipSl} .b-blocks-bphb-tooltip-content>*{
				color: ${tooltip.textColor} !important;
				margin:0px;
			}
			${imageSl}{
			${isValidCSS('width', image.desktop.width)};
			${isValidCSS('height', image.desktop.height)};
			${isValidCSS('object-fit', image.objectFit)}
			}
		${tabBreakpoint} {

		${spotsSl} .b-blocks-imghp-library-icon>svg{
			${isValidCSS('height', spots.tablet.iconSize)}
			${isValidCSS('width', spots.tablet.iconSize)}
		}
		${spotsSl}{
			${isValidCSS('height', spots.tablet.height)}
			${isValidCSS('width', spots.tablet.width)}
			${isValidCSS('border-radius', getBoxCSS(spots.tablet.radius))}
			${isValidCSS('padding', getBoxCSS(spots.tablet.padding))}
		}
        ${textIconSl}{
			${isValidCSS('font-size', spots.tablet.iconSize)}
        }
		${spotsSl}>span{
			${isValidCSS('font-size', spots.tablet.iconSize)}
		}

		${tooltipSl}{
			${isValidCSS('width', tooltip.tablet.width)}
			${isValidCSS('padding', getBoxCSS(tooltip.tablet.padding))}
			${isValidCSS('border-radius', getBoxCSS(tooltip.tablet.radius))}
		}
        }
		${mobileBreakpoint} {
		${spotsSl} .b-blocks-imghp-library-icon>svg{
			${isValidCSS('height', spots.mobile.iconSize)}
			${isValidCSS('width', spots.mobile.iconSize)}
		}
		${spotsSl}{
			${isValidCSS('height', spots.mobile.height)}
			${isValidCSS('width', spots.mobile.width)}
			${isValidCSS('border-radius', spots.mobile.radius)}
			${isValidCSS('padding', getBoxCSS(spots.mobile.padding))}
		}
		${spotsSl}>span{
			${isValidCSS('font-size', spots.mobile.iconSize)}
			}
			${textIconSl}{
			${isValidCSS('font-size', spots.mobile.iconSize)}
			}

		${tooltipSl}{
			${isValidCSS('width', tooltip.mobile.width)}
			${isValidCSS('padding', getBoxCSS(tooltip.mobile.padding))}
			${isValidCSS('border-radius', getBoxCSS(tooltip.mobile.radius))}
		}
	}
		${generateCSS(id, advanced, isBackend,false)}
		`,
        }}
    />
};
export default Style;
