import { getBackgroundCSS, getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../../../Components/utils/getCSS';

const Style = ({ attributes, id }) => {
	const { columnGap, rowGap, isContentEqualHight, sliderHeight, paginationColors, paginationHovColors, paginationPadding, paginationSpacing, fImgFitting = 'cover', contentAlign, contentBG, contentPadding, border, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderPrevNextColor, titleTypo, titleColor, titleMargin, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, excerptAlign, excerptTypo, excerptColor, excerptMargin, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

	const mainSl = `#${id}`;
	const postSl = `${mainSl} .bBlocksPost`;
	const sliderPostsSl = `${mainSl} .bBlocksSliderPosts`;
	const postReadMoreSl = `${postSl} .bBlocksReadMore`;
	const postTitleSl = `${postSl} .bBlocksTitle`;
	const postMetaSl = `${postSl} .bBlocksMeta`;
	const paginationSl = `${mainSl} .bBlocksPagination`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', metaTypo)?.googleFontLink}
		${getTypoCSS('', excerptTypo)?.googleFontLink}
		${getTypoCSS('', readMoreTypo)?.googleFontLink}
		${getTypoCSS(`${postTitleSl}, ${postTitleSl} a`, titleTypo)?.styles}
		${getTypoCSS(`${postMetaSl}, ${postMetaSl} *, ${postSl} .bBlocksThumbCats`, metaTypo)?.styles}
		${getTypoCSS(`${postSl} .bBlocksExcerpt`, excerptTypo)?.styles}
		${getTypoCSS(`${postReadMoreSl} a`, readMoreTypo)?.styles}

		${paginationSl} .bBlocksPagePrev,
		${paginationSl} .bBlocksPageNumber,
		${paginationSl} .bBlocksPageNext{
			font-size: 15px;
			${getColorsCSS(paginationColors)}
			padding: ${getSpaceCSS(paginationPadding)};
			margin: 0 calc( ${paginationSpacing} / 2 );
		}
		@media (max-width: 576px) {
			${paginationSl} .bBlocksPagePrev,
			${paginationSl} .bBlocksPageNumber,
			${paginationSl} .bBlocksPageNext{
				font-size: 12px;
				padding: ${getSpaceCSS(paginationPadding)?.split(' ').map(v => `calc( ${v} / 2 )`).join(' ')};
				margin: 0 calc( ${paginationSpacing} / 4 );
			}
		}
		${paginationSl} .bBlocksPagePrev:hover,
		${paginationSl} .bBlocksPageNumber:hover,
		${paginationSl} .bBlocksPageNext:hover,
		${paginationSl} .bBlocksActivePage{
			${getColorsCSS(paginationHovColors)}
		}

		${postSl}{
			${getBorderCSS(border)}
		}
		${mainSl} .bBlocksDefault,
		${mainSl} .bBlocksSideImage{
			text-align: ${contentAlign};
			${getBackgroundCSS(contentBG)}
		}

		${postSl} .bBlocksText{
			padding: ${getSpaceCSS(contentPadding)};
		}
		${mainSl} .bBlocksOverlay .bBlocksText{
			${getBackgroundCSS(contentBG)}
			align-items: ${'left' === contentAlign ? 'flex-start' : 'right' === contentAlign ? 'flex-end' : 'center' === contentAlign ? 'center' : ''}
		}

		${postTitleSl}, ${postTitleSl} a{
			text-align: ${contentAlign};
			color: ${titleColor};
		}
		${postTitleSl}{
			margin: ${getSpaceCSS(titleMargin)};
		}
		${postMetaSl}{
			justify-content: ${'left' === contentAlign ? 'flex-start' : 'right' === contentAlign ? 'flex-end' : 'center'};
			color: ${metaTextColor};
			margin: ${getSpaceCSS(metaMargin)};
		}
		${postMetaSl} a{
			color: ${metaLinkColor};
		}
		${postMetaSl} .dashicons{
			color: ${metaIconColor};
		}
		${postSl} .bBlocksThumb img, ${postSl}.bBlocksOverlay img{
			object-fit: ${fImgFitting};
		}
		${postSl} .bBlocksThumbCats a{
			${getColorsCSS(metaColorsOnImage)}
		}
		${postSl} .bBlocksExcerpt{
			text-align: ${excerptAlign};
			color: ${excerptColor};
			margin: ${getSpaceCSS(excerptMargin)};
		}
		${postReadMoreSl}{
			text-align: ${readMoreAlign};
		}
		${postReadMoreSl} a{
			${getColorsCSS(readMoreColors)}
			padding: ${getSpaceCSS(readMorePadding)};
			${getBorderCSS(readMoreBorder)}
		}
		${postReadMoreSl} a:hover{
			${getColorsCSS(readMoreHovColors)}
		}

		${mainSl} .bBlocksGridPosts,
		${mainSl} .bBlocksGrid1Posts{
			grid-gap: ${rowGap}px ${columnGap}px;
			align-items: ${false === isContentEqualHight ? 'start' : 'initial'};
		}

		${sliderPostsSl},
		${sliderPostsSl} .swiper-slide article{
			min-height: ${sliderHeight};
		}
		${sliderPostsSl} .swiper-pagination .swiper-pagination-bullet{
			background: ${sliderPageColor};
			width: ${sliderPageWidth};
			height: ${sliderPageHeight};
			${getBorderCSS(sliderPageBorder)}
		}
		${sliderPostsSl} .swiper-button-prev,
		${sliderPostsSl} .swiper-button-next{
			color: ${sliderPrevNextColor};
		}
	`.replace(/\s+/g, ' ')
	}} />
}
export default Style;