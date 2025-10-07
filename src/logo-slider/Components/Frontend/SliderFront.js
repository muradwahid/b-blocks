import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { placeholderImg } from '../../../utils/data';
const SliderFront = ({ attributes }) => {
    const { options, logo, sliderStyles } = attributes;
    const { caption } = sliderStyles;
    const styles = {
        ...(options.pagination && { '--b-blocks-logo-slider-slide-margin': '20px' }),
            '--swiper-wrapper-transition-timing-function': options?.easing,
    };

    return <div className="b-blocks-logo-slider-main-wrapper" style={styles}>
        <Swiper
            effect={options.effect}
            // install Swiper modules
            modules={[A11y, Autoplay, Navigation, Pagination, Scrollbar]}
            spaceBetween={50}
            slidesPerView={3}
            autoplay={
                options.autoplay
                    ? {
                        delay: options.delay,
                        reverseDirection:
                            options.direction === "rightToLeft" ? false : true,
                    }
                    : false
            }
            navigation={options.navigation ? { clickable: true } : false}
            draggable={false}
            loop={Boolean(options.loop)}
            speed={options.speed}
            autoHeight={true}
            pagination={
                options.pagination
                    ? { clickable: true, dynamicBullets: options.dynamicPagination }
                    : false
            }
            breakpoints={{
                1024: {
                    slidesPerView: options.logoView.desktop,
                    spaceBetween: options.space.desktop,
                },
                640: {
                    slidesPerView: options.logoView.tablet,
                    spaceBetween: options.space.tablet,
                },
                0: {
                    slidesPerView: options.logoView.mobile,
                    spaceBetween: options.space.mobile,
                },
            }}
            // loopAdditionalSlides={logo?.length}
        >
            {logo &&
                logo.map((img) => {
                    const AnchorEl = img?.anchor ? 'a' : 'div'
                    return <SwiperSlide key={img?.id}>
                        <AnchorEl {...(img?.anchor ? { href: img?.anchor, target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        <div className='b-blocks-logo-slider-wrapper' >
                            <div className="b-blocks-slider-logo-wrapper">
                                <img className={`b-blocks-losl-logo ${sliderStyles.logo.hover} `} src={img?.url || placeholderImg} alt={img?.alt} />
                                {img?.url && <div className={`b-blocks-logo-slider-block-caption  ${caption.hover === "hover" ? "b-blocks-caption-hover" : ""} ${!options.isCaptionVisible ? "hidden" : ""}`} dangerouslySetInnerHTML={{ __html: img?.caption }} />}
                            </div>
                        </div>
                        </AnchorEl>
                    </SwiperSlide>})}
        </Swiper>
    </div>
};
export default SliderFront;
