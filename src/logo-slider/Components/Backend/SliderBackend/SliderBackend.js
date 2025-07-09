/* eslint-disable no-unused-vars */
import { MediaUpload, MediaUploadCheck, RichText } from "@wordpress/block-editor";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BsPlus, FaTrash } from "../../../utils/icons";

const SliderBackend = ({ attributes, setAttributes, activeIndex, setActiveIndex }) => {
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
            // loop={options.loop ? false : true}
            loop={Boolean(options.loop)}
            speed={options.speed * 1000}
            autoHeight={true}
            pagination={options.pagination ? { clickable: true, dynamicBullets: options.dynamicPagination } : false}
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
                logo.map((img, idx) => <>

                    <SwiperSlide key={img?.id}>
                        <div className='logo-slider-wrapper' style={{ border: `${activeIndex === idx ? "2px solid #007CBA" : "none"}`, borderRadius: `${activeIndex === idx ? "4px" : "none"}` }}>
                            <div className="slider-logo-wrapper" onClick={() => setActiveIndex(idx)}>
                                <FaTrash onClick={() => setAttributes({ logo: logo.filter((val, i) => i !== idx) })} className="logo-slider-block-delete-btn" />
                                <MediaUploadCheck>
                                    <MediaUpload
                                        // gallery={true}
                                        allowedTypes={["image/*"]}
                                        value={logo[idx]?.id ? [logo[idx]?.id] : []}
                                        onSelect={(value) => setAttributes(logo.splice(idx, 1, value))}
                                        render={({ open }) => <div onClick={open} className="logo-replace-wrapper" >
                                            <BsPlus className='losl-replace-plus-icon' />
                                        </div>}
                                        multiple={false}
                                    />
                                </MediaUploadCheck>
                                <img className={`losl-logo ${sliderStyles.logo.hover} `} src={img?.url} alt={img?.alt} />
                                <div className={`logo-slider-block-caption  ${caption.hover === "hover" ? "caption-hover" : ""} ${!options.isCaptionVisible ? "hidden" : ""}`} >

                                    <RichText tagName="span" value={img?.caption} allowedFormats={["core/bold", "core/italic", "core/link",]} placeholder="Write caption..." onChange={(value) => setAttributes({ logo: logo?.map((val, i) => i === idx ? { ...val, caption: value } : val) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </>)}
        </Swiper>
    </div>;
};

export default SliderBackend;
