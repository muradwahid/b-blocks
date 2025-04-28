import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const SliderFront = ({ attributes }) => {
  const { options, logo, sliderStyles } = attributes;
  const { caption } = sliderStyles;

  return <div className="logo-slider-main-wrapper">
    <Swiper
      effect={options.effect}
      // install Swiper modules
      modules={[A11y, Autoplay, Navigation, Pagination, Scrollbar]}
      spaceBetween={50}
      slidesPerView={3}
      autoplay={
        options.autoplay
          ? {
            delay: options.delay * 1000,
            reverseDirection:
              options.direction === "rightToLeft" ? false : true,
          }
          : false
      }
      navigation={options.navigation ? { clickable: true } : false}
      draggable={false}
      loop={Boolean(options.loop)}
      speed={options.speed * 1000}
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
    >
      {logo &&
        logo.map((img) =>
          <SwiperSlide key={img?.id}>
            <div className='logo-slider-wrapper'>
              <div className="slider-logo-wrapper">
                <img className={`losl-logo ${sliderStyles.logo.hover} `} src={img?.url} alt={img?.alt} />
                <div className={`logo-slider-block-caption  ${caption.hover === "hover" ? "caption-hover" : ""} ${!options.isCaptionVisible ? "hidden" : ""}`} dangerouslySetInnerHTML={{ __html: img?.caption }} />
              </div>
            </div>
          </SwiperSlide>)}
    </Swiper>
  </div>
};
export default SliderFront;
