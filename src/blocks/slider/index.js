import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
const v1 = {
    supports: {
        align: ['center', 'wide', 'full']
    },

    attributes: {
        align: { type: 'string', default: 'center' },
        cId: { type: 'string' },

        slides: { type: 'array' },

        sliderWidth: { type: 'number', default: 100 },
        sliderWidthType: { type: 'string', default: '%' },
        sliderHeight: { type: 'number', default: 350 },
        BGOverlayColor: { type: 'string', default: '#4527a4' },
        BGOverlayOpacity: { type: 'number', default: .4 },
        slideInterval: { type: 'number', default: 3 },
        slideFade: { type: 'boolean', default: false },

        contentAlign: { type: 'string', default: 'center' },

        headTag: { type: 'string', default: 'h2' },
        headColor: { type: 'string', default: '#fff' },
        headFontSize: { type: 'number', default: 25 },
        headMB: { type: 'number', default: 15 },

        descColor: { type: 'string', default: '#fff' },
        descFontSize: { type: 'number', default: 15 },
        descMB: { type: 'number', default: 15 },

        indicatorColor: { type: 'string', default: '#fff' },
        indicatorWidth: { type: 'number', default: 15 },
        indicatorHeight: { type: 'number', default: 15 },
        indicatorRadius: { type: 'number', default: 50 },
        indicatorRadiusType: { type: 'string', default: '%' }
    },

    save: props => {
        const { cId, slides, sliderWidth, sliderWidthType, sliderHeight, BGOverlayColor, BGOverlayOpacity, slideInterval, slideFade, contentAlign, headTag, headColor, headFontSize, headMB, descColor, descFontSize, descMB, indicatorColor, indicatorWidth, indicatorHeight, indicatorRadius, indicatorRadiusType } = props.attributes;

        // Styles
        const sliderStyle = { width: `${sliderWidth}${sliderWidthType}` }

        const slideItemStyle = { position: 'relative', minHeight: `${sliderHeight < 250 ? sliderHeight : 250}px`, height: `${sliderHeight}px` }

        const overlayOpacityStyle = { position: 'absolute', width: '100%', height: '100%', left: 0, right: 0, backgroundColor: BGOverlayColor, opacity: BGOverlayOpacity };

        const captionStyle = { textAlign: contentAlign, bottom: '60px' }

        const sliderIndicatorsStyle = { backgroundColor: indicatorColor, width: `${indicatorWidth}px`, height: `${indicatorHeight}px`, borderRadius: `${indicatorRadius}${indicatorRadiusType}` }

        // Components
        const slideIndicators = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(slide => {
                    const { index } = slide;
                    const active = index == 0 ? true : false;

                    return (
                        <li key={slide.index} data-target={`#bBlocksSlider-${cId}`} data-slide-to={index} className={active ? 'active' : ''} style={sliderIndicatorsStyle}></li>
                    );
                })
            );
        }

        const slideItem = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(slide => {
                    const { index, img, title, description } = slide;
                    const active = index == 0 ? true : false;

                    return (
                        <div key={slide.index} className={`carousel-item ${active ? 'active' : ''}`} data-interval={slideInterval * 1000} style={slideItemStyle}>
                            <div style={overlayOpacityStyle}></div>

                            {img && <img src={img} className="w-100" alt="" />}

                            <div className="carousel-caption d-none d-md-block" style={captionStyle}>
                                <RichText.Content tagName={headTag} value={title} style={{ color: headColor, fontSize: `${headFontSize}px`, margin: `0 0 ${headMB}px 0` }} />
                                <RichText.Content tagName="p" value={description} style={{ color: descColor, fontSize: `${descFontSize}px`, margin: `0 0 ${descMB}px 0` }} />
                            </div>
                        </div>
                    );
                })
            );
        }


        return (
            <div className="b_blocks_slider" style={{ textAlign: 'inherit' }}>
                <div id={`bBlocksSlider-${cId}`} className={`carousel slide ${slideFade ? 'carousel-fade' : ''}`} data-ride="carousel" style={sliderStyle}>
                    <ol className="carousel-indicators" style={{ margin: '0 0 25px 0', padding: 0, listStyleType: 'none' }}>
                        {slideIndicators(slides)}
                    </ol>

                    <div className="carousel-inner">
                        {slideItem(slides)}
                    </div>

                    <a className="carousel-control-prev" href={`#bBlocksSlider-${cId}`} role="button" data-slide="prev" style={{ width: '75px' }}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">{__('Previous', 'b-blocks')}</span>
                    </a>
                    <a className="carousel-control-next" href={`#bBlocksSlider-${cId}`} role="button" data-slide="next" style={{ width: '75px' }}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">{__('Next', 'b-blocks')}</span>
                    </a>
                </div>
            </div>
        )
    }
}
const deprecated = [v1];

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
    pageRadius: { type: 'number', default: 50 },
    pageRadiusType: { type: 'string', default: '%' },
    isPrevNext: { type: 'boolean', default: true },
    prevNextColor: { type: 'string', default: '#fff' },

    contentAlign: { type: 'string', default: 'center' },

    isHead: { type: 'boolean', default: true },
    headFontSize: { type: 'number', default: 25 },
    headColor: { type: 'string', default: '#fff' },
    headMB: { type: 'number', default: 15 },

    isDesc: { type: 'boolean', default: true },
    descFontSize: { type: 'number', default: 15 },
    descColor: { type: 'string', default: '#fff' },
    descMB: { type: 'number', default: 15 },

    isBtn: { type: 'boolean', default: true },
    btnFontSize: { type: 'number', default: 16 },
    btnColor: { type: 'string', default: '#fff' },
    btnBGColor: { type: 'string', default: '#ff4500' },
    btnHovColor: { type: 'string', default: '#fff' },
    btnHovBGColor: { type: 'string', default: '#ff7500' },
    btnPTB: { type: 'number', default: 15 },
    btnPLR: { type: 'number', default: 25 },
    btnRadius: { type: 'number', default: 3 },
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
        const { cId, slides = [], columns = { desktop: 1, tablet: 1, mobile: 1 }, columnGap = 15, sliderHeight, BGOverlayColor, isLoop = true, isAutoplay = true, speed = 1, isFade = false, isTouchMove = false, isPage = true, isPageClickable = true, isPageDynamic = true, pageColor = '#fff', pageWidth = 15, pageHeight = 15, pageRadius = 50, pageRadiusType = '%', isPrevNext = true, prevNextColor = '#fff', contentAlign, isHead = true, headFontSize, headColor, headMB, isDesc = false, descFontSize, descColor, descMB, isBtn = true, btnFontSize = 16, btnColor = '#fff', btnBGColor = '#ff4500', btnHovColor = '#fff', btnHovBGColor = '#ff7500', btnPTB = 15, btnPLR = 25, btnRadius = 3 } = props.attributes;

        return <div className={`bBlocksSlider h-${sliderHeight}-px`} id={`bBlocksSlider-${cId}`} data-swiper={`{"columns": ${JSON.stringify(columns)}, "columnGap": ${columnGap}, "isLoop": ${isLoop}, "isAutoplay": ${isAutoplay}, "speed": ${speed}, "isFade": ${isFade}, "isTouchMove": ${isTouchMove}, "isPageClickable": ${isPageClickable}, "isPageDynamic": ${isPageDynamic}}`} data-colors={`{"btnColor": "${btnColor}", "btnBGColor": "${btnBGColor}", "btnHovColor": "${btnHovColor}", "btnHovBGColor": "${btnHovBGColor}"}`}>

            <div className='slider'>
                <div className='swiper-wrapper'>
                    {slides.map((item, index) => {
                        const { img, title, description, btnText = 'Click Me', btnLink = '#' } = item;

                        return <div key={index} className={`swiper-slide`} style={{ background: `url(${img}) center center / cover no-repeat ${BGOverlayColor}` }}>
                            <div className={`sliderContent text-${contentAlign}`}>
                                {isHead && title && <h2 className={`sliderTitle fontSize-${headFontSize} mb-${headMB}`} style={{ color: headColor }}>{title}</h2>}
                                {isDesc && description && <p className={`sliderDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }}>{description}</p>}

                                {isBtn && btnText && <a href={btnLink} className={`sliderBtn fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} radius-${btnRadius}-px`} style={{ color: btnColor, backgroundColor: btnBGColor }} target='_blank' rel='noreferrer noopener'>{btnText}</a>}
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

            <style dangerouslySetInnerHTML={{
                __html: `                    
                #bBlocksSlider-${cId} .slider .swiper-pagination .swiper-pagination-bullet{
                    background: ${pageColor};
                    width: ${pageWidth}px;
                    height: ${pageHeight}px;
                    border-radius: ${pageRadius}${pageRadiusType};
                }
                #bBlocksSlider-${cId} .slider .swiper-pagination .swiper-pagination-bullet:focus{
                    outline: 0;
                }
                
                #bBlocksSlider-${cId} .slider .swiper-button-prev, .swiper-button-next{
                    color: ${prevNextColor};
                }
            `}} />
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