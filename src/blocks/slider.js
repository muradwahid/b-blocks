const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette, MediaUpload } = wp.blockEditor;
const { PanelBody, Button, ButtonGroup, ToggleControl, RangeControl, Tooltip, IconButton } = wp.components;


// Variables
import options from '../Const/options';
const { colors, hTags, aligns, sizeTypes } = options;


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

    // Custom Attributes
    attributes: {
        slides: { type: 'array' },

        sliderWidth: { type: 'number', default: 100 },
        sliderWidthType: { type: 'string', default: '%' },
        sliderHeight: { type: 'number', default: 350 },
        BGOverlayColor: { type: 'string', default: '#4527a4' },
        BGOverlayOpacity: { type: 'number', default: .4 },
        slideInterval: { type: 'number', default: 3 },
        slideFade: { type: 'boolean', default: false },

        contentAlign: { type: 'string', default: 'center' },
        contentColor: { type: 'string', default: '#fff' },

        headTag: { type: 'string', default: 'h3' },

        indicatorColor: { type: 'string', default: '#fff' },
        indicatorWidth: { type: 'number', default: 15 },
        indicatorHeight: { type: 'number', default: 15 },
        indicatorRadius: { type: 'number', default: 50 },
        indicatorRadiusType: { type: 'string', default: '%' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { slides = [], sliderWidth, sliderWidthType, sliderHeight, BGOverlayColor, BGOverlayOpacity, slideInterval, slideFade, contentAlign, contentColor, headTag, indicatorColor, indicatorWidth, indicatorHeight, indicatorRadius, indicatorRadiusType }, setAttributes, clientId, isSelected } = props;

        // Styles
        const sliderStyle = { width: `${sliderWidth}${sliderWidthType}` }

        const slideItemStyle = { position: 'relative', minHeight: `${sliderHeight < 350 ? sliderHeight : 350}px`, height: `${sliderHeight}px` }

        const overlayOpacityStyle = { position: 'absolute', width: '100%', height: '100%', left: 0, right: 0, backgroundColor: BGOverlayColor, opacity: BGOverlayOpacity };

        const captionStyle = { textAlign: contentAlign, color: contentColor, bottom: '60px' }

        const mediaUpStyle = { color: contentColor, fontSize: '20px' }

        const sliderIndicatorsStyle = { backgroundColor: indicatorColor, width: `${indicatorWidth}px`, height: `${indicatorHeight}px`, borderRadius: `${indicatorRadius}${indicatorRadiusType}` }

        const slideIndicators = value => {
            return (
                value.sort((a, b) => a.index - b.index).map(slide => {
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
                value.sort((a, b) => a.index - b.index).map(slide => {
                    const { index, img, title, description } = slide;
                    const active = index == 0 ? true : false;

                    return (
                        <div className={`carousel-item ${active ? 'active' : ''}`} data-interval={slideInterval * 1000} style={slideItemStyle}>
                            <div style={overlayOpacityStyle}></div>

                            {isSelected && <Button icon="no-alt" className="b_blocks_remove_slide_btn" title="Remove this slide" onClick={() => {
                                const newSlide = slides.filter(item => item.index != index).map(i => {
                                    if (i.index > index) i.index -= 1;
                                    return i;
                                });
                                setAttributes({ slides: newSlide });
                            }} />}


                            {img && <img src={img} className="b_blocks_slider_img w-100" alt="" />}

                            <div className="carousel-caption" style={captionStyle}>
                                {isSelected && <div style={{ textAlign: 'center', marginBottom: '75px' }}>
                                    <MediaUpload type="image" value={img} onSelect={cng => {
                                        const newObj = Object.assign({}, slide, { img: cng.url });
                                        setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                    }} render={({ open }) =>
                                        img ? <IconButton icon="controls-repeat" onClick={open} style={mediaUpStyle}>Replace Slide Image</IconButton> : <IconButton icon="upload" onClick={open} style={mediaUpStyle}>Upload Slide Image</IconButton>} />
                                </div>}

                                <div className="d-none d-md-block">
                                    <RichText tagName={headTag} placeholder="Enter the title" value={title} onChange={cng => {
                                        const newObj = Object.assign({}, slide, { title: cng });
                                        setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                    }} style={{ color: contentColor }} />

                                    <RichText tagName="p" placeholder="Enter the description" value={description} onChange={cng => {
                                        const newObj = Object.assign({}, slide, { description: cng });
                                        setAttributes({ slides: [...slides.filter(item => item.index != index), newObj] });
                                    }} style={{ color: contentColor }} />
                                </div>
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
                    {/* Slider Width */}
                    {firstTitle('Slider Width:')}
                    <ButtonGroup className="b_blocks_button_groups b_blocks_size_type">
                        {Object.values(sizeTypes).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isSmall isPrimary={sliderWidthType === obj.value} aria-pressed={sliderWidthType === obj.value} onClick={() => setAttributes({ sliderWidthType: obj.value, sliderWidth: obj.def })}>{obj.value}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>
                    <RangeControl value={sliderWidth} onChange={cng => setAttributes({ sliderWidth: cng })} min={0} max={("%" == sliderWidthType) ? 100 : 1500} step={1} />

                    {/* Slider Height */}
                    {otherTitle('Slider Height')}
                    <RangeControl value={sliderHeight} onChange={cng => setAttributes({ sliderHeight: cng })} min={0} max={900} step={1} />

                    {/* Background Overlay Color */}
                    {otherTitle('Background Overlay Color:')}
                    <ColorPalette value={BGOverlayColor} onChange={cng => setAttributes({ BGOverlayColor: cng })} colors={colors} />

                    {/* Background Overlay Opacity */}
                    {otherTitle('Background Overlay Opacity:')}
                    <RangeControl value={BGOverlayOpacity} onChange={cng => setAttributes({ BGOverlayOpacity: cng })} min={0} max={1} step={.1} />

                    {/* Slide Interval */}
                    {otherTitle('Slide Interval:')}
                    <RangeControl value={slideInterval} onChange={cng => setAttributes({ slideInterval: cng })} min={0} max={15} step={.1} />

                    {/* Slide Fade Effect */}
                    {otherTitle('Slide Fade Effect:')}
                    <ToggleControl label={slideFade ? 'Disable Slide Fade Effect' : 'Enable Slide Fade Effect'} checked={slideFade} onChange={cng => setAttributes({ slideFade: cng })} />
                </PanelBody>


                {/* Content Settings */}
                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Alignment */}
                    {firstTitle('Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={contentAlign === obj.value} aria-pressed={contentAlign === obj.value} onClick={() => setAttributes({ contentAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={contentColor} onChange={cng => setAttributes({ contentColor: cng })} colors={colors} />

                    {/* Heading Tag */}
                    {otherTitle('Heading Tag:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(hTags).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={headTag === obj.value} aria-pressed={headTag === obj.value} onClick={() => setAttributes({ headTag: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>
                </PanelBody>


                <PanelBody title="Indicator Settings" initialOpen={false}>
                    {/* Color */}
                    {firstTitle('Color:')}
                    <ColorPalette value={indicatorColor} onChange={cng => setAttributes({ indicatorColor: cng })} colors={colors} />

                    {/* Width */}
                    {otherTitle('Width:')}
                    <RangeControl value={indicatorWidth} onChange={cng => setAttributes({ indicatorWidth: cng })} min={0} max={150} step={1} />

                    {/* Height */}
                    {otherTitle('Height:')}
                    <RangeControl value={indicatorHeight} onChange={cng => setAttributes({ indicatorHeight: cng })} min={0} max={50} step={1} />

                    {/* Border Radius */}
                    {otherTitle('Border Radius:')}
                    <ButtonGroup className="b_blocks_button_groups b_blocks_size_type">
                        {Object.values(sizeTypes).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isSmall isPrimary={indicatorRadiusType === obj.value} aria-pressed={indicatorRadiusType === obj.value} onClick={() => setAttributes({ indicatorRadiusType: obj.value })}>{obj.value}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>
                    <RangeControl value={indicatorRadius} onChange={cng => setAttributes({ indicatorRadius: cng })} min={0} max={50} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_slider">
                <div id={`bBlocksSlider-${clientId}`} className={`carousel slide ${slideFade ? 'carousel-fade' : ''}`} data-ride="carousel" style={sliderStyle}>
                    <ol className="carousel-indicators" style={{ marginLeft: 0, paddingLeft: 0, listStyleType: 'none' }}>
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

                {isSelected && <Button icon="plus-alt" onClick={title => { setAttributes({ slides: [...slides, { index: slides.length }] }) }} style={{ color: '#4527a4', fontSize: '18px' }}>Add New Slide</Button>}
            </div>
        ])
    },

    save: props => {
        const { attributes: { slides, sliderWidth, sliderWidthType, sliderHeight, BGOverlayColor, BGOverlayOpacity, slideInterval, slideFade, contentAlign, contentColor, headTag, indicatorColor, indicatorWidth, indicatorHeight, indicatorRadius, indicatorRadiusType }, clientId } = props;

        // Styles
        const sliderStyle = { width: `${sliderWidth}${sliderWidthType}` }

        const slideItemStyle = { position: 'relative', minHeight: `${sliderHeight < 250 ? sliderHeight : 250}px`, height: `${sliderHeight}px` }

        const overlayOpacityStyle = { position: 'absolute', width: '100%', height: '100%', left: 0, right: 0, backgroundColor: BGOverlayColor, opacity: BGOverlayOpacity };

        const captionStyle = { textAlign: contentAlign, color: contentColor, bottom: '60px' }

        const sliderIndicatorsStyle = { backgroundColor: indicatorColor, width: `${indicatorWidth}px`, height: `${indicatorHeight}px`, borderRadius: `${indicatorRadius}${indicatorRadiusType}` }

        const slideIndicators = value => {
            return (
                value.sort((a, b) => a.index - b.index).map(slide => {
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
                value.sort((a, b) => a.index - b.index).map(slide => {
                    const { index, img, title, description } = slide;
                    const active = index == 0 ? true : false;

                    return (
                        <div className={`carousel-item ${active ? 'active' : ''}`} data-interval={slideInterval * 1000} style={slideItemStyle}>
                            <div style={overlayOpacityStyle}></div>

                            {img && <img src={img} className="w-100" alt="" />}

                            <div className="carousel-caption d-none d-md-block" style={captionStyle}>
                                <RichText.Content tagName={headTag} value={title} style={{ color: contentColor }} />
                                <RichText.Content tagName="p" value={description} style={{ color: contentColor }} />
                            </div>
                        </div>
                    );
                })
            );
        }


        return (
            <div className="b_blocks_slider">
                <div id={`bBlocksSlider-${clientId}`} className={`carousel slide ${slideFade ? 'carousel-fade' : ''}`} data-ride="carousel" style={sliderStyle}>
                    <ol className="carousel-indicators" style={{ listStyleType: 'none' }}>
                        {slideIndicators(slides)}
                    </ol>

                    <div className="carousel-inner">
                        {slideItem(slides)}
                    </div>

                    <a className="carousel-control-prev" href={`#bBlocksSlider-${clientId}`} role="button" data-slide="prev" style={{ width: '75px' }}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href={`#bBlocksSlider-${clientId}`} role="button" data-slide="next" style={{ width: '75px' }}>
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