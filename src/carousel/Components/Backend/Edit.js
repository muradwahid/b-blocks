import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { Button } from '@wordpress/components';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import { useSelect, withSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';
// import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import Swiper from 'swiper';

const Edit = props => {
	const { attributes, setAttributes, clientId, device } = props;
	const { navigation, layout, options, autoplay, pagination } = attributes;
	const swiperElRef = useRef(null);
	const swiperInstanceRef = useRef(null)
	const swiperWrapperRef = useRef(null)
	
	const CHILD_TAB_BLOCK = 'b-blocks/carousel-slide';

	const TEMPLATE = [
		[CHILD_TAB_BLOCK, {}],
		[CHILD_TAB_BLOCK, {}],
		[CHILD_TAB_BLOCK, {}],
	];

	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'swiper-wrapper' },
		{
			template: TEMPLATE,
			templateLock: false,
			renderAppender: false,
		}
	);

	const { insertBlock, selectBlock } = useDispatch('core/block-editor');

	const innerBlockCount = useSelect((select) => {
		return select('core/block-editor').getBlockOrder(clientId)?.length || 0;
	}, [clientId]);

	const addSlide = () => {
		const newSlide = createBlock(CHILD_TAB_BLOCK, { className: 'swiper-slide' });

		insertBlock(newSlide, innerBlockCount, clientId);

		selectBlock(clientId);
	};
	useLayoutEffect(() => {
		const el = swiperElRef.current;
		const blockWrapper = swiperWrapperRef.current;
		if (!(el instanceof Element) || !blockWrapper) return;

		// Wait until slides exist (Gutenberg renders async)
		const wrapper = el.querySelector('.swiper-wrapper');
		const slides = wrapper?.querySelectorAll('.swiper-slide');

		if (!wrapper || !slides || slides.length === 0) return;

		// destroy previous
		if (swiperInstanceRef.current) {
			swiperInstanceRef.current.destroy(true, true);
			swiperInstanceRef.current = null;
		}

		swiperInstanceRef.current = new Swiper(el, {
			modules: [A11y, Autoplay, Navigation, Pagination],
			slidesPerView: layout.slideView.mobile,
			spaceBetween: layout.space.mobile,
			loop: false,
			speed: options.speed * 1000,
			autoHeight: options.autoHeight,

			autoplay:false,
			breakpoints: {
				641: {
					slidesPerView: layout.slideView.tablet,
					spaceBetween: layout.space.tablet,
				},
				1025: {
					slidesPerView: layout.slideView.desktop,
					spaceBetween: layout.space.desktop,
				},
			},
			navigation: {
				nextEl: blockWrapper.querySelector('.swiper-button-next'),
				prevEl: blockWrapper.querySelector('.swiper-button-prev'),
			},

			pagination: pagination.pagination? {
				el: blockWrapper.querySelector('.swiper-pagination'),
				clickable: pagination.clickable,
				dynamicBullets: pagination.dynamicPagination,


			}:false,

			scrollbar: {
				el: el.querySelector('.swiper-scrollbar'),
				draggable: false,
			},

			allowTouchMove: false,              
			simulateTouch: false,
			preventClicks: true,            
			preventClicksPropagation: false,     
			touchStartPreventDefault: false,  
			touchStartForcePreventDefault: false,

			// observer: true,
			// observeParents: true,
		});

		swiperInstanceRef.current.navigation?.init();
		swiperInstanceRef.current.navigation?.update();

		return () => {
			if (swiperInstanceRef.current) {
				swiperInstanceRef.current.destroy(true, true);
				swiperInstanceRef.current = null;
			}
		};
	}, [clientId, innerBlockCount, JSON.stringify(layout.slideView), JSON.stringify(layout.space), JSON.stringify(options), JSON.stringify(autoplay), JSON.stringify(pagination)]);

	useEffect(() => { 
		setAttributes({clientId})
	},[])

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings {...{ attributes, setAttributes, updateObj, device }} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
			<div className="swiper-editor__controls" style={{ marginBottom: 10 }}>
				<Button variant="primary" onClick={addSlide}>
					+ Add Slide
				</Button>
			</div>
			<div className='bBlock-carousel-main-wrapper'>
				<div>
					<div className='bBlocks-carousel-wrapper' ref={swiperWrapperRef}>
						<div className="swiper" ref={swiperElRef}>
							<div {...innerBlocksProps} />
							{/* <div className="swiper-scrollbar" /> */}
						</div>
						{navigation.navigation && <><div className="swiper-button-prev" dangerouslySetInnerHTML={{ __html: navigation.prevIcon.library }} />
							<div className="swiper-button-next" dangerouslySetInnerHTML={{ __html: navigation.nextIcon.library }} /></>}
						{pagination.pagination && <div className="swiper-pagination swiper-pagination-horizontal" />}
					</div>
				</div>
		</div>
		</div>
	</>;
}
export default withSelect((select, { clientId }) => {
	const { getDeviceType } = select('core/editor');
	const { getBlocks } = select('core/block-editor');

	return {
		innerBlocks: getBlocks(clientId),
		device: getDeviceType()?.toLowerCase()
	}
})(Edit);