import Swiper from 'swiper';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { A11y, Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Carousel = ({ attributes, slidesHost }) => {
	const { navigation, layout, options, autoplay, pagination } = attributes;

	const rootRef = useRef(null);
	const swiperRef = useRef(null);
	const wrapperRef = useRef(null);
	const swiperInstanceRef = useRef(null);

	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!wrapperRef.current || !slidesHost) return;

		if (slidesHost.dataset.moved === '1') {
			setReady(true);
			return;
		}

		const slideNodes = Array.from(slidesHost.children);
		wrapperRef.current.append(...slideNodes);
		slidesHost.dataset.moved = '1';

		setReady(true);
	}, [slidesHost]);

	useLayoutEffect(() => {
		if (!ready) return;

		const swiperEl = swiperRef.current;
		const root = rootRef.current;
		const wrapper = wrapperRef.current;
		if (!swiperEl || !root || !wrapper) return;

		const slides = wrapper.querySelectorAll('.swiper-slide');
		if (!slides.length) return;

		// prevent double init
		if (swiperEl.swiper) return;

		const nextEl = root.querySelector('.swiper-button-next');
		const prevEl = root.querySelector('.swiper-button-prev');
		const pagEl = root.querySelector('.swiper-pagination');

		const delayMs = Math.round((autoplay?.delay ?? 2.5) * 1000);

		swiperInstanceRef.current = new Swiper(swiperEl, {
			modules: [A11y, Autoplay, Navigation, Pagination],

			slidesPerView: layout?.slideView?.mobile ?? 1,
			spaceBetween: layout?.space?.mobile ?? 15,
			loop: !!options?.loop,
			speed: Math.round((options?.speed ?? 0.5) * 1000),
			autoHeight: !!options?.autoHeight,

			autoplay: autoplay?.autoplay
				? {
					delay: delayMs,
					disableOnInteraction: false,
					pauseOnMouseEnter: !!autoplay?.isPauseOnHover,
					reverseDirection: autoplay?.direction === 'left',
				}
				: false,

			breakpoints: {
				641: {
					slidesPerView: layout?.slideView?.tablet ?? 2,
					spaceBetween: layout?.space?.tablet ?? 25,
				},
				1025: {
					slidesPerView: layout?.slideView?.desktop ?? 3,
					spaceBetween: layout?.space?.desktop ?? 30,
				},
			},

			navigation: navigation?.navigation && nextEl && prevEl ? { nextEl, prevEl } : false,
			pagination: pagination?.pagination && pagEl ? { el: pagEl, clickable: !!pagination?.clickable } : false,

			allowTouchMove: !!options?.touchMove,
			preventClicks: false,
			preventClicksPropagation: false,
		});

		requestAnimationFrame(() => swiperInstanceRef.current?.update());

		return () => {
			swiperInstanceRef.current?.destroy(true, true);
			swiperInstanceRef.current = null;
		};
	}, [ready, attributes]);

	return (
		<div className="bBlock-carousel-main-wrapper" ref={rootRef}>
			<div className="bBlocks-carousel-wrapper">
				<div className="swiper" ref={swiperRef}>
					<div className="swiper-wrapper" ref={wrapperRef} />
				</div>

				{navigation?.navigation && (
					<>
						<div className="swiper-button-prev" dangerouslySetInnerHTML={{ __html: navigation?.prevIcon?.library }} />
						<div className="swiper-button-next" dangerouslySetInnerHTML={{ __html: navigation?.nextIcon?.library }} />
					</>
				)}

				{pagination?.pagination && <div className="swiper-pagination swiper-pagination-horizontal" />}
			</div>
		</div>
	);
};

export default Carousel;