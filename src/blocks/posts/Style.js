import { getBackgroundCSS, getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/utils/getCSS';

const Style = ({ attributes, clientId }) => {
	const { layout, columnGap, rowGap, isContentEqualHight, sliderHeight, fImgFitting, contentAlign, contentBG, contentPadding, border, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderPrevNextColor, titleTypo, titleColor, titleMargin, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, excerptAlign, excerptTypo, excerptColor, excerptMargin, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

	const mainSl = `#bBlocksPosts-${clientId}`;
	const postSl = `${mainSl} .bBlocksPost`;
	const sliderPostsSl = `${mainSl} .bBlocksSliderPosts`;
	const postReadMoreSl = `${postSl} .bBlocksPostReadMore`;
	const postTitleSl = `${postSl} .bBlocksPostTitle`;
	const postMetaSl = `${postSl} .bBlocksPostMeta`;

	return <style dangerouslySetInnerHTML={{
		__html: `
			${getTypoCSS('', titleTypo)?.googleFontLink}
			${getTypoCSS('', metaTypo)?.googleFontLink}
			${getTypoCSS('', excerptTypo)?.googleFontLink}
			${getTypoCSS('', readMoreTypo)?.googleFontLink}
			${getTypoCSS(`${postTitleSl}, ${postTitleSl} a`, titleTypo)?.styles}
			${getTypoCSS(`${postMetaSl}, ${postMetaSl} *, ${postSl} .bBlocksPostFImgCats`, metaTypo)?.styles}
			${getTypoCSS(`${postSl} .bBlocksPostExcerpt`, excerptTypo)?.styles}
			${getTypoCSS(`${postReadMoreSl} a`, readMoreTypo)?.styles}

			${postSl}{
				margin-bottom: ${'masonry' === layout ? `${rowGap}px` : '0px'};
				${getBorderCSS(border)}
			}
			${mainSl} .bBlocksPostDefault,
			${mainSl} .bBlocksPostSideImage{
				text-align: ${contentAlign};
				${getBackgroundCSS(contentBG)}
			}

			${postSl} .bBlocksPostText{
				padding: ${getSpaceCSS(contentPadding)};
			}
			${mainSl} .bBlocksPostOverlay .bBlocksPostText{
				${getBackgroundCSS(contentBG)}
				align-items: ${'left' === contentAlign ? 'flex-start' : 'right' === contentAlign ? 'flex-end' : 'center' === contentAlign ? 'center' : ''}
			}

			${postTitleSl}{
				text-align: ${contentAlign};
				color: ${titleColor};
				margin: ${getSpaceCSS(titleMargin)};
			}
			${postTitleSl} a{
				color: ${titleColor};
			}
			${postMetaSl}{
				text-align: ${contentAlign};
				color: ${metaTextColor};
				margin: ${getSpaceCSS(metaMargin)};
			}
			${postMetaSl} a{
				color: ${metaLinkColor};
			}
			${postMetaSl} .dashicons{
				color: ${metaIconColor};
			}
			${postSl} .bBlocksPostFImg{
				background-size: ${fImgFitting};
			}
			${postSl} .bBlocksPostFImgCats a{
				${getColorsCSS(metaColorsOnImage)}
			}
			${postSl} .bBlocksPostExcerpt{
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

			${mainSl} .bBlocksGridPosts{
				grid-gap: ${rowGap}px ${columnGap}px;
				align-items: ${false === isContentEqualHight ? 'start' : 'initial'};
			}
			${mainSl} .bBlocksMasonryPosts{
				gap: ${columnGap}px;
			}
			${sliderPostsSl},
			${sliderPostsSl} .swiper-slide{
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
	}} />;
};
export default Style;

export const FImgStyle = ({ posts, attributes, clientId }) => {
	const { isFImg } = attributes;

	return <style>
		{posts.map(post => {
			const { id, thumbnail } = post;

			const sideImgCSS = `#bBlocksPosts-${clientId} .bBlocksPostSideImage.bBlocksPost-${id}{ display: ${isFImg && thumbnail ? 'grid' : 'flex'}; }`;
			const fImgCSS = isFImg && thumbnail ? `#bBlocksPosts-${clientId} .bBlocksPostOverlay.bBlocksPost-${id}, #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImg-${id}{ background-image: url(${thumbnail}); }` : '';

			return sideImgCSS + fImgCSS;
		})}
	</style>
}