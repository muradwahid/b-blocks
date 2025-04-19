import React from "react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { A11y, Autoplay, EffectFade, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
const Ticker = ({ attributes }) => {
  const { content, animation } = attributes;
  const Slider = () => (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay, EffectFade]}
      slidesPerView={1}
      loop={animation.isLoop}
      loopAddBlankSlides={true}
      autoplay={
        animation.isAutoplay
          ? {
            delay: animation.autoPlaySpeed,
            reverseDirection:
              animation.effect === "slide"
                ? animation.direction === "right"
                  ? false
                  : true
                : true,
            pauseOnMouseEnter: animation.isPauseOnHover,
          }
          : false
      }
      {...(animation.effect === "fade" ? { effect: "fade" } : {})}
      speed={animation.sliderSpeed}
      grabCursor={animation.isGrabCursor}
      navigation={
        animation.isArrows
          ? {
            prevEl: ".custom-prev-btn",
            nextEl: ".custom-next-btn",
          }
          : false
      }
      className="cttk-ticker-content-wrapper"
    >
      {content?.map((value, index) => (
        <SwiperSlide key={index}>
          <a
            className="cttk-ticker-link"
            {...(value.link.length > 2 ? { href: value.link } : {})}
            {...(value.link.length > 2 ? { target: "_blank" } : {})}
          >
            {value.text}
          </a>
        </SwiperSlide>
      ))}
      {!(content.length > 1) && <SwiperSlide></SwiperSlide>}
    </Swiper>
  );
  return <Slider />;
};

export default Ticker;
