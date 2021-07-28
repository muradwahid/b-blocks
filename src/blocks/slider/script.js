// Swiper JS
import Swiper from 'swiper/bundle';

// Import Sass
import './style.scss';

const allSlider = document.querySelectorAll('.wp-block-b-blocks-slider');
Object.values(allSlider).map(slider => {
    const sliderId = slider.id;

    const currentSlider = document.getElementById(`${sliderId}`);
    const { columns, columnGap, isLoop, isAutoplay, speed, isFade, isTouchMove, isPageClickable, isPageDynamic } = JSON.parse(currentSlider.dataset.swiper);

    new Swiper(`#${sliderId} .bBlocksSlider`, {
        // Optional parameters
        direction: 'horizontal',
        slidesPerView: columns?.mobile,
        breakpoints: {
            // when window width is >= 576px
            576: {
                slidesPerView: columns?.tablet,
                effect: columns?.tablet == 1 && isFade ? 'fade' : '',
            },
            // when window width is >= 768px
            768: {
                slidesPerView: columns?.desktop,
                effect: columns?.desktop == 1 && isFade ? 'fade' : '',
            },
        },
        spaceBetween: columnGap,
        loop: isLoop,
        autoplay: isAutoplay,
        speed: speed * 1000,
        effect: columns?.mobile == 1 && isFade ? 'fade' : '',
        fadeEffect: {
            crossFade: true
        },
        allowTouchMove: isTouchMove,
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