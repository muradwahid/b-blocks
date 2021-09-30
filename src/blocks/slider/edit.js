import { useEffect, useState, createContext } from '@wordpress/element';

import Settings from './settings';

const $ = jQuery;

export const IndexContext = createContext();

const Edit = props => {
    const { className, attributes: { align, slides = [], columns, columnGap, sliderWidth, sliderHeight, isLoop, isAutoplay, speed, effect, isTouchMove, isPage, isPageClickable, isPageDynamic, pageColor, pageWidth, pageHeight, pageBorder, isPrevNext, prevNextColor, sliderAlign, isTitle, titleTypo, titleColor, titleMargin, isDesc, descTypo, descColor, descMargin, isBtn, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);
    const [activeIndex, setActiveIndex] = useState(0);

    const currentBlock = document.querySelector(`#block-${clientId} .wp-block`);
    const isEditorSidebarOpened = wp.data.select('core/edit-post').isEditorSidebarOpened();

    // Swiper Scripts
    // Slider EL
    const sliderEl = `<div class='bBlocksSlider'>
        <div class='swiper-wrapper'>
            ${slides.map((item, index) => {
        const { background, position, title, description, btnText } = item;

        return `<div key=${index} class='slide slide-${index} swiper-slide'>
            <style>#bBlocksSlider-${clientId} .bBlocksSlider .slide-${index}{ ${background?.styles || 'background-color: #00000080;'} }</style>

            <div class='sliderContent ${position?.split(' ')?.join('-')}'>
                ${isTitle && title ? `<h2 class='sliderTitle'>${title}</h2>` : ''}
                ${isDesc && description ? `<p class='sliderDescription'>${description}</p>` : ''}
                ${isBtn && btnText ? `<a class='sliderBtn'>${btnText}</a>` : ''}
            </div>
        </div>`;
    }).join('')}
    </div>

        ${isPage && `<div class='swiper-pagination'></div>`}
        ${isPrevNext && `<div class='swiper-button-prev'></div><div class='swiper-button-next'></div>`}
    </div>`;

    useEffect(() => {
        const currentSlider = document.querySelector(`#bBlocksSlider-${clientId} .bBlocksSlider`);

        const currentAll = currentSlider && currentBlock;

        currentAll ? currentBlock.style.display = 'block' : 'initial';
        align === 'full' && currentAll ? currentBlock.style.maxWidth = 'none' : '';
        align === 'wide' && currentAll ? currentBlock.style.maxWidth = 'none' : '';
        align === '' && currentAll ? currentBlock.style.maxWidth = '' : '';

        currentAll && isEditorSidebarOpened ? currentBlock.style.display = 'grid' : '';

        currentAll ? currentSlider.style.width = `${currentBlock.clientWidth}px` : '';

        // Re init slider
        const sliderWrapper = document.querySelector(`#bBlocksSlider-${clientId} .sliderWrapper`);
        sliderWrapper.innerHTML = '';
        sliderWrapper.innerHTML = sliderEl;

        new Swiper(`#bBlocksSlider-${clientId} .bBlocksSlider`, {
            // Optional parameters
            direction: 'horizontal',
            initialSlide: activeIndex,
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
            autoplay: false,
            // autoplay: isAutoplay ? { delay: speed * 1000 } : false,
            speed: speed * 1000,
            effect,
            fadeEffect: { crossFade: true },
            creativeEffect: {
                prev: {
                    shadow: true,
                    translate: ['-120%', 0, -500],
                },
                next: {
                    shadow: true,
                    translate: ['120%', 0, -500],
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

        let seen = {};
        $(`#bBlocksSlider-${clientId} .swiper-notification`).each(function () {
            let txt = $(this).attr('class');
            if (seen[txt])
                $(this).remove();
            else
                seen[txt] = true;
        });
    }, [align, slides, columns, columnGap, isEditorSidebarOpened, currentBlock, isLoop, isTouchMove, isAutoplay, speed, effect, isPage, isPageClickable, isPageDynamic, isPrevNext, isTitle, isDesc, isBtn]);

    return <>
        <IndexContext.Provider value={setActiveIndex}>
            <Settings settings={props} />
        </IndexContext.Provider>

        <div className={className} id={`bBlocksSlider-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${titleTypo?.googleFontLink});
                @import url(${descTypo?.googleFontLink});
                @import url(${btnTypo?.googleFontLink});

                #bBlocksSlider-${clientId} .sliderWrapper{
                    text-align: ${sliderAlign};
                }
                #bBlocksSlider-${clientId} .bBlocksSlider{
                    width: ${sliderWidth};
                    height: ${sliderHeight};
                }
                #bBlocksSlider-${clientId} .bBlocksSlider .slide{ height: ${sliderHeight}; }
                
                #bBlocksSlider-${clientId} .bBlocksSlider .slide .sliderTitle{
                    color: ${titleColor};
                    ${titleTypo?.styles || 'font-size: 25px;'}
                    margin: ${titleMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksSlider-${clientId} .bBlocksSlider .slide .sliderDescription{
                    color: ${descColor};
                    ${descTypo?.styles || 'font-size: 15px;'}
                    margin: ${descMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksSlider-${clientId} .bBlocksSlider .slide .sliderBtn{
                    ${btnColors?.styles || 'color: #fff; background: #4527a4;'}
                    ${btnTypo?.styles || 'font-size: 16px;'}
                    padding: ${btnPadding?.styles || '12px 35px'};
                    ${btnBorder?.styles || 'border-radius: 3px;'}
                }
                #bBlocksSlider-${clientId} .bBlocksSlider .slide .sliderBtn:hover{
                    ${btnHovColors?.styles || 'color: #fff; background: #8344c5;'}
                }

                #bBlocksSlider-${clientId} .bBlocksSlider .swiper-pagination .swiper-pagination-bullet{
                    background: ${pageColor};
                    width: ${pageWidth};
                    height: ${pageHeight};
                    ${pageBorder?.styles || 'border-radius: 50%;'}
                }
                
                #bBlocksSlider-${clientId} .bBlocksSlider .swiper-button-prev, #bBlocksSlider-${clientId} .bBlocksSlider .swiper-button-next{ color: ${prevNextColor}; }
            `}} />

            <div className='sliderWrapper'></div>
        </div>
    </>;
};
export default Edit;