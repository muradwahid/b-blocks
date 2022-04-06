const Style = ({ attributes, clientId }) => {
	const { slides = [], sliderWidth, sliderHeight, pageColor, pageWidth, pageHeight, pageBorder, prevNextColor, sliderAlign, titleTypo, descTypo, btnTypo, btnPadding, btnBorder } = attributes;

	const contentSlider = `#bBlocksSlider-${clientId} .bBlocksSlider`;
	const currentSlide = index => `${contentSlider} .slide-${index}`;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
				${titleTypo?.googleFontLink ? `@import url(${titleTypo?.googleFontLink})` : ''}
				${descTypo?.googleFontLink ? `@import url(${descTypo?.googleFontLink})` : ''}
				${btnTypo?.googleFontLink ? `@import url(${btnTypo?.googleFontLink})` : ''}

				#bBlocksSlider-${clientId} .bBlocksSliderWrapper{
					text-align: ${sliderAlign};
				}
				${contentSlider}{
					width: ${sliderWidth};
					height: ${sliderHeight};
				}
				
				${contentSlider} .slide .sliderTitle{
					${titleTypo?.styles || 'font-size: 25px;'}
				}
				${contentSlider} .slide .sliderDescription{
					${descTypo?.styles || 'font-size: 15px;'}
				}
				${contentSlider} .slide .sliderBtn{
					${btnTypo?.styles || 'font-size: 16px;'}
					padding: ${btnPadding?.styles || '12px 35px'};
					${btnBorder?.styles || 'border-radius: 3px;'}
				}

				${contentSlider} .swiper-pagination .swiper-pagination-bullet{
					background: ${pageColor};
					width: ${pageWidth};
					height: ${pageHeight};
					${pageBorder?.styles || 'border-radius: 50%;'}
				}
				
				${contentSlider} .swiper-button-prev, ${contentSlider} .swiper-button-next{ color: ${prevNextColor}; }
			`.replace(/\s+/g, ' ')
		}} />
		<style>
			{slides.map((item, index) => {
				const { childPositions = [{ left: 5.8, top: 11 }, { left: 5.8, top: 22 }, { left: 5.8, top: 33 }] } = item;

				const curSlide = currentSlide(index);
				const contentChild = document.querySelector(`${curSlide} .sliderContent`)?.children || [];

				let childElPositionCSS = '';
				for (let i = 0; i < contentChild.length; i++) {
					childPositions[i] = childPositions[i] || { left: 5.8, top: (i + 1) * 11 };

					childElPositionCSS += `${curSlide} .sliderContent > *:nth-child(${i + 1}){ top: ${childPositions[i].top}%; left: ${childPositions[i].left}%; }`;
				}

				return `${curSlide}{
						${item.background?.styles || 'background-color: #00000080;'}
					}
					${curSlide} .sliderTitle{
						color: ${item.titleColor || '#fff'};
					}
					${curSlide} .sliderDescription{
						color: ${item.descColor || '#fff'};
					}
					${curSlide} .sliderBtn{
						${item.btnColors?.styles || 'color: #fff; background: #4527a4;'}
					}
					${curSlide} .sliderBtn:hover{
						${item.btnHovColors?.styles || 'color: #fff; background: #8344c5;'}
					}${childElPositionCSS}`.replace(/\s+/g, ' ');
			})}
		</style>
	</>;
}
export default Style;