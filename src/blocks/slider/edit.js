import { withSelect } from '@wordpress/data';
import { useEffect, useState, createContext, useRef } from '@wordpress/element';

import Settings from './settings';

const $ = jQuery;

export const IndexContext = createContext();

const Edit = props => {
	const { className, attributes: { align, slides = [], columns, columnGap, sliderWidth, sliderHeight, isLoop, isAutoplay, speed, effect, isTouchMove, isPage, isPageClickable, isPageDynamic, pageColor, pageWidth, pageHeight, pageBorder, isPrevNext, prevNextColor, sliderAlign, isTitle, titleTypo, isDesc, descTypo, isBtn, btnTypo, btnPadding, btnBorder }, setAttributes, clientId, isEditorSidebarOpened } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);
	const sliderRef = useRef(null);
	const sliderWrapperRef = useRef(null);

	// Swiper Scripts
	const currentBlock = document.querySelector(`#block-${clientId} .wp-block`);
	useEffect(() => {
		const currentSlider = document.querySelector(`#bBlocksSlider-${clientId} .bBlocksSliderWrapper .bBlocksSlider`);

		const currentAll = currentSlider && currentBlock;

		currentAll ? currentBlock.style.display = 'block' : 'initial';
		align === 'full' && currentAll ? currentBlock.style.maxWidth = 'none' : '';
		align === 'wide' && currentAll ? currentBlock.style.maxWidth = 'none' : '';
		align === '' && currentAll ? currentBlock.style.maxWidth = '' : '';

		currentAll && isEditorSidebarOpened ? currentBlock.style.display = 'grid' : '';

		currentAll ? currentSlider.style.width = `${currentBlock.clientWidth}px` : '';

		// Re init slider
		sliderWrapperRef.current.innerHTML = '';
		sliderWrapperRef.current.innerHTML = sliderRef.current.outerHTML;

		new Swiper(`#bBlocksSlider-${clientId} .bBlocksSliderWrapper .bBlocksSlider`, {
			// Optional parameters
			direction: 'horizontal',
			initialSlide: activeIndex,
			slidesPerView: columns?.mobile,
			breakpoints: {
				// when window width is >= 576px
				576: { slidesPerView: columns?.tablet },
				// when window width is >= 768px
				768: { slidesPerView: columns?.desktop },
			},
			spaceBetween: columnGap,
			loop: isLoop,
			allowTouchMove: isTouchMove,
			grabCursor: isTouchMove,
			autoplay: false,
			// autoplay: isAutoplay ? { delay: speed * 1000 } : false,
			speed: speed * 1000,
			effect,
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
			autoHeight: false,
			notificationClass: null,

			// Controllers
			pagination: {
				el: '.swiper-pagination',
				clickable: isPageClickable,
				dynamicBullets: isPageDynamic
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			}
		});

		let seen = {};
		$(`#bBlocksSlider-${clientId} .swiper-notification`).each(function () {
			let txt = $(this).attr('class');
			if (seen[txt])
				$(this).remove();
			else
				seen[txt] = true;
		});
	}, [align, slides, columns, columnGap, isEditorSidebarOpened, currentBlock, isLoop, isTouchMove, isAutoplay, speed, effect, isPage, isPageClickable, isPageDynamic, isPrevNext, isTitle, isDesc, isBtn]);

	// Attributes change
	const updateSlide = (index, type, val, otherIndex = false, otherType = false) => {
		const newSlides = [...slides];

		if (false !== otherIndex && otherType) {
			newSlides[index]['childPositions'] = newSlides[index]['childPositions'] || [{ left: 5.8, top: 11 }, { left: 5.8, top: 22 }, { left: 5.8, top: 33 }];

			newSlides[index][type][otherIndex][otherType] = val;
			setAttributes({ slides: newSlides });
		} else {
			newSlides[index][type] = val;
			setAttributes({ slides: newSlides });
		}
		setActiveIndex(index);
	}

	$(document).ready(function () {
		const calcPercentage = (child, parent) => 100 * parseFloat(child / parent);

		slides.map((item, index) => {
			const sliderContent = document.querySelector(`#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index}:not(.swiper-slide-duplicate) .sliderContent`);
			const contentChild = sliderContent?.children || [];

			for (let i = 0; i < contentChild?.length; i++) {
				$(contentChild[i]).draggable({
					containment: 'parent',
					cursor: 'dragging',
					stop() {
						const top = calcPercentage($(this).position().top, parseInt(sliderContent?.clientHeight));
						const left = calcPercentage($(this).position().left, parseInt(sliderContent?.clientWidth));
						updateSlide(index, 'childPositions', top.toFixed(3), i, 'top');
						updateSlide(index, 'childPositions', left.toFixed(3), i, 'left');
					}
				});
			}
		});
	});

	return <>
		<IndexContext.Provider value={setActiveIndex}>
			<Settings attributes={props.attributes} setAttributes={setAttributes} />
		</IndexContext.Provider>

		<div className={className} id={`bBlocksSlider-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${titleTypo?.googleFontLink ? `@import url(${titleTypo?.googleFontLink})` : ''}
				${descTypo?.googleFontLink ? `@import url(${descTypo?.googleFontLink})` : ''}
				${btnTypo?.googleFontLink ? `@import url(${btnTypo?.googleFontLink})` : ''}

				#bBlocksSlider-${clientId} .bBlocksSliderWrapper{
					text-align: ${sliderAlign};
				}
				#bBlocksSlider-${clientId} .bBlocksSlider{
					width: ${sliderWidth};
					height: ${sliderHeight};
				}
				#bBlocksSlider-${clientId} .bBlocksSlider .slide{ height: ${sliderHeight}; }
				
				#bBlocksSlider-${clientId} .bBlocksSlider .slide .sliderTitle{
					${titleTypo?.styles || 'font-size: 25px;'}
				}
				#bBlocksSlider-${clientId} .bBlocksSlider .slide .sliderDescription{
					${descTypo?.styles || 'font-size: 15px;'}
				}
				#bBlocksSlider-${clientId} .bBlocksSlider .slide .sliderBtn{
					${btnTypo?.styles || 'font-size: 16px;'}
					padding: ${btnPadding?.styles || '12px 35px'};
					${btnBorder?.styles || 'border-radius: 3px;'}
				}

				#bBlocksSlider-${clientId} .bBlocksSlider .swiper-pagination .swiper-pagination-bullet{
					background: ${pageColor};
					width: ${pageWidth};
					height: ${pageHeight};
					${pageBorder?.styles || 'border-radius: 50%;'}
				}
				
				#bBlocksSlider-${clientId} .bBlocksSlider .swiper-button-prev, #bBlocksSlider-${clientId} .bBlocksSlider .swiper-button-next{ color: ${prevNextColor}; }
			`}} />
			<style>
				{slides.map((item, index) => {
					return `#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index}{
						${item.background?.styles || 'background-color: #00000080;'}
					}
					#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index} .sliderTitle{
						color: ${item.titleColor || '#fff'};
					}
					#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index} .sliderDescription{
						color: ${item.descColor || '#fff'};
					}
					#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index} .sliderBtn{
						${item.btnColors?.styles || 'color: #fff; background: #4527a4;'}
					}
					#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index} .sliderBtn:hover{
						${item.btnHovColors?.styles || 'color: #fff; background: #8344c5;'}
					}`;
				})}

				{slides.map((item, index) => {
					const { childPositions = [{ left: 5.8, top: 11 }, { left: 5.8, top: 22 }, { left: 5.8, top: 33 }] } = item;

					const contentChild = document.querySelector(`#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index} .sliderContent`)?.children || [];

					let childElPositionCSS = '';
					for (let i = 0; i < contentChild.length; i++) {
						childPositions[i] = childPositions[i] || { left: 5.8, top: (i + 1) * 11 }

						childElPositionCSS += `#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index} .sliderContent > *:nth-child(${i + 1}){ top: ${childPositions[i].top}%; left: ${childPositions[i].left}%; }`;
					}
					return childElPositionCSS;
				})}
			</style>

			<div className='bBlocksSliderWrapper' ref={sliderWrapperRef}></div>
			<div className='bBlocksSlider' ref={sliderRef}>
				<div className='swiper-wrapper'>
					{slides.map((item, index) => {
						const { position, title, description, btnText } = item;

						return <div key={index} className={`slide slide-${index} swiper-slide`}>
							<div className={`sliderContent ${position?.split(' ')?.join('-')}`}>
								{isTitle && title && <h2 className='sliderTitle'>{title}</h2>}
								{isDesc && description && <p className='sliderDescription'>{description}</p>}
								{isBtn && btnText && <a className='sliderBtn'>{btnText}</a>}
							</div>
						</div>;
					})}
				</div>

				{isPage && <div className='swiper-pagination'></div>}

				{isPrevNext && <><div className='swiper-button-prev'></div><div className='swiper-button-next'></div></>}
			</div>
		</div>
	</>;
};
export default withSelect((select) => {
	return {
		isEditorSidebarOpened: select('core/edit-post').isEditorSidebarOpened()
	};
})(Edit);