import { getBorderCSS, getColorsCSS, getMultiShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';
import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { hideOn = { desktop: false, tablet: false, mobile: false }, isFullWidth, addCSS, alignment, typography, colors, hovColors, padding, border, shadow } = attributes;

	const mainSl = `#${id}`;
	const btnSl = `${mainSl} .${prefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', typography)?.googleFontLink}
		${getTypoCSS(btnSl, typography)?.styles}

		${mainSl}{
			text-align: ${alignment};
		}
		@media only screen and (min-width: 769px) {
			${btnSl}:not(.btnEditor){
				display: ${hideOn?.desktop ? 'none' : 'inline-flex'};
			}
			${btnSl}.btnEditor{
				opacity: ${hideOn?.desktop ? 0.8 : 1};
			}
		}
		@media only screen and (max-width: 768px) and (min-width: 577px) {
			${btnSl}:not(.btnEditor){
				display: ${hideOn?.tablet ? 'none' : 'inline-flex'};
			}
			${btnSl}.btnEditor{
				opacity: ${hideOn?.tablet ? 0.8 : 1};
			}
		}
		@media only screen and (max-width: 576px) {
			${btnSl}:not(.btnEditor){
				display: ${hideOn?.mobile ? 'none' : 'inline-flex'};
			}
			${btnSl}.btnEditor{
				opacity: ${hideOn?.mobile ? 0.8 : 1};
			}
		}
		${btnSl}{
			${getColorsCSS(colors) || 'color: #fff; background-color: #4527a4;'}
			width: ${isFullWidth ? '100%' : 'auto'};
			padding: ${getSpaceCSS(padding) || '10px 20px'};
			${getBorderCSS(border) || 'border-radius: 5px;'}
			box-shadow: ${getMultiShadowCSS(shadow?.shadow || shadow) || 'none'};
		}
		${btnSl}:hover{
			${getColorsCSS(hovColors) || 'color: #fff; background-color: #8344c5;'}
		}
		${addCSS}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;