const Style = ({ attributes, clientId }) => {
	const { alignment, width, border, labelTypo, labelColors, labelPadding, capTypo, capColors, capPadding } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${labelTypo?.googleFontLink ? `@import url(${labelTypo?.googleFontLink})` : ''}
		${capTypo?.googleFontLink ? `@import url(${capTypo?.googleFontLink})` : ''}

		#bBlocksImageComparison-${clientId}{
			text-align: ${alignment};
		}
		#bBlocksImageComparison-${clientId} .bBlocksImageComparison{
			width: ${width};
			${border?.styles};
		}

		#bBlocksImageComparison-${clientId} .bBlocksImageComparison .overlay{
			${labelTypo?.styles || 'font-size: 15px;'}
			${labelColors?.styles || 'color: #fff; background: #00000080;'}
			padding: ${labelPadding?.styles || '10px 15px'};
		}
		#bBlocksImageComparison-${clientId} .bBlocksImageComparison .caption{
			${capTypo?.styles || 'font-size: 14px;'}
			${capColors?.styles || 'color: #333; background: #f4f4f4;'}
			padding: ${capPadding?.styles || '10px 15px'};
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;