import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

// Custom Attributes
const attributes = {
    align: { type: 'string', default: '' },
    cId: { type: 'string' },

    slides: { type: 'array', default: [{ img: '', title: 'Slide Title', description: 'Description of slide', btnText: 'Click Me', btnLink: '#' }] },

    columns: { type: 'object', default: { desktop: 1, tablet: 1, mobile: 1 } },
    columnGap: { type: 'number', default: 15 },
    sliderHeight: { type: 'number', default: 350 },
    BGOverlayColor: { type: 'string', default: '#00000080' },

    isLoop: { type: 'boolean', default: true },
    isAutoplay: { type: 'boolean', default: true },
    speed: { type: 'number', default: 1 },
    isFade: { type: 'boolean', default: false },
    isTouchMove: { type: 'boolean', default: false },
    isPage: { type: 'boolean', default: true },
    isPageClickable: { type: 'boolean', default: true },
    isPageDynamic: { type: 'boolean', default: true },
    pageColor: { type: 'string', default: '#fff' },
    pageWidth: { type: 'number', default: 15 },
    pageHeight: { type: 'number', default: 15 },
    pageBorder: { type: 'object', default: { radius: '50%' } },
    isPrevNext: { type: 'boolean', default: true },
    prevNextColor: { type: 'string', default: '#fff' },

    contentAlign: { type: 'string', default: 'center' },

    isTitle: { type: 'boolean', default: true },
    titleTypo: { type: 'object', default: { fontSize: 25 } },
    titleColor: { type: 'string', default: '#fff' },
    titleMargin: { type: 'object', default: { bottom: '15px' } },

    isDesc: { type: 'boolean', default: true },
    descTypo: { type: 'object', default: { fontSize: 15 } },
    descColor: { type: 'string', default: '#fff' },
    descMargin: { type: 'object', default: { bottom: '15px' } },

    isBtn: { type: 'boolean', default: true },
    btnTypo: { type: 'object', default: { fontSize: 16 } },
    btnColors: { type: 'object', default: { color: '#fff', bg: '#ff4500' } },
    btnHovColors: { type: 'object', default: { color: '#fff', bg: '#ff7500' } },
    btnPadding: { type: 'object', default: { vertical: '12px', horizontal: '35px' } },
    btnBorder: { type: 'object', default: { radius: '3px' } }
}

registerBlockType('b-blocks/slider', {
    // Build In attributes
    title: __('Slider', 'b-blocks'),
    description: __('Display image and content slider', 'b-blocks'),
    icon: icons.slider,
    category: 'bBlocks',
    keywords: [__('carousel', 'b-blocks'), __('image slider', 'b-blocks'), __('image carousel', 'b-blocks')],
    supports: {
        align: ['wide', 'full'],
        html: false
    },

    attributes,

    edit: Edit,

    save: props => {
        const { cId, slides = [], columns = { desktop: 1, tablet: 1, mobile: 1 }, columnGap = 15, sliderHeight, BGOverlayColor, isLoop = true, isAutoplay = true, speed = 1, isFade = false, isTouchMove = false, isPage = true, isPageClickable = true, isPageDynamic = true, pageColor = '#fff', pageWidth = 15, pageHeight = 15, pageBorder = { radius: '50%' }, isPrevNext = true, prevNextColor = '#fff', contentAlign, isTitle = true, titleTypo = { fontSize: 25 }, titleColor = '#fff', titleMargin = { bottom: '10px' }, isDesc = false, descTypo = { fontSize: 25 }, descColor, descMargin = { bottom: '10px' }, isBtn = true, btnTypo = { fontSize: 16 }, btnColors = { color: '#fff', bg: '#ff4500' }, btnHovColors = { color: '#fff', bg: '#ff7500' }, btnPadding = { vertical: '20px', horizontal: '10px' }, btnBorder = { radius: '3px' } } = props.attributes;

        return <div className={`bBlocksSlider h-${sliderHeight}-px`} id={`bBlocksSlider-${cId}`} data-swiper={JSON.stringify({ columns, columnGap, isLoop, isAutoplay, speed, isFade, isTouchMove, isPageClickable, isPageDynamic })}>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${titleTypo?.googleFontLink});
                @import url(${descTypo?.googleFontLink});
                @import url(${btnTypo?.googleFontLink});

                #bBlocksSlider-${cId} .slider .bBlocksSlide .sliderTitle{
                    color: ${titleColor};
                    ${titleTypo?.styles || 'font-size: 25px;'}
                    margin: ${titleMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksSlider-${cId} .slider .bBlocksSlide .sliderDescription{
                    color: ${descColor};
                    ${descTypo?.styles || 'font-size: 15px;'}
                    margin: ${descMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksSlider-${cId} .slider .bBlocksSlide .sliderBtn{
                    ${btnColors?.styles || 'color: #fff; background: #ff4500;'}
                    ${btnTypo?.styles || 'font-size: 16px;'};
                    padding: ${btnPadding?.styles || '12px 35px'};
                    ${btnBorder?.styles || 'border-radius: 3px;'}
                }
                #bBlocksSlider-${cId} .slider .bBlocksSlide .sliderBtn:hover{
                    ${btnHovColors?.styles || 'color: #fff; background: #ff7500;'}
                }

                #bBlocksSlider-${cId} .slider .swiper-pagination .swiper-pagination-bullet{
                    background: ${pageColor};
                    width: ${pageWidth}px;
                    height: ${pageHeight}px;
                    ${pageBorder?.styles || 'border-radius: 50%;'}
                }
                #bBlocksSlider-${cId} .slider .swiper-pagination .swiper-pagination-bullet:focus{outline: 0;}

                #bBlocksSlider-${cId} .slider .swiper-button-prev, .swiper-button-next{color: ${prevNextColor};}
            `}} />

            <div className='slider'>
                <div className='swiper-wrapper'>
                    {slides.map((item, index) => {
                        const { img, title, description, btnText = 'Click Me', btnLink = '#' } = item;

                        return <div key={index} className={`bBlocksSlide bBlocksSlide-${index + 1} swiper-slide`}>
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                #bBlocksSlider-${cId} .slider .bBlocksSlide-${index + 1}{
                                    background: url(${img}) center center / cover no-repeat ${BGOverlayColor};
                                }
                            `}} />

                            <div className={`sliderContent text-${contentAlign}`}>
                                {isTitle && title && <h2 className='sliderTitle'>{title}</h2>}
                                {isDesc && description && <p className='sliderDescription'>{description}</p>}

                                {isBtn && btnText && <a href={btnLink} className='sliderBtn' target='_blank' rel='noreferrer noopener'>{btnText}</a>}
                            </div>
                        </div>
                    })}
                </div>

                <div className='swiper-pagination'></div>

                {isPage && <div className='swiper-pagination'></div>}

                {isPrevNext && <>
                    <div className='swiper-button-prev'></div>
                    <div className='swiper-button-next'></div>
                </>}
            </div>
        </div>;
    },

    deprecated,

    example: {
        attributes: {
            'preview': true,
            columns: {
                desktop: 1,
                tablet: 1,
                mobile: 1
            },
        },
    }
});