import { getBackgroundCSS, getBorderCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';
import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { textAlign, background, typography, color, padding, border } = attributes;

	const animatedTextSl = `#${id} .${prefix}`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', typography)?.googleFontLink}
		${getTypoCSS(`${animatedTextSl} .content`, typography)?.styles}

		${animatedTextSl}{
			text-align: ${textAlign};
			${getBackgroundCSS(background)}
			padding: ${getSpaceCSS(padding)};
			${getBorderCSS(border)}
		}
		${animatedTextSl} .content{
			color: ${color};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;