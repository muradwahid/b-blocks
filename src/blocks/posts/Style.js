import { getBackgroundCSS, getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../Components/Helper/getCSS';

import { mediaUrl } from '../../utils/functions';

const GeneralStyle = ({ attributes, clientId }) => {
	const { layout, columnGap, rowGap, isContentEqualHight, sliderHeight, contentAlign, contentBG, contentPadding, border, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderPrevNextColor, isTitleLink, titleTypo, titleColor, titleMargin, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, excerptAlign, excerptTypo, excerptColor, excerptMargin, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

	return <style dangerouslySetInnerHTML={{
		__html: `
			${getTypoCSS(titleTypo)?.googleFontLink ? `@import url(${getTypoCSS(titleTypo)?.googleFontLink});` : ''}
			${getTypoCSS(metaTypo)?.googleFontLink ? `@import url(${getTypoCSS(metaTypo)?.googleFontLink});` : ''}
			${getTypoCSS(excerptTypo)?.googleFontLink ? `@import url(${getTypoCSS(excerptTypo)?.googleFontLink});` : ''}
			${getTypoCSS(readMoreTypo)?.googleFontLink ? `@import url(${getTypoCSS(readMoreTypo)?.googleFontLink});` : ''}

			#bBlocksPosts-${clientId} .bBlocksPost{
				margin-bottom: ${'masonry' === layout ? `${rowGap}px` : '0px'};
				${getBorderCSS(border) || 'border: 1px solid #4527a400; border-radius: 5px;'}
			}
			#bBlocksPosts-${clientId} .bBlocksPostDefault,
			#bBlocksPosts-${clientId} .bBlocksPostSideImage{
				text-align: ${contentAlign};
				${getBackgroundCSS(contentBG) || 'background-color: #f4f2fc;'}
			}

			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostText{
				padding: ${getSpaceCSS(contentPadding) || '20px 25px'};
			}
			#bBlocksPosts-${clientId} .bBlocksPostOverlay .bBlocksPostText{
				${getBackgroundCSS(contentBG) || 'background-color: #f4f2fc;'}
				align-items: ${'left' === contentAlign ? 'flex-start' : 'right' === contentAlign ? 'flex-end' : 'center' === contentAlign ? 'center' : ''}
			}

			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostTitle{
				text-align: ${contentAlign};
				${!isTitleLink ? getTypoCSS(titleTypo)?.styles || 'font-family: Roboto, sans-serif; font-size: 25px;' : ''}
				color: ${titleColor};
				margin: ${getSpaceCSS(titleMargin) || '0 0 15px 0'};
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostTitle a{
				${getTypoCSS(titleTypo)?.styles || 'font-family: Roboto, sans-serif; font-size: 25px;'}
				color: ${titleColor};
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta{
				text-align: ${contentAlign};
				${getTypoCSS(metaTypo)?.styles || 'font-size: 13px; text-transform: uppercase;'}
				color: ${metaTextColor};
				margin: ${getSpaceCSS(metaMargin) || '0 0 15px 0'};
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta a{
				color: ${metaLinkColor};
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta .dashicons{
				color: ${metaIconColor};
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImgCats{
				${getTypoCSS(metaTypo)?.styles || 'font-size: 13px; text-transform: uppercase;'}
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImgCats a{
				${getColorsCSS(metaColorsOnImage) || 'color: #fff; background: #4527a4;'}
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostExcerpt{
				text-align: ${excerptAlign};
				${getTypoCSS(excerptTypo)?.styles || 'font-size: 15px;'}
				color: ${excerptColor};
				margin: ${getSpaceCSS(excerptMargin) || '0 0 10px 0'};
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore{
				text-align: ${readMoreAlign};
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore a{
				${getTypoCSS(readMoreTypo)?.styles || 'font-size: 14px; text-transform: uppercase; font-weight: 600;'}
				${getColorsCSS(readMoreColors) || 'color: #fff; background: #8344c5;'}
				padding: ${getSpaceCSS(readMorePadding) || '12px 35px'};
				${getBorderCSS(readMoreBorder) || 'border-radius: 3px;'}
			}
			#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore a:hover{
				${getColorsCSS(readMoreHovColors) || 'color: #fff; background: #4527a4;'}
			}

			#bBlocksPosts-${clientId} .bBlocksGridPosts{
				grid-gap: ${rowGap}px ${columnGap}px;
				align-items: ${false === isContentEqualHight ? 'start' : 'initial'};
			}
			#bBlocksPosts-${clientId} .bBlocksMasonryPosts{
				gap: ${columnGap}px;
			}
			#bBlocksPosts-${clientId} .bBlocksSliderPosts,
			#bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-slide{
				min-height: ${sliderHeight};
			}
			#bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-pagination .swiper-pagination-bullet{
				background: ${sliderPageColor};
				width: ${sliderPageWidth};
				height: ${sliderPageHeight};
				${getBorderCSS(sliderPageBorder) || 'border-radius: 50%;'}
			}
			#bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-button-prev,
			#bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-button-next{
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