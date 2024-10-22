import { getBackgroundCSS, getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';
import { prefix } from '../../utils/data';

const Style = ({ attributes, id }) => {
	const { columnGap, rowGap, isContentEqualHight, sliderHeight, paginationColors, paginationHovColors, paginationPadding, paginationSpacing, fImgFitting = 'cover', contentAlign, contentBG, contentPadding, border, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderPrevNextColor, titleTypo, titleColor, titleMargin, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, excerptAlign, excerptTypo, excerptColor, excerptMargin, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

	const mainSl = `#${id}`;
	const articleSl = `${mainSl} .${prefix}Article`;
	const sliderPostsSl = `${mainSl} .${prefix}LayoutSlider`;
	const postReadMoreSl = `${articleSl} .${prefix}ElReadMore`;
	const postTitleSl = `${articleSl} .${prefix}ElTitle`;
	const postMetaSl = `${articleSl} .${prefix}ElMeta`;
	const paginationSl = `${mainSl} .${prefix}Pagination`;

	return <style dangerouslySetInnerHTML={{
		__html: `
		${getTypoCSS('', titleTypo)?.googleFontLink}
		${getTypoCSS('', metaTypo)?.googleFontLink}
		${getTypoCSS('', excerptTypo)?.googleFontLink}
		${getTypoCSS('', readMoreTypo)?.googleFontLink}
		${getTypoCSS(`${postTitleSl}, ${postTitleSl} a`, titleTypo)?.styles}
		${getTypoCSS(`${postMetaSl}, ${postMetaSl} *, ${articleSl} .${prefix}ElThumbCats`, metaTypo)?.styles}
		${getTypoCSS(`${articleSl} .${prefix}ElExcerpt`, excerptTypo)?.styles}
		${getTypoCSS(`${postReadMoreSl} a`, readMoreTypo)?.styles}

		${paginationSl} .${prefix}PagePrev,
		${paginationSl} .${prefix}PageNumber,
		${paginationSl} .${prefix}PageNext{
			font-size: 15px;
			${getColorsCSS(paginationColors)}
			padding: ${getSpaceCSS(paginationPadding)};
			margin: 0 calc( ${paginationSpacing} / 2 );
		}
		@media (max-width: 576px) {
			${paginationSl} .${prefix}PagePrev,
			${paginationSl} .${prefix}PageNumber,
			${paginationSl} .${prefix}PageNext{
				font-size: 12px;
				padding: ${getSpaceCSS(paginationPadding)?.split(' ').map(v => `calc( ${v} / 2 )`).join(' ')};
				margin: 0 calc( ${paginationSpacing} / 4 );
			}
		}
		${paginationSl} .${prefix}PagePrev:hover,
		${paginationSl} .${prefix}PageNumber:hover,
		${paginationSl} .${prefix}PageNext:hover,
		${paginationSl} .${prefix}PageActive{
			${getColorsCSS(paginationHovColors)}
		}

		${articleSl}{
			${getBorderCSS(border)}
		}
		${mainSl} .${prefix}SLDefault,
		${mainSl} .${prefix}SLSideImage{
			text-align: ${contentAlign};
			${getBackgroundCSS(contentBG)}
		}

		${articleSl} .${prefix}ElTexts{
			padding: ${getSpaceCSS(contentPadding)};
		}
		${mainSl} .${prefix}SLOverlay .${prefix}ElTexts{
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
		${articleSl} .${prefix}ElThumb img, ${articleSl}.${prefix}SLOverlay img{
			object-fit: ${fImgFitting};
		}
		${articleSl} .${prefix}ElThumbCats a{
			${getColorsCSS(metaColorsOnImage)}
		}
		${articleSl} .${prefix}ElExcerpt{
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

		${mainSl} .${prefix}LayoutGrid,
		${mainSl} .${prefix}LayoutGrid1{
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