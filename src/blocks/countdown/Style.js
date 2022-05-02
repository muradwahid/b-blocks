const Style = ({ attributes, clientId }) => {
	const { boxPosition, width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, sepType, sepSize, sepColor } = attributes;

	// Functions
	const parseEmtStr = (val, def) => undefined === val ? def : val;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${digitTypo?.googleFontLink ? `@import url(${digitTypo?.googleFontLink});` : ''}
		${labelTypo?.googleFontLink ? `@import url(${labelTypo?.googleFontLink});` : ''}

		#bBlocksCountdown-${clientId}{
			align-items: ${alignment};
			justify-content: ${alignment};
		}
		#bBlocksCountdown-${clientId} .countdownItems{
			width: ${'0px' === width || '0%' === width || '0em' === width ? 'auto' : width};
			${background?.styles || 'background-color: #0000;'}
			padding: ${padding?.styles || '10px 15px'};
			box-shadow: ${shadow?.styles || 'none'};
			justify-content: ${boxPosition};
		}
		#bBlocksCountdown-${clientId} .countdownItems .countdownItem{
			${boxBG?.styles || `background-image: linear-gradient(135deg, #4527a4, #8344c5);`}
			width: ${boxWidth};
			height: ${boxHeight};
			margin-left: calc(${boxSpace} / 2);
			margin-right: calc(${boxSpace} / 2);
			${parseEmtStr(boxBorder?.styles, 'border-radius: 5%;')}
			box-shadow: ${boxShadow?.styles || 'none'};
		}
		@media (max-width: 575px){ #bBlocksCountdown-${clientId} .countdownItems .countdownItem{
			margin-top: calc(${boxSpace} / 2);
			margin-bottom: calc(${boxSpace} / 2);
		} }

		#bBlocksCountdown-${clientId} .countdownItems .separator::before{
			content: '${sepType}';
			font-size: ${sepSize}px;
			color: ${sepColor};
		}
		#bBlocksCountdown-${clientId} .countdownItems .countdownItem .digit{
			color: ${digitColor};
			${parseEmtStr(digitTypo?.styles, 'font-size: 48px;')}
		}
		#bBlocksCountdown-${clientId} .countdownItems .countdownItem .label{
			color: ${labelColor};
			${parseEmtStr(labelTypo?.styles, 'font-size: 18px;')}
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;