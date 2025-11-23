import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';
const Style = ({ attributes, id }) => {
    const { background, height, padding, margin, border, borderRadius } = attributes;
    const mainSl = `#${id}`;
    const blockSl = `${mainSl} .b-blocks-emoji-stack-separator-container`;
    return <style dangerouslySetInnerHTML={{
        __html: `
            ${blockSl}{
                ${getBackgroundCSS(background)}
                ${isValidCSS('height', height)}
                ${isValidCSS('padding',getBoxCSS(padding))}
                ${isValidCSS('margin', getBoxCSS(margin))}
                ${getBorderBoxCSS(border)}
                ${isValidCSS('border-radius', getBoxCSS(borderRadius))}
            }
        `}} />;
};

export default Style;
