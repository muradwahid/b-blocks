const Style = ({ attributes, clientId }) => {
	const { cards = [], columnGap, rowGap, textAlign, padding, imgHeight, catTypo, catMargin, titleTypo, titleMargin, descTypo } = attributes;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			${catTypo?.googleFontLink ? `@import url(${catTypo?.googleFontLink});` : ''}
			${titleTypo?.googleFontLink ? `@import url(${titleTypo?.googleFontLink});` : ''}
			${descTypo?.googleFontLink ? `@import url(${descTypo?.googleFontLink});` : ''}

			#bBlocksCards-${clientId} .bBlocksCards{
				grid-gap: ${rowGap} ${columnGap};
			}
			#bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardImage img{ height: ${imgHeight}; }
			#bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardDetails{
				text-align: ${textAlign};
				padding: ${padding?.styles || '20px 10px'}; 
			}
			#bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardDetails .cardCategory{
				${catTypo?.styles || 'font-size: 15px;'}
				margin: ${catMargin?.styles || '0 0 10px 0'};
			}
			#bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardTitle{
				${titleTypo?.styles || 'font-size: 22px;'}
				margin: ${titleMargin?.styles || '0 0 10px 0'};
			}
			#bBlocksCards-${clientId} .bBlocksCards .bBlocksCard .cardDescription{
				${descTypo?.styles || 'font-size: 15px;'}
			}
			`.replace(/\s+/g, ' ')
		}} />

		{cards.map((item, index) => {
			const { background, imgBorder, catColor, titleColor, descColor } = item;

			return <style key={index} dangerouslySetInnerHTML={{
				__html: `
				#bBlocksCards-${clientId} #bBlocksCard-${index} .bBlocksCard{
					${background?.styles || `background-color: #0000;`}
				}
				#bBlocksCards-${clientId} #bBlocksCard-${index} .cardImage{
					${imgBorder?.styles || 'border-radius: 5px;'}
				}
				#bBlocksCards-${clientId} #bBlocksCard-${index} .cardDetails .cardCategory{
					color: ${catColor};
				}
				#bBlocksCards-${clientId} #bBlocksCard-${index} .cardTitle{
					color: ${titleColor};
				}
				#bBlocksCards-${clientId} #bBlocksCard-${index} .cardDescription{
					color: ${descColor};
				}
				`.replace(/\s+/g, ' ')
			}} />;
		})}
	</>;
}
export default Style