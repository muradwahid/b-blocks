import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';


const Style = ({ attributes, id, isBackend = false }) => {
    const { styles, layout, buttons: buttonsOption, advanced, animationDuration } = attributes;
    const { buttons } = styles;

    const duration = Number.isFinite(animationDuration) ? animationDuration : 300;

    // The fade gradient must start from the chosen fade color at zero alpha —
    // not transparent-white — otherwise any non-white color washes through a
    // gray/white haze. Convert the picker's rgba()/hex value to its 0-alpha form.
    const toTransparent = (color) => {
        const c = (color || '').trim();
        const rgb = c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
        if (rgb) {
            return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, 0)`;
        }
        let hex = c.replace('#', '');
        if (/^[0-9a-fA-F]{3,4}$/.test(hex)) {
            hex = hex.split('').map((ch) => ch + ch).join('');
        }
        if (/^[0-9a-fA-F]{6,8}$/.test(hex)) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return `rgba(${r}, ${g}, ${b}, 0)`;
        }
        return 'rgba(0, 0, 0, 0)';
    };

    const fadeColor = layout.fadeColor || '#ffffff';

    const mainSl = `#${id}`;
    const blockSl = `${mainSl} .b-blocks-expand-content-wrapper`;
    const innerBlockSl = `${blockSl} .b-blocks-expand-content-innerBlocks`;
    const buttonContainerSl = `${blockSl} .b-blocks-expand-content-toggle-button-container`;
    const buttonSl = `${buttonContainerSl} .b-blocks-expand-content-toggle-button`;

    return <style dangerouslySetInnerHTML={{
        __html: `
            ${getTypoCSS('', buttons.showMore.typo).googleFontLink}
            ${getTypoCSS(`${buttonSl}.is-showMore`, buttons.showMore.typo).styles}

            ${getTypoCSS('', buttons.showLess.typo).googleFontLink}
            ${getTypoCSS(`${buttonSl}.is-showLess`, buttons.showLess.typo).styles}

            ${innerBlockSl}{
                transition: max-height ${duration}ms ease-in-out;
            }

            ${innerBlockSl}.is-clamped{
                ${isValidCSS('max-height', layout.previewHeight)}
            }

            ${innerBlockSl}.is-clamped::after{
                height: ${layout.fadeHeight || '80px'};
                background: linear-gradient(to bottom, ${toTransparent(fadeColor)} 0%, ${fadeColor} 100%);
            }

            ${buttonSl}.is-showMore{
                ${isValidCSS('padding', getBoxCSS(buttons.showMore.padding))}
                ${getBackgroundCSS(buttons.showMore.bg)}
                ${getBorderBoxCSS(buttons.showMore.border)}
                ${isValidCSS('border-radius', getBoxCSS(buttons.showMore.radius))}
                ${isValidCSS('color', buttons.showMore.color)}
            }

            ${buttonSl}.is-showLess{
                ${isValidCSS('padding', getBoxCSS(buttons.showLess.padding))}
                ${getBackgroundCSS(buttons.showLess.bg)}
                ${getBorderBoxCSS(buttons.showLess.border)}
                ${isValidCSS('border-radius', getBoxCSS(buttons.showLess.radius))}
                ${isValidCSS('color', buttons.showLess.color)}
            }

            ${buttonContainerSl}{
                ${isValidCSS('justify-content', buttonsOption.alignment)}
            }

            ${generateCSS(id, advanced, isBackend, false)}

        `}} />
};

export default Style;