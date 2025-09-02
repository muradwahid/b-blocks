import { isExist } from '../../../../../bpl-tools/utils/common';
import { primaryColor, secondaryColor } from '../../../../../bpl-tools/utils/data';
import { getBorderCSS, getColorsCSS, getMultiShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { hideOn = { desktop: false, tablet: false, mobile: false }, isFullWidth, addCSS, alignment, typography, colors, hovColors, padding, border, shadow, buttonHover } = attributes;

	const mainSl = `#${id}`;
	const btnSl = `${mainSl} .${prefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', typography)?.googleFontLink}
		${getTypoCSS(btnSl, typography)?.styles}

		${mainSl}{
			text-align: ${alignment};
		}
		${btnSl}:not(.btnEditor){
			display: ${hideOn?.desktop ? 'none' : 'inline-flex'};
		}
		${btnSl}.btnEditor{
			opacity: ${hideOn?.desktop ? 0.8 : 1};
		}
		@media only screen and (max-width: 1024px) {
			${btnSl}:not(.btnEditor){
				display: ${hideOn?.tablet ? 'none' : 'inline-flex'};
			}
			${btnSl}.btnEditor{
				opacity: ${hideOn?.tablet ? 0.8 : 1};
			}
		}
		@media only screen and (max-width: 640px) {
			${btnSl}:not(.btnEditor){
				display: ${hideOn?.mobile ? 'none' : 'inline-flex'};
			}
			${btnSl}.btnEditor{
				opacity: ${hideOn?.mobile ? 0.8 : 1};
			}
		}
		${btnSl}{
			${getColorsCSS(colors) || `color: #fff; background-color: ${primaryColor};`}
			width: ${isFullWidth ? '100%' : 'auto'};
			padding: ${getSpaceCSS(padding) || '10px 20px'};
			${getBorderCSS(border) || 'border-radius: 5px;'}
			box-shadow: ${getMultiShadowCSS(shadow?.shadow || shadow) || 'none'};
		}
		${btnSl}:hover{
			${getColorsCSS(hovColors) || `color: #fff; background-color: ${secondaryColor};`}
			${isExist(buttonHover?.shadow)? `box-shadow: ${getMultiShadowCSS(buttonHover?.shadow) };` : ''}
			${isExist(buttonHover?.border)? getBorderCSS(buttonHover?.border) : ''}
			${isExist(buttonHover?.padding) ? `padding: ${getSpaceCSS(buttonHover?.padding)}`:''  }
		}
		${addCSS}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;