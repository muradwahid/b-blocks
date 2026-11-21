import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { alignment, width, height, background = {}, progressBarColor = '', posterColor = '', btnColor = '', btnBg = {}, btnBorder = {}, btnRadius = {}, btnShadow = [] } = attributes;

	const mainSl = `#${id} .${prefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${mainSl}{
			text-align: ${alignment};
		}
		${mainSl} model-viewer{
			width: ${['0px', '0%', '0em'].includes(width) ? 'auto' : width};
			height: ${['0px', '0%', '0em'].includes(height) ? '350px' : height};
		}
		${mainSl} model-viewer{
			${getBackgroundCSS(background)}
			${progressBarColor ? `--progress-bar-color: ${progressBarColor};` : ''}
			${posterColor ? `--poster-color: ${posterColor};` : ''}
		}
		${mainSl} .bBlocks3DViewerBtn, ${mainSl} .bBlocks3DViewerSelectors select{
			${btnColor ? `color: ${btnColor};` : ''}
			${getBackgroundCSS(btnBg)}
			${Object.keys(btnBorder).length ? getBorderBoxCSS(btnBorder) : ''}
			${isValidCSS('border-radius', getBoxCSS(btnRadius))}
			${isValidCSS('box-shadow', getMultiShadowCSS(btnShadow))}
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;