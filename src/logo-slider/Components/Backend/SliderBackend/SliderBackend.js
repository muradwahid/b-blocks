/* eslint-disable no-unused-vars */
import { MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BsPlus, FaTrash } from '../../../utils/icons';
import { placeholderImg } from '../../../../utils/data';

const SliderBackend = ({ attributes, setAttributes, activeIndex, setActiveIndex }) => {
    const { options, logo, sliderStyles } = attributes;
    const { caption } = sliderStyles;

    const styles = {
        ...(options.pagination && { '--b-blocks-logo-slider-slide-margin': '20px' }),
        '--swiper-wrapper-transition-timing-function': options?.easing
    };

    return <div className='b-blocks-logo-slider-main-wrapper' style={styles}>
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
                            options.direction === 'rightToLeft' ? false : true,
                        pauseOnMouseEnter: options?.isPauseOnHover
                    }
                    : false
            }
            navigation={options.navigation ? { clickable: true } : false}
            draggable={false}
            // loop={options.loop ? false : true}
            loop={Boolean(options.loop)}
            speed={options.speed}
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
                        <div style={{ border: `${activeIndex === idx ? '2px solid #007CBA' : 'none'}`, borderRadius: `${activeIndex === idx ? '4px' : 'none'}` }}>
                            <div className='b-blocks-logo-slider-wrapper' >
                                <div className='b-blocks-slider-logo-wrapper' onClick={() => setActiveIndex(idx)}>
                                    <FaTrash onClick={() => setAttributes({ logo: logo.filter((val, i) => i !== idx) })} className='b-blocks-logo-slider-block-delete-btn' />
                                    <MediaUploadCheck>
                                        <MediaUpload
                                            // gallery={true}
                                            allowedTypes={['image/*']}
                                            value={logo[idx]?.id ? [logo[idx]?.id] : []}
                                            onSelect={(value) => setAttributes(logo.splice(idx, 1, value))}
                                            render={({ open }) => <div onClick={open} className='b-blocks-b-blocks-losl-replace-plus-icon' >
                                                <BsPlus className='b-blocks-losl-replace-plus-icon' />
                                            </div>}
                                            multiple={false}
                                        />
                                    </MediaUploadCheck>
                                    <img className={`b-blocks-losl-logo ${sliderStyles.logo.hover} `} src={img?.url || placeholderImg} alt={img?.alt} />
                                    {img?.url && <div className={`b-blocks-logo-slider-block-caption  ${caption.hover === 'hover' ? 'b-blocks-caption-hover' : ''} ${!options.isCaptionVisible ? 'hidden' : ''}`} >

                                        <RichText tagName='span' value={img?.caption} allowedFormats={['core/bold', 'core/italic', 'core/link',]} placeholder='Write caption...' onChange={(value) => setAttributes({ logo: logo?.map((val, i) => i === idx ? { ...val, caption: value } : val) })}
                                        />
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                </>)}
        </Swiper>
    </div>;
};

export default SliderBackend;
