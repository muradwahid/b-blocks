import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBackgroundCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const Style = ({ attributes, id, isBackend = false }) => {
	const { layout = {}, line = {}, icon = {}, text = {}, spacing = {}, advanced } = attributes;

	const lineColor = line.color || '#cccccc';
	const iconColor = icon.color || lineColor;
	const textColor = text.color || lineColor;
	const lineBorder = `${line.width || '2px'} ${line.style || 'solid'} ${lineColor}`;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .b-blocks-divider`;
	const innerSl = `${blockSl} .b-blocks-divider-inner`;
	const lineSl = `${blockSl} .b-blocks-divider-line`;
	const iconSl = `${blockSl} .b-blocks-divider-icon`;
	const textSl = `${blockSl} .b-blocks-divider-text`;

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', text.typography).googleFontLink}
			${blockSl}{
				${isValidCSS('margin', getBoxCSS(spacing))}
			}
			${innerSl}{
				max-width: ${layout.width || '100%'};
			}
			${lineSl}{
				border-top: ${lineBorder};
			}
			${iconSl}{
				color: ${iconColor};
				font-size: ${icon.size || '16px'};
				${isValidCSS('padding', getBoxCSS(icon.padding))}
				${isValidCSS('border-radius', getBoxCSS(icon.borderRadius))}
				${getBackgroundCSS(icon.bg)}
			}
			${iconSl}>svg{
				fill: ${iconColor};
				${isValidCSS('height', icon.size)}
				${isValidCSS('width', icon.size)}
			}
			${getTypoCSS(textSl, text.typography).styles}
			${textSl}{
				color: ${textColor};
				${isValidCSS('padding', getBoxCSS(text.padding))}
				${getBackgroundCSS(text.bg)}
			}
			${generateCSS(id, advanced, isBackend, false)}
			`,
		}}
	/>;
};
export default Style;
