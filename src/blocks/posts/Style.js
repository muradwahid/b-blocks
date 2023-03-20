import { getBackgroundCSS, getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

import { mediaUrl } from '../../utils/functions';

const GeneralStyle = ({ attributes, clientId }) => {
	const { layout, columnGap, rowGap, isContentEqualHight, sliderHeight, contentAlign, contentBG, contentPadding, border, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderPrevNextColor, titleTypo, titleColor, titleMargin, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, excerptAlign, excerptTypo, excerptColor, excerptMargin, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

	const mainSl = `#bBlocksPosts-${clientId}`;
	const postSl = `${mainSl} .bBlocksPost`;
	const sliderPostsSl = `${mainSl} .bBlocksSliderPosts`;
	const postReadMoreSl = `${postSl} .bBlocksPostReadMore`;
	const postTitleSl = `${postSl} .bBlocksPostTitle`;
	const postMetaSl = `${postSl} .bBlocksPostMeta`;

	return <style dangerouslySetInnerHTML={{
		__html: `
			${getTypoCSS(`${postTitleSl}, ${postTitleSl} a`, titleTypo)}
			${getTypoCSS(`${postMetaSl}, ${postMetaSl} *, ${postSl} .bBlocksPostFImgCats`, metaTypo)}
			${getTypoCSS(`${postSl} .bBlocksPostExcerpt`, excerptTypo)}
			${getTypoCSS(`${postReadMoreSl} a`, readMoreTypo)}

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
		`}} />;
};

const FImgStyle = ({ posts, attributes, clientId }) => {
	const { isFImg } = attributes;

	return <style>
		{posts.map(post => {
			const { id, featured_media } = post;
			const fImgUrl = mediaUrl(featured_media)?.replace(/<[^>]+>/g, '');

			const sideImgCSS = `#bBlocksPosts-${clientId} .bBlocksPostSideImage.bBlocksPost-${id}{ display: ${isFImg && fImgUrl ? 'grid' : 'flex'}; }`;
			const fImgCSS = isFImg && fImgUrl ? `#bBlocksPosts-${clientId} .bBlocksPostOverlay.bBlocksPost-${id}, #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImg-${id}{ background-image: url(${fImgUrl}); }` : '';

			return sideImgCSS + fImgCSS;
		})}
	</style>;
};
export { GeneralStyle, FImgStyle }