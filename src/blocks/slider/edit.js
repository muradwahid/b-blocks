import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, Button, ToolbarItem, Dashicon, TextControl, TextareaControl, ToggleControl, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Swiper JS
import Swiper from 'swiper/bundle';

// Variables
import BColor from '../../GutenComp/BColor';
import BDevice from '../../GutenComp/BDevice';
import Title from '../../GutenComp/Title';
import Typography from '../../GutenComp/Typography';
import BorderControl from '../../GutenComp/BorderControl';
import SpaceControl from '../../GutenComp/SpaceControl';
import ColorsControl from '../../GutenComp/ColorsControl';
import options from '../../Const/options';
const { pxUnit, emUnit, vwUnit } = options;

const Edit = props => {
    const { className, attributes: { align, slides = [], columns, columnGap, sliderHeight, bgOverlay, isLoop, isAutoplay, speed, isFade, isTouchMove, isPage, isPageClickable, isPageDynamic, pageColor, pageWidth, pageHeight, pageBorder, isPrevNext, prevNextColor, textAlign, isTitle, titleTypo, titleColor, titleMargin, isDesc, descTypo, descColor, descMargin, isBtn, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder }, setAttributes, clientId } = props;

    const [device, setDevice] = useState('desktop');

    // Functions
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    const currentBlock = document.querySelector(`#block-${clientId} .wp-block`);
    const isEditorSidebarOpened = wp.data.select('core/edit-post').isEditorSidebarOpened();

    // Swiper Scripts
    useEffect(() => {
        const currentSlider = document.querySelector(`#bBlocksSlider-${clientId} .bBlocksSlider`);

        const condition = currentSlider && currentBlock;

        condition ? currentBlock.style.display = 'block' : 'initial';
        align == 'full' && condition ? currentBlock.style.maxWidth = 'none' : '';
        align == 'wide' && condition ? currentBlock.style.maxWidth = 'none' : '';
        align == '' && condition ? currentBlock.style.maxWidth = '' : '';

        condition && isEditorSidebarOpened ? currentBlock.style.display = 'grid' : '';

        condition ? currentSlider.style.width = `${currentBlock.clientWidth}px` : '';

        new Swiper(`#bBlocksSlider-${clientId} .bBlocksSlider`, {
            // Optional parameters
            direction: 'horizontal',
            slidesPerView: columns?.mobile,
            breakpoints: {
                // when window width is >= 576px
                576: {
                    slidesPerView: columns?.tablet,
                },
                // when window width is >= 768px
                768: {
                    slidesPerView: columns?.desktop,
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
    }, [align, slides, columns, columnGap, sliderHeight, isEditorSidebarOpened, currentBlock, isLoop, isAutoplay, speed, isFade, isTouchMove, isPage, isPageClickable, isPageDynamic, isPrevNext]);

    const updateSlide = (index, type, val) => {
        const newSlides = [...slides];
        newSlides[index][type] = val;
        setAttributes({ slides: newSlides });
    }

    return <>
        <InspectorControls>
            <PanelBody title={__('Add or Remove Slides', 'b-blocks')} className='addRemoveSlides'>
                {slides.map((item, index) => {
                    const { img, title, description, btnText, btnLink } = item;

                    return <div key={index} className={`slideItem`}>
                        <PanelRow className={`slideTitle ${0 !== index && 'mt-20p'}`}>
                            <Title mt='5px'><span className='fontSize-16'>{__(`Slide No ${index + 1}:`, 'b-blocks')}</span></Title>

                            <Button label={__('Remove Slide', 'b-blocks')} onClick={e => {
                                e.preventDefault();
                                setAttributes({ slides: [...slides.slice(0, index), ...slides.slice(index + 1)] });
                            }} ><Dashicon icon='no' size={23} className={`fontSize-23`} />{__('Remove', 'b-blocks')}</Button>
                        </PanelRow>

                        <Title mt='0'>{__('Image:', 'b-blocks')}</Title>
                        <div className='editImageHolder'>
                            <div className='mediaControl'>
                                <MediaUpload allowedTypes={['image']} value={img} onSelect={val => updateSlide(index, 'img', val.url)} render={({ open }) => <div className='btnControl'>
                                    {img ? <>
                                        <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
                                        <Button icon='exit' onClick={() => updateSlide(index, 'img', '')} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
                                    </> : <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>}
                                </div>} />
                            </div>

                            <img src={img} alt='' />
                        </div>

                        <div className='content'>
                            <PanelRow className='mb-5p'>
                                <Title mt='0' mb='0'>{__('Title:', 'b-blocks')}</Title>
                                <TextControl value={title} onChange={val => updateSlide(index, 'title', val)} placeholder={__('Slide Title', 'b-blocks')} />
                            </PanelRow>

                            <Title mt='0'>{__('Description:', 'b-blocks')}</Title>
                            <TextareaControl value={description} onChange={val => updateSlide(index, 'description', val)} placeholder={__('Description of the slider', 'b-blocks')} />

                            <PanelRow className='mb-5p'>
                                <Title mt='0' mb='0'>{__('Button Text:', 'b-blocks')}</Title>
                                <TextControl value={btnText} onChange={val => updateSlide(index, 'btnText', val)} placeholder={__('Button Text', 'b-blocks')} />
                            </PanelRow>

                            <PanelRow className='mb-5p'>
                                <Title mt='0' mb='0'>{__('Button Link:', 'b-blocks')}</Title>
                                <TextControl value={btnLink} onChange={val => updateSlide(index, 'btnLink', val)} placeholder={__('Button Link', 'b-blocks')} />
                            </PanelRow>
                        </div>
                    </div>
                })}

                <div className='addSlide'>
                    <Button label={__('Add New Slide', 'b-blocks')} onClick={() => setAttributes({ slides: [...slides, { img: '', title: 'Slide Title', description: 'Description of slide', btnText: 'Click Me', btnLink: '#' }] })} ><Dashicon icon='plus' size={23} className={`fontSize-23`} />{__('Add New Slide', 'b-blocks')}</Button>
                </div>
            </PanelBody>

            <PanelBody title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
                {/* Columns */}
                <PanelRow>
                    <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                    <BDevice device={device} onChange={val => setDevice(val)} />
                </PanelRow>
                <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                {/* Column Gap */}
                <Title>{__('Column Gap:', 'b-blocks')}</Title>
                <RangeControl value={columnGap} onChange={val => setAttributes({ columnGap: val })} min={0} max={100} step={1} beforeIcon='arrow-right-alt' />

                {/* Height */}
                <UnitControl className='mt-20p mb-5p' label={__('Height:', 'b-blocks')} labelPosition='left' value={sliderHeight} onChange={val => setAttributes({ sliderHeight: val })} units={pxUnit, emUnit, vwUnit} />

                {/* Background Overlay Color */}
                <BColor className='mt-20p mb-5p' label={__('Background Overlay Color:', 'b-blocks')} value={bgOverlay} onChange={val => setAttributes({ bgOverlay: val })} defaultColor='#00000080' />
            </PanelBody>

            <PanelBody title={__('Slider Settings', 'b-blocks')} initialOpen={false}>
                {/* Loop */}
                <Title mt='0'>{__('Loop:', 'b-blocks')}</Title>
                <ToggleControl label={isLoop ? 'Disable Loop' : 'Enable Loop'} checked={isLoop} onChange={val => setAttributes({ isLoop: val })} />

                {/* Autoplay */}
                <Title mt='0'>{__('Autoplay:', 'b-blocks')}</Title>
                <ToggleControl label={isAutoplay ? 'Disable Autoplay' : 'Enable Autoplay'} checked={isAutoplay} onChange={val => setAttributes({ isAutoplay: val })} />

                {isAutoplay && <>
                    {/* Speed */}
                    <Title>{__('Speed:', 'b-blocks')}</Title>
                    <RangeControl value={speed} onChange={val => setAttributes({ speed: val })} min={0} max={10} step={.05} />
                </>}

                {/* Fade */}
                <Title>{__('Fade:', 'b-blocks')}</Title>
                <ToggleControl label={isFade ? 'Disable Fade Effect' : 'Enable Fade Effect'} help={columns?.desktop !== 1 ? 'To enable fade effect please set 1 column' : ''} checked={isFade} onChange={val => setAttributes({ isFade: val })} />

                {/* Draggable */}
                <Title>{__('Draggable:', 'b-blocks')}</Title>
                <ToggleControl label={isTouchMove ? 'Disable Draggable' : 'Enable Draggable'} checked={isTouchMove} onChange={val => setAttributes({ isTouchMove: val })} />


                {/* Pagination */}
                <Title>{__('Pagination:', 'b-blocks')}</Title>
                <ToggleControl label={isPage ? 'Hide Pagination' : 'Show Pagination'} checked={isPage} onChange={val => setAttributes({ isPage: val })} />

                {isPage && <>
                    <ToggleControl label={isPageClickable ? 'Disable Pagination Clickable' : 'Enable Pagination Clickable'} checked={isPageClickable} onChange={val => setAttributes({ isPageClickable: val })} />

                    <ToggleControl label={isPageDynamic ? 'Disable Pagination Dynamic Bullets' : 'Enable Pagination Dynamic Bullets'} checked={isPageDynamic} onChange={val => setAttributes({ isPageDynamic: val })} />

                    <BColor className='mt-20p mb-5p' label={__('Pagination Bullets Color:', 'b-blocks')} value={pageColor} onChange={val => setAttributes({ pageColor: val })} defaultColor='#fff' />

                    <UnitControl className='mt-20p mb-5p' label={__('Width:', 'b-blocks')} labelPosition='left' value={pageWidth} onChange={val => setAttributes({ pageWidth: val })} units={pxUnit, emUnit} />

                    <UnitControl className='mt-20p mb-5p' label={__('Height:', 'b-blocks')} labelPosition='left' value={pageHeight} onChange={val => setAttributes({ pageHeight: val })} units={pxUnit, emUnit} />

                    <BorderControl label={__('Pagination Border:', 'b-blocks')} border={pageBorder} onChange={val => setAttributes({ pageBorder: val })} defaults={{ radius: '50%' }} />
                </>}


                {/* Preview Next Button */}
                <Title>{__('Preview Next Button:', 'b-blocks')}</Title>
                <ToggleControl label={isPrevNext ? 'Hide Preview Next Button' : 'Show Preview Next Button'} checked={isPrevNext} onChange={val => setAttributes({ isPrevNext: val })} />

                <BColor className='mt-20p mb-5p' label={__('Preview Next Button Color:', 'b-blocks')} value={prevNextColor} onChange={val => setAttributes({ prevNextColor: val })} defaultColor='#fff' />
            </PanelBody>

            <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isTitle ? 'Hide Title' : 'Show Title'} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

                {/* Typography */}
                <Typography className='mt-20p mb-5p' typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 25 }} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#fff' />

                {/* Margin */}
                <SpaceControl className='mt-20p mb-5p' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
            </PanelBody>

            <PanelBody title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isDesc ? 'Hide Description' : 'Show Description'} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                {/* Typography */}
                <Typography className='mt-20p mb-5p' typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#fff' />

                {/* Margin */}
                <SpaceControl className='mt-20p mb-5p' label={__('Margin:', 'b-blocks')} space={descMargin} onChange={val => setAttributes({ descMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
            </PanelBody>

            <PanelBody title={__('Button Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isBtn ? 'Hide Button' : 'Show Button'} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

                {/* Typography */}
                <Typography className='mt-20p mb-5p' typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 16 }} />

                {/* Padding */}
                <SpaceControl className='mt-20p mb-5p' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '35px' }} />

                {/* Colors */}
                <Title>{__('Colors:', 'b-blocks')}</Title>
                <TabPanel className='b_blocks_tab_panel' activeClass='activeTab' tabs={[{ name: 'normal', title: __('Normal', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover', 'b-blocks'), className: 'hover-tab', }]}>
                    {tab => <>
                        {'normal' == tab.name && <>
                            {/* Colors */}
                            <ColorsControl colors={btnColors} onChange={val => setAttributes({ btnColors: val })} defaults={{ color: '#fff', bg: '#ff4500' }} />
                        </>}

                        {'hover' == tab.name && <>
                            {/* Hover Colors */}
                            <ColorsControl colors={btnHovColors} onChange={val => setAttributes({ btnHovColors: val })} defaults={{ color: '#fff', bg: '#ff7500' }} />
                        </>}
                    </>}
                </TabPanel>

                <BorderControl label={__('Border:', 'b-blocks')} border={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '3px' }} />
            </PanelBody>

        </InspectorControls>


        <BlockControls>
            <ToolbarItem>
                <Button className='components-icon-button components-toolbar__control' label={__('Add New Slide', 'b-blocks')} onClick={() => setAttributes({ slides: [...slides, { img: '', title: 'Slide Title', description: 'Description of slide', btnText: 'Click Me', btnLink: '#' }] })} ><Dashicon icon='plus' size={23} className={`fontSize-23`} /></Button>
            </ToolbarItem>

            <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
        </BlockControls>


        <div className={className} id={`bBlocksSlider-${clientId}`}>

            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${titleTypo?.googleFontLink});
                @import url(${descTypo?.googleFontLink});
                @import url(${btnTypo?.googleFontLink});

                #bBlocksSlider-${clientId}{
                    height: ${sliderHeight}
                }

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
                    ${btnColors?.styles || 'color: #fff; background: #ff4500;'}
                    ${btnTypo?.styles || 'font-size: 16px;'}
                    padding: ${btnPadding?.styles || '12px 35px'};
                    ${btnBorder?.styles || 'border-radius: 3px;'}
                }
                #bBlocksSlider-${clientId} .bBlocksSlider .slide .sliderBtn:hover{
                    ${btnHovColors?.styles || 'color: #fff; background: #ff7500;'}
                }

                #bBlocksSlider-${clientId} .bBlocksSlider .swiper-pagination .swiper-pagination-bullet{
                    background: ${pageColor};
                    width: ${pageWidth};
                    height: ${pageHeight};
                    ${pageBorder?.styles || 'border-radius: 50%;'}
                }
                
                #bBlocksSlider-${clientId} .bBlocksSlider .swiper-button-prev, #bBlocksSlider-${clientId} .bBlocksSlider .swiper-button-next{color: ${prevNextColor};}
            `}} />

            <div className='bBlocksSlider'>
                <div className='swiper-wrapper'>
                    {slides.map((item, index) => {
                        const { img, title, description, btnText, btnLink } = item;

                        return <div key={index} className={`slide slide-${index} swiper-slide`}>
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                #bBlocksSlider-${clientId} .bBlocksSlider .slide-${index}{
                                    background: url(${img}) center center / cover no-repeat ${bgOverlay};
                                }
                            `}} />

                            <div className={`sliderContent text-${textAlign}`}>
                                {isTitle && title && <h2 className='sliderTitle'>{title}</h2>}
                                {isDesc && description && <p className='sliderDescription'>{description}</p>}

                                {isBtn && btnText && <a href={btnLink} className='sliderBtn' target='_blank' rel='noreferrer noopener'>{btnText}</a>}
                            </div>
                        </div>
                    })}
                </div>

                {isPage && <div className='swiper-pagination'></div>}

                {isPrevNext && <>
                    <div className='swiper-button-prev'></div>
                    <div className='swiper-button-next'></div>
                </>}
            </div>
        </div>
    </>
};
export default Edit;