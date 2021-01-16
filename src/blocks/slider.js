const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const { RichText, InspectorControls, ColorPalette, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, ToggleControl, RangeControl, IconButton, FontSizePicker } = wp.components;

// Variables
import options from '../Const/options';
const { colors, hTags, aligns, sizeTypes, fontSizes } = options;

// Components
import BtnGroup from '../GutenComp/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/slider', {
    // Build In attributes
    title: 'Slider',
    description: 'Slider',
    icon: icons.slider,
    category: 'bBlocks',
    keywords: ['Slider', 'Carousel', 'Slide'],
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
        const { attributes: { cId, slides = [], sliderWidth, sliderWidthType, sliderHeight, BGOverlayColor, BGOverlayOpacity, slideInterval, slideFade, contentAlign, headTag, headColor, headFontSize, headMB, descColor, descFontSize, descMB, indicatorColor, indicatorWidth, indicatorHeight, indicatorRadius, indicatorRadiusType }, setAttributes, clientId, isSelected } = props;

        // Styles
        const sliderStyle = { width: `${sliderWidth}${sliderWidthType}` }

        const slideItemStyle = { position: 'relative', minHeight: `${sliderHeight < 350 ? sliderHeight : 350}px`, height: `${sliderHeight}px` }

        const overlayOpacityStyle = { position: 'absolute', width: '100%', height: '100%', left: 0, right: 0, backgroundColor: BGOverlayColor, opacity: BGOverlayOpacity };

        const captionStyle = { textAlign: contentAlign, bottom: '60px' }

        const mediaUpStyle = { color: '#4527a4', fontWeight: 'bold' }

        const sliderIndicatorsStyle = { backgroundColor: indicatorColor, width: `${indicatorWidth}px`, height: `${indicatorHeight}px`, borderRadius: `${indicatorRadius}${indicatorRadiusType}` }

        // Functions
        useEffect(() => {
            clientId && setAttributes({ cId: clientId });
        }, [clientId]);

        // Components
        const slideIndicators = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(slide => {
                    const { index } = slide;
                    const active = index == 0 ? true : false;

                    return (
                        <li data-target={`#bBlocksSlider-${clientId}`} data-slide-to={index} className={active ? 'active' : ''} style={sliderIndicatorsStyle}></li>
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
                        <div className={`carousel-item ${active ? 'active' : ''}`} data-interval={slideInterval * 1000} style={slideItemStyle}>
                            <div style={overlayOpacityStyle}></div>

                            {isSelected && <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', marginTop: '30px', zIndex: 10 }}>
                                <MediaUpload allowedTypes={['image']} value={img} onSelect={cng => {
                                    const newObj = Object.assign({}, slide, { img: cng.url });
                                    setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                }} render={({ open }) =>
                                    img ? <div className="b_blocks_media_control">
                                        <IconButton icon="controls-repeat" onClick={open} style={mediaUpStyle}>Replace Slide Image</IconButton>
                                    </div> : <div className="b_blocks_media_control">
                                            <IconButton icon="upload" onClick={open} style={mediaUpStyle}>Upload Slide Image</IconButton>
                                        </div>} />
                            </div>}

                            {isSelected && <Button icon="no-alt" className="b_blocks_remove_slide_btn" title="Remove this slide" onClick={() => {
                                const newSlide = slides.filter(item => item.index != index).map(i => {
                                    if (i.index > index) i.index--;
                                    return i;
                                });
                                setAttributes({ slides: newSlide });
                            }} />}

                            {img && <img src={img} className="b_blocks_slider_img w-100" alt="" />}

                            <div className="carousel-caption" style={captionStyle}>
                                <RichText tagName={headTag} placeholder="Enter the title" value={title} onChange={cng => {
                                    const newObj = Object.assign({}, slide, { title: cng });
                                    setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                }} inlineToolbar style={{ color: headColor, fontSize: `${headFontSize}px`, margin: `0 0 ${headMB}px 0` }} />

                                <RichText tagName="p" placeholder="Enter the description" value={description} onChange={cng => {
                                    const newObj = Object.assign({}, slide, { description: cng });
                                    setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                }} inlineToolbar style={{ color: descColor, fontSize: `${descFontSize}px`, margin: `0 0 ${descMB}px 0` }} />
                            </div>
                        </div>
                    );
                })
            );
        }

        return ([
            <InspectorControls>
                {/* Slider Settings */}
                <PanelBody title="Slider Settings" initialOpen={true}>
                    {/* Width */}
                    {firstTitle('Width:')}
                    <BtnGroup options={sizeTypes} myValue={sliderWidthType} setState={(cng, def) => setAttributes({ sliderWidthType: cng, sliderWidth: def })} classes="b_blocks_size_type" size="small" />

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
                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Text Align */}
                    {firstTitle('Text Align:')}
                    <BtnGroup options={aligns} myValue={contentAlign} setState={cng => setAttributes({ contentAlign: cng })} icon={true} />
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody title="Heading Settings" initialOpen={false}>
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
                <PanelBody title="Description Settings" initialOpen={false}>
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


                <PanelBody title="Indicator Settings" initialOpen={false}>
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
                    <BtnGroup options={sizeTypes} myValue={indicatorRadiusType} setState={(cng, def) => setAttributes({ indicatorRadiusType: cng })} classes="b_blocks_size_type" size="small" />

                    <RangeControl value={indicatorRadius} onChange={cng => setAttributes({ indicatorRadius: cng })} min={0} max={50} step={1} />
                </PanelBody>
            </InspectorControls>,


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
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href={`#bBlocksSlider-${clientId}`} role="button" data-slide="next" style={{ width: '75px', height: '100px', margin: 'auto 0' }}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
                    </a>
                </div>

                {!slides.length || isSelected ? <div style={{ textAlign: 'center' }}><Button icon="plus-alt" onClick={title => { setAttributes({ slides: [...slides, { index: slides.length }] }) }} style={{ color: '#4527a4', fontSize: '18px' }}>Add New Slide</Button></div> : null}
            </div>
        ])
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
                        <li data-target={`#bBlocksSlider-${cId}`} data-slide-to={index} className={active ? 'active' : ''} style={sliderIndicatorsStyle}></li>
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
                        <div className={`carousel-item ${active ? 'active' : ''}`} data-interval={slideInterval * 1000} style={slideItemStyle}>
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
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href={`#bBlocksSlider-${cId}`} role="button" data-slide="next" style={{ width: '75px' }}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Next</span>
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