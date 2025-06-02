import { getColorsCSS, getBorderCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';
import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { width, alignment, textAlign, typography, colors, padding, border, shadow } = attributes;

	const mainAlertSl = `#${id} .${prefix}`;
	const alertSl = `${mainAlertSl} .alert`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', typography)?.googleFontLink}
		${getTypoCSS(alertSl, typography)?.styles}

		${alertSl}{
			text-align: ${alignment};
		}
		${alertSl}{
			text-align: ${textAlign};
			width: ${['0px', '0%', '0em'].includes(width) ? 'auto' : width};
			${getColorsCSS(colors)}
			padding: ${getSpaceCSS(padding)};
			${getBorderCSS(border)}
			box-shadow: ${getShadowCSS(shadow)};
		}
		${alertSl} .alertIcon{
			font-size: ${typography?.fontSize?.desktop};
			color: ${colors?.color};
		}
		${alertSl} .alertClose{
			color: ${colors?.color};
		}
		@media only screen and (max-width: 1024px) {
			${alertSl} .alertIcon{
				font-size: ${typography?.fontSize?.tablet};
			}
		}
		@media only screen and (max-width: 640px) {
			${alertSl} .alertIcon{
				font-size: ${typography?.fontSize?.mobile};
			}c
		}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;