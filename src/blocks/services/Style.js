const Style = ({ attributes, clientId, isBackend = false }) => {
	const { columnGap, rowGap, background, textAlign, itemHeight, itemPadding, itemShadow, itemBorder, iconPadding, iconMargin, titleTypo, titleMargin, descTypo } = attributes;

	const gapStyle = isBackend ? `#bBlocksServices-${clientId} .bBlocksServices .block-editor-inner-blocks .block-editor-block-list__layout{
		grid-gap: ${rowGap} ${columnGap};
	}` : `#bBlocksServices-${clientId} .bBlocksServices{
		grid-gap: ${rowGap} ${columnGap};
	}`

	return <style dangerouslySetInnerHTML={{
		__html: `
		${titleTypo?.googleFontLink ? `@import url(${titleTypo?.googleFontLink});` : ''}
		${descTypo?.googleFontLink ? `@import url(${descTypo?.googleFontLink});` : ''}

		#bBlocksServices-${clientId} .bBlocksServices{
			${background?.styles || 'background-color: #0000;'}
		}
		${gapStyle}

		#bBlocksServices-${clientId} .bBlocksServices .bBlocksService{
			text-align: ${textAlign};
			min-height: ${itemHeight};
			padding: ${itemPadding?.styles || '50px 30px 50px 50px'};
			box-shadow: ${itemShadow?.styles || '0 0 20px 0 #0000001a'};
			${itemBorder?.styles || 'border-radius: 15px;'}
		}
		#bBlocksServices-${clientId} .bBlocksServices .bBlocksService .bgLayer{
			border-radius: ${itemBorder?.radius || '15px'}
		}
		#bBlocksServices-${clientId} .bBlocksServices .bBlocksService .icon{
			padding: ${iconPadding?.styles || '0 0 10px 0'};
			margin: ${iconMargin?.styles || '0 0 20px 0'};
		}
		#bBlocksServices-${clientId} .bBlocksServices .bBlocksService .title{
			${titleTypo?.styles || 'font-size: 23px;'}
			margin: ${titleMargin?.styles || '0 0 30px 0'};
		}
		#bBlocksServices-${clientId} .bBlocksServices .bBlocksService .description{
			${descTypo?.styles || 'font-size: 16px;'}
		}
		`.replace(/\s+/g, ' ')
	}} />
}
export default Style;