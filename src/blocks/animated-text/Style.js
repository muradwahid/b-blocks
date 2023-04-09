import { getBackgroundCSS, getBorderCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { textAlign, background, typography, color, padding, border } = attributes;

	const animatedTextSl = `#bBlocksAnimatedText-${clientId} .bBlocksAnimatedText`;

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