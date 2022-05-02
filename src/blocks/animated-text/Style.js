const Style = ({ attributes, clientId }) => {
	const { textAlign, background, typography, color, padding, border } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${typography?.googleFontLink ? `@import url(${typography?.googleFontLink});` : ''}

		#bBlocksAnimatedText-${clientId} .bBlocksAnimatedText{
			text-align: ${textAlign};
			${background?.styles ?? 'background-color: #0000;'}
			padding: ${padding?.styles ?? '15px 15px'};
			${border?.styles ?? 'border-radius: 5px;'}
		}
		#bBlocksAnimatedText-${clientId} .bBlocksAnimatedText .content{
			${typography?.styles || 'font-size: 22px;'}
			color: ${color};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;