import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { RichText, InspectorControls, ColorPalette, MediaUpload } from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl, RangeControl, IconButton, FontSizePicker } from '@wordpress/components';

// Variables
import options from '../../Const/options';
const { colors, hTags, aligns, sizeTypes, fontSizes } = options;

// Components
import BtnGroup from '../../Components/BtnGroup';

// Functions
import func from '../../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../../Const/icons';

registerBlockType('b-blocks/slider', {
    // Build In attributes
    title: __('Slider', 'b-blocks'),
    description: __('Design an image and content slider', 'b-blocks'),
    icon: icons.slider,
    category: 'bBlocks',
    keywords: [__('Slider', 'b-blocks'), __('Carousel', 'b-blocks'), __('Slide', 'b-blocks')],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
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
        indicatorRadiusType: { type: 'string', default: '%' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { slides = [], sliderWidth, sliderWidthType, sliderHeight, BGOverlayColor, BGOverlayOpacity, slideInterval, slideFade, contentAlign, headTag, headColor, headFontSize, headMB, descColor, descFontSize, descMB, indicatorColor, indicatorWidth, indicatorHeight, indicatorRadius, indicatorRadiusType }, setAttributes, clientId, isSelected } = props;

        // Styles
        const sliderStyle = { width: `${sliderWidth}${sliderWidthType}` }

        const slideItemStyle = { position: 'relative', minHeight: `${sliderHeight < 350 ? sliderHeight : 350}px`, height: `${sliderHeight}px` }

        const overlayOpacityStyle = { position: 'absolute', width: '100%', height: '100%', left: 0, right: 0, backgroundColor: BGOverlayColor, opacity: BGOverlayOpacity };

        const captionStyle = { textAlign: contentAlign, bottom: '60px' }

        const mediaUpStyle = { color: '#4527a4', fontWeight: 'bold' }

        const sliderIndicatorsStyle = { backgroundColor: indicatorColor, width: `${indicatorWidth}px`, height: `${indicatorHeight}px`, borderRadius: `${indicatorRadius}${indicatorRadiusType}` }

        // Functions
        useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

        // Components
        const slideIndicators = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(slide => {
                    const { index } = slide;
                    const active = index == 0 ? true : false;

                    return (
                        <li key={slide.index} data-target={`#bBlocksSlider-${clientId}`} data-slide-to={index} className={active ? 'active' : ''} style={sliderIndicatorsStyle}></li>
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

                            {isSelected && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', marginTop: '30px', zIndex: 10 }}>
                                <MediaUpload allowedTypes={['image']} value={img} onSelect={cng => {
                                    const newObj = Object.assign({}, slide, { img: cng.url });
                                    setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                }} render={({ open }) =>
                                    img ? <div className="b_blocks_media_control">
                                        <IconButton icon="controls-repeat" onClick={open} style={mediaUpStyle}>{__('Replace Slide Image', 'b-blocks')}</IconButton>
                                    </div> : <div className="b_blocks_media_control">
                                        <IconButton icon="upload" onClick={open} style={mediaUpStyle}>{__('Upload Slide Image', 'b-blocks')}</IconButton>
                                    </div>} />
                            </div>}

                            {isSelected && <Button icon="no-alt" className="b_blocks_remove_slide_btn" title={__('Remove this slide', 'b-blocks')} onClick={() => {
                                const newSlide = slides.filter(item => item.index != index).map(i => {
                                    if (i.index > index) i.index--;
                                    if (i.index <= index) document.querySelectorAll(`#bBlocksSlider-${clientId} .carousel-item`)[0].classList.add('active');
                                    return i;
                                });
                                setAttributes({ slides: newSlide });
                            }} />}

                            {img && <img src={img} className="b_blocks_slider_img w-100" alt="" />}

                            <div className="carousel-caption" style={captionStyle}>
                                <RichText tagName={headTag} placeholder={__('Enter the title', 'b-blocks')} value={title} onChange={cng => {
                                    const newObj = Object.assign({}, slide, { title: cng });
                                    setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                }} inlineToolbar style={{ color: headColor, fontSize: `${headFontSize}px`, margin: `0 0 ${headMB}px 0` }} />

                                <RichText tagName="p" placeholder={__('Enter the description', 'b-blocks')} value={description} onChange={cng => {
                                    const newObj = Object.assign({}, slide, { description: cng });
                                    setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                }} inlineToolbar style={{ color: descColor, fontSize: `${descFontSize}px`, margin: `0 0 ${descMB}px 0` }} />
                            </div>
                        </div>
                    );
                })
            );
        }

        return <>
            <InspectorControls>
                {/* Slider Settings */}
                <PanelBody className='bBlocksPanelBody' title={__('Slider Settings', 'b-blocks')} initialOpen={true}>
                    {/* Width */}
                    {firstTitle('Width:')}
                    <BtnGroup options={sizeTypes} myValue={sliderWidthType} setState={(cng, def) => setAttributes({ sliderWidthType: cng, sliderWidth: def })} classes="bBlocksSizeType" size="small" />

                    <RangeControl value={sliderWidth} onChange={cng => setAttributes({ sliderWidth: cng })} min={0} max={("%" == sliderWidthType) ? 100 : 1920} step={1} />

                    {/* Height */}
                    {otherTitle('Height')}
                    <RangeControl value={sliderHeight} onChange={cng => setAttributes({ sliderHeight: cng })} min={0} max={1000} step={1} />

                    {/* Background Overlay Color */}
                    {otherTitle('Background Overlay Color:')}
                    <ColorPalette value={BGOverlayColor} onChange={cng => setAttributes({ BGOverlayColor: cng })} colors={colors} />

                    {/* Background Overlay Opacity */}
                    {otherTitle('Background Overlay Opacity:')}
                    <RangeControl value={BGOverlayOpacity} onChange={cng => setAttributes({ BGOverlayOpacity: cng })} min={0} max={1} step={.1} />

                    {/* Slide Interval */}
                    {otherTitle('Slide Interval:')}
                    <RangeControl value={slideInterval} onChange={cng => setAttributes({ slideInterval: cng })} min={0} max={20} step={.1} />

                    {/* Slide Fade Effect */}
                    {otherTitle('Slide Fade Effect:')}
                    <ToggleControl label={slideFade ? 'Disable Slide Fade Effect' : 'Enable Slide Fade Effect'} checked={slideFade} onChange={cng => setAttributes({ slideFade: cng })} />
                </PanelBody>


                {/* Content Settings */}
                <PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
                    {/* Text Align */}
                    {firstTitle('Text Align:')}
                    <BtnGroup options={aligns} myValue={contentAlign} setState={cng => setAttributes({ contentAlign: cng })} icon={true} />
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody className='bBlocksPanelBody' title={__('Heading Settings', 'b-blocks')} initialOpen={false}>
                    {/* Tag */}
                    {firstTitle('Tag:')}
                    <BtnGroup options={hTags} myValue={headTag} setState={(cng, def) => setAttributes({ headTag: cng, headFontSize: def })} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={25} value={headFontSize} onChange={cng => setAttributes({ headFontSize: 'undefined' === typeof cng ? 25 : cng })} />

                    {/* Margin Bottom */}
                    {otherTitle('Margin Bottom:')}
                    <RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={100} step={1} />
                </PanelBody>


                {/* Description Settings */}
                <PanelBody className='bBlocksPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                    {/* Color */}
                    {firstTitle('Color:')}
                    <ColorPalette value={descColor} onChange={cng => setAttributes({ descColor: cng })} colors={colors} />

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={descFontSize} onChange={cng => setAttributes({ descFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                    {/* Margin Bottom */}
                    {otherTitle('Margin Bottom:')}
                    <RangeControl value={descMB} onChange={cng => setAttributes({ descMB: cng })} min={0} max={100} step={1} />
                </PanelBody>


                <PanelBody className='bBlocksPanelBody' title={__('Indicator Settings', 'b-blocks')} initialOpen={false}>
                    {/* Color */}
                    {firstTitle('Color:')}
                    <ColorPalette value={indicatorColor} onChange={cng => setAttributes({ indicatorColor: cng })} colors={colors} />

                    {/* Width */}
                    {otherTitle('Width:')}
                    <RangeControl value={indicatorWidth} onChange={cng => setAttributes({ indicatorWidth: cng })} min={0} max={200} step={1} />

                    {/* Height */}
                    {otherTitle('Height:')}
                    <RangeControl value={indicatorHeight} onChange={cng => setAttributes({ indicatorHeight: cng })} min={0} max={100} step={1} />

                    {/* Border Radius */}
                    {otherTitle('Border Radius:')}
                    <BtnGroup options={sizeTypes} myValue={indicatorRadiusType} setState={cng => setAttributes({ indicatorRadiusType: cng })} classes="bBlocksSizeType" size="small" />

                    <RangeControl value={indicatorRadius} onChange={cng => setAttributes({ indicatorRadius: cng })} min={0} max={50} step={1} />
                </PanelBody>
            </InspectorControls>


            <div className="b_blocks_slider">
                <div id={`bBlocksSlider-${clientId}`} className={`carousel slide ${slideFade ? 'carousel-fade' : ''}`} data-ride="carousel" style={sliderStyle}>
                    <ol className="carousel-indicators" style={{ margin: '0 0 25px 0', padding: 0, listStyleType: 'none' }}>
                        {slideIndicators(slides)}
                    </ol>

                    <div className="carousel-inner">
                        {slideItem(slides)}
                    </div>

                    <a className="carousel-control-prev" href={`#bBlocksSlider-${clientId}`} role="button" data-slide="prev" style={{ width: '75px', height: '100px', margin: 'auto 0' }}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">{__('Previous', 'b-blocks')}</span>
                    </a>
                    <a className="carousel-control-next" href={`#bBlocksSlider-${clientId}`} role="button" data-slide="next" style={{ width: '75px', height: '100px', margin: 'auto 0' }}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">{__('Next', 'b-blocks')}</span>
                    </a>
                </div>

                {!slides.length || isSelected ? <div className="b_blocks_add_item" style={{ left: '50%', transform: 'translateX(-50%)' }}><Button icon="plus-alt" onClick={() => { setAttributes({ slides: [...slides, { index: slides.length }] }) }} >{__('Add New Slide', 'b-blocks')}</Button></div> : null}
            </div>
        </>
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
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});