const Style = ({ attributes, clientId }) => {
	const { counters = [], columnGap, rowGap, background, padding, textAlign, counterWidth, counterHeight, iconSize, numberTypo, labelTypo, counterPadding, counterBorder, counterShadow } = attributes;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			${numberTypo?.googleFontLink ? `@import url(${numberTypo?.googleFontLink});` : ''}
			${labelTypo?.googleFontLink ? `@import url(${labelTypo?.googleFontLink});` : ''}
			
			#bBlocksCounters-${clientId} .bBlocksCounters{
				grid-gap: ${rowGap} ${columnGap};
				${background?.styles || `background-color: #0000;`}
				padding: ${padding?.styles || '20px 0px'};
			}
			#bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter{
				text-align: ${textAlign};
				width: ${'0px' === counterWidth || '0%' === counterWidth || '0em' === counterWidth ? '250px' : counterWidth};
				height: ${'0px' === counterHeight || '0%' === counterHeight || '0em' === counterHeight ? '250px' : counterHeight};
				padding: ${counterPadding?.styles || '20px 20px'};
				${counterBorder?.styles || 'border-radius: 50%;'}
				box-shadow: ${counterShadow?.styles || 'none'};
			}
			#bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter .counterIcon i, #bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter .counterIconLabel i{
				font-size: ${iconSize || 50}px
			}
			#bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter .counterNumber{
				${numberTypo?.styles || 'font-size: 48px'}
			}
			#bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter .counterLabel{
				${labelTypo?.styles || 'font-size: 22px;'}
			}
			`.replace(/\s+/g, ' ')
		}} />

		<style>
			{counters?.map((item, index) => `
				#bBlocksCounters-${clientId} #bBlocksCounter-${index} .bBlocksCounter{
					${item.background?.styles || `background-color: #4527a4;`}
				}
				#bBlocksCounters-${clientId} #bBlocksCounter-${index} .counterIcon i, #bBlocksCounters-${clientId} #bBlocksCounter-${index} .counterIconLabel i{
					${item.icon?.styles || 'color: #fff;'}
				}
				#bBlocksCounters-${clientId} #bBlocksCounter-${index} .counterNumber{
					color: ${item.number.color};
				}
				#bBlocksCounters-${clientId} #bBlocksCounter-${index} .counterLabel{
					color: ${item.label.color};
				}
			`.replace(/\s+/g, ' '))}
		</style>
	</>
}
export default Style;