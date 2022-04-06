const Style = ({ attributes, clientId }) => {
	const { boxes, columnGap, rowGap, boxHeight, textAlign, boxPadding, iconMargin, titleTypo, titleMargin, descTypo, btnTypo, btnPadding } = attributes;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
			${titleTypo?.googleFontLink ? `@import url(${titleTypo?.googleFontLink})` : ''}
			${descTypo?.googleFontLink ? `@import url(${descTypo?.googleFontLink})` : ''}
			${btnTypo?.googleFontLink ? `@import url(${btnTypo?.googleFontLink})` : ''}

			#bBlocksFlipBoxes-${clientId} .bBlocksFlipBoxes{ grid-gap: ${rowGap} ${columnGap}; }
			#bBlocksFlipBoxes-${clientId} .bBlocksFlipBox{ height: ${boxHeight}; }
			#bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .box{
				text-align: ${textAlign};
				padding: ${boxPadding?.styles || '30px 25px'};
			}
			#bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipIcon{ margin: ${iconMargin?.styles || '0 0 20px 0'}; }
			#bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipTitle{
				${titleTypo?.styles || 'font-size: 25px;'}
				margin: ${titleMargin?.styles || '0 0 20px 0'};
			}
			#bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipDescription{ ${descTypo?.styles || 'font-size: 16px;'} }
			#bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipBtn{
				${btnTypo?.styles || 'font-size: 16px;'}
				padding: ${btnPadding?.styles || '15px 25px'};
			}
			`.replace(/\s+/g, ' ')
		}} />

		{boxes.map((item, index) => {
			const { frontBG, backBG, border, shadow, frontIcon, backIcon, frontTitleColor, backTitleColor, descColor, btnBorder, btnColors, btnHovColors } = item;

			return <style key={index} dangerouslySetInnerHTML={{
				__html: `
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .box{
					${border?.styles || ''}
					box-shadow: ${shadow?.styles || 'none'};
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .box.front{
					${frontBG?.styles || `background-color: #000000b3;`}
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .box.back{
					${backBG?.styles || `background-color: #000000b3;`}
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipIcon.frontIcon{
					${frontIcon?.styles || 'font-size: 70px; color: #fff;'}
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipIcon.backIcon{
					${backIcon?.styles || 'font-size: 70px; color: #fff;'}
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipTitle.flipFrontTitle{
					color: ${frontTitleColor};
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipTitle.flipBackTitle{
					color: ${backTitleColor};
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipDescription{
					color: ${descColor};
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipBtn{
					${btnColors?.styles || 'color: #fff; background: #ff4500;'}
					${btnBorder?.styles || 'border-radius: 3px;'}
				}
				#bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipBtn:hover{
					${btnHovColors?.styles || 'color: #fff; background: #ff7500;'}
				}
				`.replace(/\s+/g, ' ')
			}} />;
		})}
	</>;
}
export default Style;