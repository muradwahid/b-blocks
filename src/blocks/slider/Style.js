import { getBackgroundCSS, getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

const Style = ({ attributes, clientId }) => {
	const { slides = [], sliderWidth, sliderHeight, pageColor, pageWidth, pageHeight, pageBorder, prevNextColor, sliderAlign, titleTypo, descTypo, btnTypo, btnPadding, btnBorder } = attributes;

	const sliderSl = `#bBlocksSlider-${clientId} .bBlocksSlider`;
	const gSlideSl = `${sliderSl} .slide`;

	return <>
		<style dangerouslySetInnerHTML={{
			__html: `
				${getTypoCSS('', titleTypo)?.googleFontLink}
				${getTypoCSS('', descTypo)?.googleFontLink}
				${getTypoCSS('', btnTypo)?.googleFontLink}
				${getTypoCSS(`${gSlideSl} .sliderTitle`, titleTypo)?.styles}
				${getTypoCSS(`${gSlideSl} .sliderDescription`, descTypo)?.styles}
				${getTypoCSS(`${gSlideSl} .sliderBtn`, btnTypo)?.styles}

				#bBlocksSlider-${clientId} .bBlocksSliderWrapper{
					text-align: ${sliderAlign};
				}
				${sliderSl}{
					width: ${sliderWidth};
					height: ${sliderHeight};
				}

				${gSlideSl} .sliderBtn{
					padding: ${getSpaceCSS(btnPadding)};
					${getBorderCSS(btnBorder)}
				}

				${sliderSl} .swiper-pagination .swiper-pagination-bullet{
					background: ${pageColor};
					width: ${pageWidth};
					height: ${pageHeight};
					${getBorderCSS(pageBorder)}
				}
				
				${sliderSl} .swiper-button-prev, ${sliderSl} .swiper-button-next{
					color: ${prevNextColor};
				}
			`.replace(/\s+/g, ' ')
		}} />

		<style>
			{slides.map((item, index) => {
				const { childPositions = [{ left: 5.8, top: 11 }, { left: 5.8, top: 22 }, { left: 5.8, top: 33 }] } = item;

				const slideSl = `${sliderSl} .slide-${index}`;
				const contentChild = document.querySelector(`${slideSl} .sliderContent`)?.children || [];

				let childElPositionCSS = '';
				for (let i = 0; i < contentChild.length; i++) {
					childPositions[i] = childPositions[i] || { left: 5.8, top: (i + 1) * 11 };

					childElPositionCSS += `${slideSl} .sliderContent > *:nth-child(${i + 1}){
						top: ${childPositions[i].top}%; left: ${childPositions[i].left}%;\
					}`;
				}

				return `${slideSl}{
						${getBackgroundCSS(item.background) || 'background-color: #00000080;'}
					}
					${slideSl} .sliderTitle{
						color: ${item.titleColor || '#fff'};
					}
					${slideSl} .sliderDescription{
						color: ${item.descColor || '#fff'};
					}
					${slideSl} .sliderBtn{
						${getColorsCSS(item.btnColors) || 'color: #fff; background: #4527a4;'}
					}
					${slideSl} .sliderBtn:hover{
						${getColorsCSS(item.btnHovColors) || 'color: #fff; background: #8344c5;'}
					}
					${childElPositionCSS}
				`.replace(/\s+/g, ' ');
			})}
		</style>
	</>;
}
export default Style;