import { getBorderBoxCSS, getBoxCSS, isValidCSS } from "../../../../../bpl-tools/utils/getCSS";
import { generateCSS } from "../../../../../bpl-tools/Advanced/generateCSS";

const Style = ({ attributes, id, isBackend = false }) => {
    const { sliderStyles, advanced } = attributes;
    const { caption } = sliderStyles;
    const mainSl = `#${id}`;
    const blockSl = `${mainSl} .b-blocks-logo-slider-main-wrapper`;
    const slideSl = `${blockSl} .b-blocks-logo-slider-wrapper`;
    const imgSl = `${slideSl} .b-blocks-losl-logo`;
    const captionSl = `${slideSl} .b-blocks-logo-slider-block-caption`;
    return <style dangerouslySetInnerHTML={{
        __html: `
        ${slideSl}{
            ${isValidCSS('height', sliderStyles.logo.height)}
            ${isValidCSS('width', sliderStyles.logo.width)}
            ${getBorderBoxCSS(sliderStyles.logo.border)}
            ${isValidCSS('border-radius', getBoxCSS(sliderStyles.logo.radius))}
        }
        ${imgSl}{
            ${isValidCSS('object-fit', sliderStyles.logo.logoFitOption)}
        }
        ${captionSl}{
            ${isValidCSS('color', caption.color.text)}
            ${isValidCSS('background-color', caption.color.bg)}
        }
    ${generateCSS(id, advanced, isBackend)}
    `}} />
};

export default Style;