import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { useEffect, useRef, useState, createContext } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

const $ = jQuery;

import Settings from './settings';

// Components
import Default from './Layout/Default';
import SideImage from './Layout/SideImage';
import Overlay from './Layout/Overlay';
import func from '../../Const/functions';
const { mediaUrl } = func;

export const ExcerptLengthCtx = createContext();

const Edit = props => {
	const { attributes, setAttributes, className, clientId, getPostTypes, posts, categories, isEditorSidebarOpened } = props;

	const { align, layout, columns, columnGap, rowGap, isContentEqualHight, sliderHeight, contentAlign, contentBG, contentPadding, border, sliderIsLoop, sliderIsTouchMove, sliderIsAutoplay, sliderSpeed, sliderEffect, sliderIsPage, sliderIsPageClickable, sliderIsPageDynamic, sliderPageColor, sliderPageWidth, sliderPageHeight, sliderPageBorder, sliderIsPrevNext, sliderPrevNextColor, isFImg, isTitleLink, titleTypo, titleColor, titleMargin, metaTypo, metaTextColor, metaLinkColor, metaIconColor, metaColorsOnImage, metaMargin, excerptAlign, excerptTypo, excerptColor, excerptMargin, readMoreAlign, readMoreTypo, readMoreColors, readMoreHovColors, readMorePadding, readMoreBorder } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

	const sliderRef = useRef(null);
	const sliderWrapperRef = useRef(null);
	const tickerRef = useRef(null);
	const tickerWrapperRef = useRef(null);

	// Components
	const Loading = () => <h3 className='apbLoading'><Spinner /> {__('Loading...', 'b-blocks')}</h3>;
	const NoPosts = () => <h3 className='bBlocksNoPosts'>{__('No posts found!! Please add some posts', 'b-blocks')}</h3>;

	const currentBlock = document.querySelector(`#block-${clientId} .wp-block`);
	useEffect(() => {
		if ('slider' === layout && sliderWrapperRef.current) {
			const currentSlider = document.querySelector(`#bBlocksPosts-${clientId} .bBlocksSliderWrapper .bBlocksSliderPosts`);

			const currentAll = currentSlider && currentBlock;

			currentAll ? currentBlock.style.display = 'block' : 'initial';
			align === 'full' && currentAll ? currentBlock.style.maxWidth = 'none' : '';
			align === 'wide' && currentAll ? currentBlock.style.maxWidth = 'none' : '';
			align === 'center' && currentAll ? currentBlock.style.maxWidth = '' : '';

			currentAll && isEditorSidebarOpened ? currentBlock.style.display = 'grid' : '';

			currentAll ? currentSlider.style.width = `${currentBlock.clientWidth}px` : '';

			// Re init slider
			sliderWrapperRef.current.innerHTML = '';
			sliderWrapperRef.current.innerHTML = sliderRef.current.outerHTML;

			new Swiper(`#bBlocksPosts-${clientId} .bBlocksSliderWrapper .bBlocksSliderPosts`, {
				// Optional parameters
				direction: 'horizontal',
				slidesPerView: columns?.mobile,
				breakpoints: {
					// when window width is >= 576px
					576: { slidesPerView: columns?.tablet },
					// when window width is >= 768px
					768: { slidesPerView: columns?.desktop },
				},
				spaceBetween: columnGap,
				loop: sliderIsLoop,
				allowTouchMove: sliderIsTouchMove,
				grabCursor: sliderIsTouchMove,
				autoplay: sliderIsAutoplay ? { delay: sliderSpeed * 1000 } : false,
				speed: sliderSpeed * 1000,
				effect: sliderEffect,
				fadeEffect: { crossFade: true },
				creativeEffect: {
					prev: {
						shadow: true,
						translate: ['-120%', 0, -500],
					},
					next: {
						shadow: true,
						translate: ['120%', 0, -500],
					}
				},
				allowSlideNext: true,
				allowSlidePrev: true,
				notificationClass: null,

				// Controllers
				pagination: {
					el: '.swiper-pagination',
					clickable: sliderIsPageClickable,
					dynamicBullets: sliderIsPageDynamic
				},
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				}
			});
		}

		let seen = {};
		$(`#bBlocksPosts-${clientId} .swiper-notification`).each(function () {
			let txt = $(this).attr('class');
			if (seen[txt])
				$(this).remove();
			else
				seen[txt] = true;
		});

		// Slider Height
		const slideHeightArray = [];
		const swiperSlide = document.querySelectorAll(`#bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-slide`);
		const swiperSlideText = document.querySelectorAll(`#bBlocksPosts-${clientId} .bBlocksSliderPosts .swiper-slide .bBlocksPostText`);
		swiperSlideText?.length && swiperSlideText.forEach(slideText => {
			slideHeightArray.push(slideText?.clientHeight);
		});
		swiperSlide?.length && swiperSlide.forEach(slide => {
			slide.style.height = `${Math.max(...slideHeightArray)}px`;
		});

		// Ticker Posts
		if ('ticker' === layout && tickerWrapperRef.current) {
			// Re init ticker
			tickerWrapperRef.current.innerHTML = '';
			tickerWrapperRef.current.innerHTML = tickerRef.current.outerHTML;

			$(`#bBlocksPosts-${clientId} .bBlocksTickerWrapper .bBlocksTickerPosts`).easyTicker({
				direction: 'up',
				easing: 'swing',
				speed: 'slow',
				interval: 2000,
				height: 'auto',
				visible: 3,
				gap: rowGap,
				mousePause: true
			});
		}
	}, [attributes, posts]);

	// Set excerpt length
	const [maxExcerptLength, setMaxExcerptLength] = useState(50);
	useEffect(() => {
		const allMaxExcerptLength = [];
		posts?.length && posts.map(post => {
			allMaxExcerptLength.push(post.excerpt.rendered.replace(/(<p class='?"?read-more'?"?(.*?)<\/p>)/g, '').trim().split(' ').length);

			setMaxExcerptLength(Math.max(...allMaxExcerptLength));
		});
	}, [posts]);

	return <>
		<ExcerptLengthCtx.Provider value={maxExcerptLength}>
			<Settings settings={props} getPostTypes={getPostTypes} categories={categories} />
		</ExcerptLengthCtx.Provider>

		{!posts ? <Loading /> : posts?.length ? <div className={`${className} bBlocksPosts`} id={`bBlocksPosts-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				@import url(${titleTypo?.googleFontLink || 'https://fonts.googleapis.com/css2?family=Roboto&display=swap'}); @import url(${metaTypo?.googleFontLink}); @import url(${excerptTypo?.googleFontLink}); @import url(${readMoreTypo?.googleFontLink});

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

			{'grid' === layout ? <div className={`bBlocksGridPosts columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				<MapPosts attributes={{ clientId, ...attributes }} posts={posts} />
			</div> /* Grid Layout */ :

				'masonry' === layout ? <div className={`bBlocksMasonryPosts cols-${columns.desktop} cols-tablet-${columns.tablet} cols-mobile-${columns.mobile}`}>
					<MapPosts attributes={{ clientId, ...attributes }} posts={posts} />
				</div> /* Masonry Layout */ :

					'slider' === layout ? <>
						<div className='bBlocksSliderWrapper' ref={sliderWrapperRef}></div>
						<div className='bBlocksSliderPosts' ref={sliderRef}>
							<div className='swiper-wrapper'>
								<MapPosts attributes={{ clientId, ...attributes }} posts={posts} />
							</div>

							{sliderIsPage && <div className='swiper-pagination'></div>}

							{sliderIsPrevNext && <>
								<div className='swiper-button-prev'></div><div className='swiper-button-next'></div>
							</>}
						</div>
					</>/* Slider Layout */ :
						'ticker' === layout && <>
							<div className='bBlocksTickerWrapper' ref={tickerWrapperRef}></div>
							<div className='bBlocksTickerPosts' ref={tickerRef}>
								<div>
									<MapPosts attributes={{ clientId, ...attributes }} posts={posts} />
								</div>
							</div>
						</>/* Ticker Layout */
			}
		</div> : <NoPosts />}
	</>
}
export default withSelect((select, props) => {
	const { postType, selectedCategories, isPostsPerPageAll, postsPerPage, postsOrderBy, postsOrder } = props.attributes;

	const catsFilter = 'post' === postType ? { categories: selectedCategories } : {};

	const query = {
		...catsFilter,
		per_page: isPostsPerPageAll ? -1 : postsPerPage, // -1 to display all
		orderby: postsOrderBy,
		order: postsOrder,
	}

	return {
		getPostTypes: select('core').getPostTypes({ per_page: -1 })?.filter(p => 'page' !== p.slug && 'attachment' !== p.slug && 'wp_block' !== p.slug && 'wp_template' !== p.slug && 'wp_navigation' !== p.slug && 'wp_template_part' !== p.slug && 'nav_menu_item' !== p.slug)?.map(p => {
			return { label: p.name, value: p.slug }
		}),
		posts: select('core').getEntityRecords('postType', postType, query),
		categories: select('core').getEntityRecords('taxonomy', 'category', { per_page: -1 }),
		media: id => select('core').getMedia(id),
		authors: select('core').getAuthors(),
		isEditorSidebarOpened: select('core/edit-post').isEditorSidebarOpened()
	};
})(Edit);


const MapPosts = ({ attributes, posts }) => {
	const { subLayout } = attributes;

	return posts.map(post => (
		'default' === subLayout || 'title-meta' === subLayout ? <Default atts={attributes} post={post} /> :
			'left-image' === subLayout || 'right-image' === subLayout ? <SideImage atts={attributes} post={post} /> :
				'overlay-content' === subLayout || 'overlay-content-hover' === subLayout || 'overlay-box' === subLayout ? <Overlay atts={attributes} post={post} /> :
					<p>{__('Please, select a sub layout', 'b-blocks')}</p>
	));
}