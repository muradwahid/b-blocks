import func from '../../Const/functions';
const { mediaUrl } = func;

const Styles = ({ posts, attributes, clientId }) => {
    const { layout, columnGap, rowGap, isContentEqualHight, sliderHeight, contentAlign, contentBG, contentPadding, border, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderPrevNextColor, isFImg, isTitleLink, titleTypo, titleColor, titleMargin, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, excerptAlign, excerptTypo, excerptColor, excerptMargin, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

    return <>
        <style dangerouslySetInnerHTML={{
            __html: `
				@import url(${titleTypo?.googleFontLink || 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'});
				${metaTypo?.googleFontLink ? `@import url(${metaTypo?.googleFontLink})` : ''}
				${excerptTypo?.googleFontLink ? `@import url(${excerptTypo?.googleFontLink})` : ''}
				${readMoreTypo?.googleFontLink ? `@import url(${readMoreTypo?.googleFontLink})` : ''}

				#bBlocksPosts-${clientId} .bBlocksPost{
					margin-bottom: ${'masonry' === layout ? `${rowGap}px` : '0px'};
					${border?.styles || 'border: 1px solid #4527a400; border-radius: 5px;'}
				}
				#bBlocksPosts-${clientId} .bBlocksPostDefault, #bBlocksPosts-${clientId} .bBlocksPostSideImage{
					text-align: ${contentAlign};
					${contentBG?.styles || 'background-color: #f4f2fc;'}
				}

				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostText{ padding: ${contentPadding?.styles || '20px 25px'}; }
				#bBlocksPosts-${clientId} .bBlocksPostOverlay .bBlocksPostText{
					${contentBG?.styles || 'background-color: #f4f2fc;'}
					align-items: ${'left' === contentAlign ? 'flex-start' : 'right' === contentAlign ? 'flex-end' : 'center' === contentAlign ? 'center' : ''}
				}

				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostTitle{
					text-align: ${contentAlign};
					${!isTitleLink ? titleTypo?.styles || 'font-family: Roboto, sans-serif; font-size: 25px;' : ''}
					color: ${titleColor};
					margin: ${titleMargin?.styles || '0 0 15px 0'};
				}
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostTitle a{
					${titleTypo?.styles || 'font-family: Roboto, sans-serif; font-size: 25px;'}
					color: ${titleColor};
				}
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta{
					text-align: ${contentAlign};
					${metaTypo?.styles || 'font-size: 13px; text-transform: uppercase;'}
					color: ${metaTextColor};
					margin: ${metaMargin?.styles || '0 0 15px 0'};
				}
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta a{ color: ${metaLinkColor}; }
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostMeta .dashicons{ color: ${metaIconColor}; }
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImgCats{ ${metaTypo?.styles || 'font-size: 13px; text-transform: uppercase;'} }
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImgCats a{ ${metaColorsOnImage?.styles || 'color: #fff; background: #4527a4;'} }
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostExcerpt{
					text-align: ${excerptAlign};
					${excerptTypo?.styles || 'font-size: 15px;'}
					color: ${excerptColor};
					margin: ${excerptMargin?.styles || '0 0 10px 0'};
				}
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore{ text-align: ${readMoreAlign}; }
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore a{
					${readMoreTypo?.styles || 'font-size: 14px; text-transform: uppercase; font-weight: 600;'}
					${readMoreColors?.styles || 'color: #fff; background: #8344c5;'}
					padding: ${readMorePadding?.styles || '12px 35px'};
					${readMoreBorder?.styles || 'border-radius: 3px;'}
				}
				#bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostReadMore a:hover{ ${readMoreHovColors?.styles || 'color: #fff; background: #4527a4;'} }

				#bBlocksPosts-${clientId} .bBlocksGridPosts{
					grid-gap: ${rowGap}px ${columnGap}px;
					align-items: ${false === isContentEqualHight ? 'start' : 'initial'};
				}
				#bBlocksPosts-${clientId} .bBlocksMasonryPosts{ gap: ${columnGap}px; }
				#bBlocksPosts-${clientId} .bBlocksSliderPosts, #bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-slide{ min-height: ${sliderHeight}; }
				#bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-pagination .swiper-pagination-bullet{
					background: ${sliderPageColor};
					width: ${sliderPageWidth};
					height: ${sliderPageHeight};
					${sliderPageBorder?.styles || 'border-radius: 50%;'}
				}
				#bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-button-prev, #bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-button-next{ color: ${sliderPrevNextColor}; }
			`}} />
        <style>
            {posts.map(post => {
                const { id, featured_media } = post;
                const fImgUrl = mediaUrl(featured_media);

                const sideImgCSS = `#bBlocksPosts-${clientId} .bBlocksPostSideImage.bBlocksPost-${id}{ display: ${fImgUrl ? 'grid' : 'flex'}; }`;
                const fImgCSS = isFImg && fImgUrl ? `#bBlocksPosts-${clientId} .bBlocksPostOverlay.bBlocksPost-${id}, #bBlocksPosts-${clientId} .bBlocksPost .bBlocksPostFImg-${id}{ background-image: url(${fImgUrl}); }` : '';

                return sideImgCSS + fImgCSS;
            })}
        </style>
    </>;
};
export default Styles;