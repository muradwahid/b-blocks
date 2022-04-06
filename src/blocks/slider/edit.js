import { withSelect } from '@wordpress/data';
import { useEffect, useState, useRef, renderToString } from '@wordpress/element';
const $ = jQuery;

import Settings from './Settings';
import Slider from './Slider';
import Style from './Style';
import sliderOptions from './sliderOptions';
import { calcPercentage, elWidth, elHeight, childPositionSet } from './functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isEditorSidebarOpened } = props;
	const { align, slides = [], columns, columnGap, isLoop, isAutoplay, speed, effect, isTouchMove, isPage, isPageClickable, isPageDynamic, isPrevNext, isTitle, isDesc, isBtn } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);
	// const sliderRef = useRef(null);
	const sliderWrapperRef = useRef(null);

	const currentBlock = document.querySelector(`#block-${clientId} .wp-block`);
	useEffect(() => {
		const currentSlider = document.querySelector(`#bBlocksSlider-${clientId} .bBlocksSliderWrapper .bBlocksSlider`);

		const currentAll = currentSlider && currentBlock;

		currentAll ? currentBlock.style.display = 'block' : 'initial';
		align === 'full' && currentAll ? currentBlock.style.maxWidth = 'none' : '';
		align === 'wide' && currentAll ? currentBlock.style.maxWidth = 'none' : '';
		align === '' && currentAll ? currentBlock.style.maxWidth = '' : '';

		currentAll && isEditorSidebarOpened ? currentBlock.style.display = 'grid' : '';

		// currentAll ? currentSlider.style.width = `${currentBlock.clientWidth}px` : '';
	}, [align, isEditorSidebarOpened]);

	// Swiper Scripts
	useEffect(() => {
		// Slider in wrapper
		sliderWrapperRef.current.innerHTML = renderToString(<Slider attributes={attributes} />);

		// Initialize Slider
		new Swiper(`#bBlocksSlider-${clientId} .bBlocksSliderWrapper .bBlocksSlider`, sliderOptions(attributes, activeIndex, true));

		// Remove duplicate swiper-notification el
		let seen = {};
		$(`#bBlocksSlider-${clientId} .swiper-notification`).each(function () {
			let txt = $(this).attr('class');
			if (seen[txt])
				$(this).remove();
			else
				seen[txt] = true;
		});
	}, [slides, columns, columnGap, currentBlock, isLoop, isTouchMove, isAutoplay, speed, effect, isPage, isPageClickable, isPageDynamic, isPrevNext, isTitle, isDesc, isBtn]);

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
		slides?.length && slides.map((item, index) => {
			const { position } = item;

			const sliderContent = document.querySelector(`#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index}:not(.swiper-slide-duplicate) .sliderContent`);
			const contentChild = sliderContent?.children || [];

			// position to childPosition start
			const newSlides = [...slides];
			newSlides[index]['childPositions'] = newSlides[index]['childPositions'] || [{ left: 5.8, top: 11 }, { left: 5.8, top: 22 }, { left: 5.8, top: 33 }];

			const resetPosition = () => {
				newSlides[index]['position'] = '';
				setAttributes({ slides: newSlides });
			}
			const childPositionsForOld = (i, top, left) => {
				newSlides[index]['childPositions'][i]['top'] = top;
				newSlides[index]['childPositions'][i]['left'] = left;
			}
			childPositionSet(position, sliderContent, childPositionsForOld, true, resetPosition);
			// position to childPosition end

			for (let i = 0; i < contentChild?.length; i++) {
				$(contentChild[i]).draggable({
					containment: 'parent',
					cursor: 'dragging',
					stop() {
						const top = calcPercentage($(this).position().top, elHeight(sliderContent));
						const left = calcPercentage($(this).position().left, elWidth(sliderContent));
						updateSlide(index, 'childPositions', top.toFixed(3), i, 'top');
						updateSlide(index, 'childPositions', left.toFixed(3), i, 'left');
					}
				});
			}
		});
	});

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} setActiveIndex={setActiveIndex} />

		<div className={className} id={`bBlocksSlider-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className='bBlocksSliderWrapper' ref={sliderWrapperRef}></div>
		</div>
	</>;
};
export default withSelect((select) => {
	return {
		isEditorSidebarOpened: select('core/edit-post').isEditorSidebarOpened()
	};
})(Edit);