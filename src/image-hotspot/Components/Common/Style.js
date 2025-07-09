import { generateCSS } from "../../../../../bpl-tools/Advanced/generateCSS";
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";

const Style = ({ attributes, id, isBackend = false }) => {
    const { image, options, spots, tooltip, advanced } = attributes;

    const mainSl = `#${id}`;
    const blockSl = `${mainSl} .hotspot-image-wrapper`;
    const spotsSl = `${blockSl} .bphb-hotspot`;
    const tooltipSl = `${spotsSl} .tooltip-reader`;
    return <style
            dangerouslySetInnerHTML={{
                __html: `
        ${generateCSS(id, advanced, isBackend)}
        ${blockSl}{
            ${isValidCSS("width", image.width.desktop)}
            ${isValidCSS("height", image.height.desktop)}
        }
        ${spotsSl} .imghp-library-icon>svg{
            ${isValidCSS("fill", spots.iconColor)}
            ${isValidCSS("color", spots.iconColor)}
            ${isValidCSS("height", spots.iconSize.desktop)}
            ${isValidCSS("width", spots.iconSize.desktop)}
        }
        ${spotsSl}{
            ${isValidCSS("height", spots.height.desktop)}
            ${isValidCSS("width", spots.width.desktop)}
            ${isValidCSS("border-radius", getBoxCSS(spots.borderRadius.desktop))}
            ${isValidCSS("background-color", spots.bgColor)}
            ${isValidCSS("padding", getBoxCSS(spots.padding.desktop))}
            ${getBorderBoxCSS(spots.border)}
        }
            ${spotsSl}.three{
            border:unset;
            }
            ${spotsSl}.three>span{
            ${getBorderBoxCSS(spots.border)}
            }
        ${spotsSl}>span{
            ${isValidCSS("color", spots.iconColor)}
            ${isValidCSS("font-size", spots.iconSize.desktop)}
            }
            ${spotsSl}>svg{
            ${isValidCSS("color", spots.iconColor)}
            ${isValidCSS("height", spots.iconSize.desktop)}
            ${isValidCSS("width", spots.iconSize.desktop)}
        }
        ${spotsSl}>svg path{
            ${isValidCSS("fill", spots.iconColor)}
        }
        ${spotsSl}:hover{
            ${isValidCSS("background-color", spots.hoverColor.bg)}
            ${isValidCSS("border-color", spots.hoverColor.border)}
        }
        ${spotsSl}:hover>span{
            ${isValidCSS("color", spots.hoverColor.icon)}
        }
        ${spotsSl}:hover>svg{
            ${isValidCSS("color", spots.hoverColor.icon)}
        }
        ${spotsSl}:hover>svg path{
            ${isValidCSS("fill", spots.hoverColor.icon)}
        }
        ${spotsSl}:where(span,img){
            ${isValidCSS("color", spots.iconColor)}
            ${isValidCSS("font-size", spots.iconSize.desktop)}
            ${getBorderBoxCSS(spots.border)}
        }

        ${tooltipSl}{
            transition-duration: ${options.speed}ms;
            transition-delay: ${options.delay}ms;
            ${getBorderBoxCSS(tooltip.border)}
            ${isValidCSS("box-shadow", getMultiShadowCSS(tooltip?.shadow || []))}
            ${isValidCSS("width", tooltip.width)}
            ${isValidCSS("background-color", tooltip.bgColor)}
            ${isValidCSS("padding", getBoxCSS(tooltip.padding.desktop))}
            ${isValidCSS("border-radius", getBoxCSS(tooltip.borderRadius.desktop))}
        }
        ${tooltipSl} .bphb-tooltip-content :where(h1,h2,h3,h4,h5,h6,p,span,i,em,strong,a){
                color: ${tooltip.textColor} !important;
                margin:0px;
            }
            ${blockSl}>.hotspot-image{
            ${isValidCSS("width", image.width.desktop)};
            ${isValidCSS("height", image.height.desktop)};
            }
        ${tabBreakpoint} {
        ${spotsSl} .imghp-library-icon>svg{
            ${isValidCSS("height", spots.iconSize.tablet)}
            ${isValidCSS("width", spots.iconSize.tablet)}
        }
        ${spotsSl}{
            ${isValidCSS("height", spots.height.tablet)}
            ${isValidCSS("width", spots.width.tablet)}
            ${isValidCSS("border-radius", getBoxCSS(spots.borderRadius.tablet))}
            ${isValidCSS("padding", getBoxCSS(spots.padding.tablet))}
        }
        ${spotsSl}>span{
            ${isValidCSS("font-size", spots.iconSize.tablet)}
        }
        ${spotsSl} :where(span,img){
            ${isValidCSS("font-size", spots.iconSize.tablet)}
        }

        ${tooltipSl}{
            ${isValidCSS("padding", getBoxCSS(tooltip.padding.tablet))}
            ${isValidCSS("border-radius", getBoxCSS(tooltip.borderRadius.tablet))}
        }

        ${mobileBreakpoint} {
        ${spotsSl} .imghp-library-icon>svg{
            ${isValidCSS("height", spots.iconSize.mobile)}
            ${isValidCSS("width", spots.iconSize.mobile)}
        }
        ${spotsSl}{
            ${isValidCSS("height", spots.height.mobile)}
            ${isValidCSS("width", spots.width.mobile)}
            ${isValidCSS("border-radius", spots.borderRadius.mobile)}
            ${isValidCSS("padding", getBoxCSS(spots.padding.mobile))}
        }
        ${spotsSl}>span{
            ${isValidCSS("font-size", spots.iconSize.mobile)}
            }
            ${spotsSl} :where(span,img){
            ${isValidCSS("font-size", spots.iconSize.mobile)}
        }

        ${tooltipSl}{
            ${isValidCSS("padding", getBoxCSS(tooltip.padding.mobile))}
            ${isValidCSS("border-radius", getBoxCSS(tooltip.borderRadius.mobile))}
        }
    }
        `,
            }}
        /> 
};
export default Style;
