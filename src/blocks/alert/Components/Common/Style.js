import { getColorsCSS, getBorderCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { width, alignment, textAlign, typography, colors, padding, border, shadow } = attributes;

	const mainAlertSl = `#bBlocksAlert-${clientId} .bBlocksAlert`;
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
		@media (max-width: 768px) {
			${alertSl} .alertIcon{
				font-size: ${typography?.fontSize?.tablet};
			}
		}
		@media (max-width: 576px) {
			${alertSl} .alertIcon{
				font-size: ${typography?.fontSize?.mobile};
			}c
		}
		`.replace(/\s+/g, ' ')
	}} />;
}
export default Style;