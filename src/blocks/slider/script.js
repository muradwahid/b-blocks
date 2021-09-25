// Swiper
import 'swiper/css/bundle';

// Import Sass
import './style.scss';

const allSlider = document.querySelectorAll('.wp-block-b-blocks-slider');

Object.values(allSlider).map(slider => {
    const sliderId = slider.id;

    const sliderEl = document.getElementById(sliderId);

    const { columns, columnGap, isLoop, isTouchMove, isAutoplay, speed, effect, isPageClickable, isPageDynamic } = JSON.parse(sliderEl.dataset.swiper);

    new Swiper(`#${sliderId} .bBlocksSlider`, {
        // Optional parameters
        direction: 'horizontal',
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
        autoplay: isAutoplay ? { delay: speed * 1000 } : false,
        speed: speed * 1000,
        effect,
        fadeEffect: { crossFade: true },
        creativeEffect: {
            prev: {
                shadow: true,
                translate: ["-120%", 0, -500],
            },
            next: {
                shadow: true,
                translate: ["120%", 0, -500],
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
});