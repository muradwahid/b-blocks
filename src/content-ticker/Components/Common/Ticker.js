import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Autoplay, EffectFade, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const Ticker = ({ attributes }) => {
	const { content, options } = attributes;

	const styles = {
			'--swiper-wrapper-transition-timing-function': options?.easing
	};

	const Slider = () => <Swiper
		style={styles}
		modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade]}
		slidesPerView={1}
		loop={options.isLoop}
		loopAddBlankSlides={true}
		autoplay={
			options.isAutoplay
				? {
					delay: options.autoPlaySpeed,
					reverseDirection:
						options.effect === 'slide'
							? options.direction === 'right'
								? false
								: true
							: true,
					pauseOnMouseEnter: options.isPauseOnHover,
				}
				: false
		}
		{...(options.effect === 'fade' ? { effect: 'fade' } : {})}
		speed={options.sliderSpeed}
		grabCursor={options.isGrabCursor}
		navigation={
			options.isArrows
				? {
					prevEl: '.custom-prev-btn',
					nextEl: '.custom-next-btn',
				}
				: false
		}
		className='cttk-ticker-content-wrapper'
	>
		{content?.map((value, index) => (
			<SwiperSlide key={index}>
				<a
					className='cttk-ticker-link'
					{...(value.link.length > 2 ? { href: value.link } : {})}
					{...(value.link.length > 2 ? { target: '_blank' } : {})}
				>
					{value.text}
				</a>
			</SwiperSlide>
		))}
		{!(content.length > 1) && <SwiperSlide></SwiperSlide>}
	</Swiper>
	return <Slider />;
};

export default Ticker;
