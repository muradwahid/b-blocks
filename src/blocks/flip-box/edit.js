import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls, MediaUpload } from '@wordpress/block-editor';
import { Button, ButtonGroup, FontSizePicker, PanelBody, PanelRow, RangeControl, SelectControl, TextControl, TextareaControl, ToggleControl, Tooltip, TabPanel } from '@wordpress/components';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import options from '../../Const/options';
const { fontSizes, gradientType, radialType, borderStyles, sizeTypes } = options;

const Edit = props => {
    const { className, attributes: { cId, boxHeight, contentAlign, contentBGType, contentBGColor, contentBGImg, isContentBGOpacity, contentBGOpacityColor, contentBGGradType, contentBGGradRadialType, contentBGGradFColor, contentBGGradSColor, contentBGGradFColorPos, contentBGGradSColorPos, contentBGGradAngel, contentBGGradRadialXPos, contentBGGradRadialYPos, contentPTB, contentPLR, borderWidth, borderStyle, borderColor, borderRadius, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpreed, isImg, fImg, bImg, imgWidth, imgRadius, imgRadiusType, imgMB, fTitle, bTitle, titleFontSize, titleColor, titleMB, isDesc, desc, descFontSize, descColor, isBtn, btn, btnLink, btnFontSize, btnColor, btnBGColor, btnHovColor, btnHovBGColor, btnPTB, btnPLR, btnRadius }, setAttributes, clientId } = props;


    // Functions
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);


    // Button 
    const btnHov = e => {
        e.target.style.color = btnHovColor;
        e.target.style.backgroundColor = btnHovBGColor;
    }
    const btnHovLeave = e => {
        e.target.style.color = btnColor;
        e.target.style.backgroundColor = btnBGColor;
    }

    // Styles
    const contentStyles = {
        background: 'color' === contentBGType ? contentBGColor :

            'image' === contentBGType ? `url(${contentBGImg && contentBGImg.url}) center center / cover no-repeat ${isContentBGOpacity && contentBGOpacityColor}` :

                'gradient' === contentBGType && 'linear' === contentBGGradType ? `linear-gradient(${contentBGGradAngel}deg, ${contentBGGradFColor} ${contentBGGradFColorPos}%, ${contentBGGradSColor} ${contentBGGradSColorPos}%)` :

                    'gradient' === contentBGType && 'radial' === contentBGGradType ? `radial-gradient(${'circle' === contentBGGradRadialType ? 'circle at' : 'at'} ${contentBGGradRadialXPos}% ${contentBGGradRadialYPos}%, ${contentBGGradFColor} ${contentBGGradFColorPos}%, ${contentBGGradSColor} ${contentBGGradSColorPos}%)` : 'none',
        border: `${borderWidth}px ${borderStyle} ${borderColor}`, boxShadow: `${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px ${shadowSpreed}px`
    };

    const contentClasses = `text-${contentAlign} ptb-${contentPTB} plr-${contentPLR} radius-${borderRadius}-px`;

    return <>
        <InspectorControls>
            <PanelBody title={__('Content Settings', 'b-blocks')}>
                {/* Box Height */}
                <Title mt='0'>{__('Box Height:', 'b-blocks')}</Title>
                <RangeControl value={boxHeight} onChange={val => setAttributes({ boxHeight: val })} min={0} max={1000} step={1} />

                {/* Background */}
                <Title>{__('Background Type:', 'b-blocks')}</Title>
                <ButtonGroup className='b_blocks_button_groups'>
                    <Tooltip text={__('Color', 'b-blocks')} position='top'>
                        <Button isMedium isPrimary={'color' === contentBGType} aria-pressed={'color' === contentBGType} onClick={() => setAttributes({ contentBGType: 'color' })}>{__('Color', 'b-blocks')}</Button>
                    </Tooltip>

                    <Tooltip text={__('Image', 'b-blocks')} position='top'>
                        <Button isMedium isPrimary={'image' === contentBGType} aria-pressed={'image' === contentBGType} onClick={() => setAttributes({ contentBGType: 'image' })}>{__('Image', 'b-blocks')}</Button>
                    </Tooltip>

                    <Tooltip text={__('Gradient', 'b-blocks')} position='top'>
                        <Button isMedium isPrimary={'gradient' === contentBGType} aria-pressed={'gradient' === contentBGType} onClick={() => setAttributes({ contentBGType: 'gradient' })}>{__('Gradient', 'b-blocks')}</Button>
                    </Tooltip>
                </ButtonGroup>

                {'color' === contentBGType && <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                    <BColor value={contentBGColor} onChange={val => setAttributes({ contentBGColor: val })} defaultColor='#000000b3' />
                </PanelRow>}

                {'image' === contentBGType && <>
                    <Title>{__('Background Image:', 'b-blocks')}</Title>
                    <div className='editImageHolder'>
                        <div className='mediaControl'>
                            <MediaUpload allowedTypes={['image']} value={contentBGImg} onSelect={val => setAttributes({ contentBGImg: val })} render={({ open }) =>
                                contentBGImg ? <div className='btnControl'>
                                    <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
                                    <Button icon='exit' onClick={() => setAttributes({ contentBGImg: null })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
                                </div> : <div className='btnControl'>
                                    <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
                                </div>} />
                        </div>

                        <img src={contentBGImg && contentBGImg.url} alt={contentBGImg && contentBGImg.title} />
                    </div>

                    <ToggleControl className='mt-20p' label={isContentBGOpacity ? 'Hide Background Opacity' : 'Show Background Opacity'} checked={isContentBGOpacity} onChange={val => setAttributes({ isContentBGOpacity: val })} />

                    {isContentBGOpacity && <PanelRow className='mb-5p'>
                        <Title mt='5px'>{__('Background Opacity Color:', 'b-blocks')}</Title>
                        <BColor value={contentBGOpacityColor} onChange={val => setAttributes({ contentBGOpacityColor: val })} defaultColor='#000000b3' />
                    </PanelRow>}
                </>}

                {'gradient' === contentBGType && <>
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('Gradient Type:', 'b-blocks')}</Title>
                        <BtnGroup options={gradientType} myValue={contentBGGradType} setState={val => setAttributes({ contentBGGradType: val })} />
                    </PanelRow>

                    {'radial' === contentBGGradType && <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('Radial Type:', 'b-blocks')}</Title>
                        <BtnGroup options={radialType} myValue={contentBGGradRadialType} setState={val => setAttributes({ contentBGGradRadialType: val })} />
                    </PanelRow>}

                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('First Color:', 'b-blocks')}</Title>
                        <BColor value={contentBGGradFColor} onChange={val => setAttributes({ contentBGGradFColor: val })} defaultColor='#4527a4' />
                    </PanelRow>

                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('First Color:', 'b-blocks')}</Title>
                        <BColor value={contentBGGradSColor} onChange={val => setAttributes({ contentBGGradSColor: val })} defaultColor='#8344c5' />
                    </PanelRow>

                    <Title>{__('First Color Position:', 'b-blocks')}</Title>
                    <RangeControl value={contentBGGradFColorPos} onChange={val => setAttributes({ contentBGGradFColorPos: val })} min={0} max={100} step={1} />

                    <Title>{__('Second Color Position:', 'b-blocks')}</Title>
                    <RangeControl value={contentBGGradSColorPos} onChange={val => setAttributes({ contentBGGradSColorPos: val })} min={0} max={100} step={1} />

                    {'linear' === contentBGGradType && <>
                        <Title>{__('Angel:', 'b-blocks')}</Title>
                        <RangeControl value={contentBGGradAngel} onChange={val => setAttributes({ contentBGGradAngel: val })} min={0} max={360} step={1} />
                    </>}

                    {'radial' === contentBGGradType && <>
                        <Title>{__('Center X Position:', 'b-blocks')}</Title>
                        <RangeControl value={contentBGGradRadialXPos} onChange={val => setAttributes({ contentBGGradRadialXPos: val })} min={0} max={100} step={1} />

                        <Title>{__('Center Y Position:', 'b-blocks')}</Title>
                        <RangeControl value={contentBGGradRadialYPos} onChange={val => setAttributes({ contentBGGradRadialYPos: val })} min={0} max={100} step={1} />
                    </>}
                </>}

                {/* Padding Top Bottom */}
                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                <RangeControl value={contentPTB} onChange={val => setAttributes({ contentPTB: val })} min={0} max={100} step={1} />

                {/* Padding Left Right */}
                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                <RangeControl value={contentPLR} onChange={val => setAttributes({ contentPLR: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isImg ? 'Hide Image' : 'Show Image'} checked={isImg} onChange={val => setAttributes({ isImg: val })} />

                <Title>{__('Front Image:', 'b-blocks')}</Title>
                <div className='editImageHolder'>
                    <div className='mediaControl'>
                        <MediaUpload allowedTypes={['image']} value={fImg} onSelect={val => setAttributes({ fImg: val })} render={({ open }) =>
                            fImg ? <div className='btnControl'>
                                <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
                                <Button icon='exit' onClick={() => setAttributes({ fImg: null })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
                            </div> : <div className='btnControl'>
                                <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
                            </div>} />
                    </div>

                    <img src={fImg && fImg.url} alt={fImg && fImg.title} />
                </div>

                <Title>{__('Back Image:', 'b-blocks')}</Title>
                <div className='editImageHolder'>
                    <div className='mediaControl'>
                        <MediaUpload allowedTypes={['image']} value={bImg} onSelect={val => setAttributes({ bImg: val })} render={({ open }) =>
                            bImg ? <div className='btnControl'>
                                <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
                                <Button icon='exit' onClick={() => setAttributes({ bImg: null })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
                            </div> : <div className='btnControl'>
                                <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
                            </div>} />
                    </div>

                    <img src={bImg && bImg.url} alt={bImg && bImg.title} />
                </div>

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={imgWidth} onChange={val => setAttributes({ imgWidth: val })} min={0} max={500} step={1} />

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={imgRadiusType} setState={val => setAttributes({ imgRadiusType: val })} classes="b_blocks_size_type" size="small" />
                <RangeControl value={imgRadius} onChange={val => setAttributes({ imgRadius: val })} min={0} max={50} step={1} />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={imgMB} onChange={val => setAttributes({ imgMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                {/* Back Title */}
                <Title mt='0'>{__('Front Title:', 'b-blocks')}</Title>
                <TextControl value={fTitle} onChange={val => setAttributes({ fTitle: val })} />

                {/* Back Title */}
                <Title>{__('Back Title:', 'b-blocks')}</Title>
                <TextControl value={bTitle} onChange={val => setAttributes({ bTitle: val })} />

                {/* Font Size */}
                <Title mt='0'>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={25} value={titleFontSize} onChange={val => setAttributes({ titleFontSize: 'undefined' === typeof val ? 25 : val })} />

                {/* Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                    <BColor value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#fff' />
                </PanelRow>

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={titleMB} onChange={val => setAttributes({ titleMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isDesc ? 'Hide Description' : 'Show Description'} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                {/* Text */}
                <Title>{__('Text:', 'b-blocks')}</Title>
                <TextareaControl value={desc} onChange={val => setAttributes({ desc: val })} />

                {/* Font Size */}
                <Title>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={16} value={descFontSize} onChange={val => setAttributes({ descFontSize: 'undefined' === typeof val ? 16 : val })} />

                {/* Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                    <BColor value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#fff' />
                </PanelRow>
            </PanelBody>

            <PanelBody title={__('Button Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isBtn ? 'Hide Button' : 'Show Button'} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

                {/* Text */}
                <Title>{__('Text:', 'b-blocks')}</Title>
                <TextControl value={btn} onChange={val => setAttributes({ btn: val })} />

                {/* Link */}
                <Title>{__('Link:', 'b-blocks')}</Title>
                <TextControl value={btnLink} onChange={val => setAttributes({ btnLink: val })} />

                {/* Font Size */}
                <Title>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={16} value={btnFontSize} onChange={val => setAttributes({ btnFontSize: 'undefined' === typeof val ? 16 : val })} />

                {/* Colors */}
                <Title>{__('Colors:', 'b-blocks')}</Title>
                <TabPanel className='b_blocks_tab_panel' activeClass='active-tab' tabs={[{ name: 'normal', title: __('Normal', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover', 'b-blocks'), className: 'hover-tab', }]}>
                    {tab => <>
                        {'normal' == tab.name && <>
                            {/* Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                                <BColor value={btnColor} onChange={val => setAttributes({ btnColor: val })} defaultColor='#fff' />
                            </PanelRow>

                            {/* Background Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                                <BColor value={btnBGColor} onChange={val => setAttributes({ btnBGColor: val })} defaultColor='#ff4500' />
                            </PanelRow>
                        </>}

                        {'hover' == tab.name && <>
                            {/* Hover Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Hover Color:', 'b-blocks')}</Title>
                                <BColor value={btnHovColor} onChange={val => setAttributes({ btnHovColor: val })} defaultColor='#fff' />
                            </PanelRow>

                            {/* Hover Background Color */}
                            <PanelRow className='mt-20p mb-5p'>
                                <Title mt='5px'>{__('Hover Background Color:', 'b-blocks')}</Title>
                                <BColor value={btnHovBGColor} onChange={val => setAttributes({ btnHovBGColor: val })} defaultColor='#ff7500' />
                            </PanelRow>
                        </>}
                    </>}
                </TabPanel>

                {/* Padding Top Bottom */}
                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                <RangeControl value={btnPTB} onChange={val => setAttributes({ btnPTB: val })} min={0} max={100} step={1} />

                {/* Padding Left Right */}
                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                <RangeControl value={btnPLR} onChange={val => setAttributes({ btnPLR: val })} min={0} max={100} step={1} />

                {/* Border Radius */}
                <Title>{__('Border Radius:', 'b-blocks')}</Title>
                <RangeControl value={btnRadius} onChange={val => setAttributes({ btnRadius: val })} min={0} max={50} step={1} />
            </PanelBody>

            <PanelBody title={__('Border Settings', 'b-blocks')} initialOpen={false}>
                {/* Width */}
                <Title mt='0'>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={borderWidth} onChange={val => setAttributes({ borderWidth: val })} min={0} max={30} step={1} />

                {/* Style */}
                <Title>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={borderStyle} onChange={val => setAttributes({ borderStyle: val })} options={borderStyles} />

                {/* Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                    <BColor value={borderColor} onChange={val => setAttributes({ borderColor: val })} defaultColor='#00000000' />
                </PanelRow>

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <RangeControl value={borderRadius} onChange={val => setAttributes({ borderRadius: val })} min={0} max={50} step={1} />
            </PanelBody>

            <PanelBody title={__('Shadow Settings', 'b-blocks')} initialOpen={false}>
                {/* Color */}
                <PanelRow>
                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                    <BColor value={shadowColor} onChange={val => setAttributes({ shadowColor: val })} defaultColor='#000' />
                </PanelRow>

                {/* Horizontal Offset */}
                <Title>{__('Horizontal Offset:', 'b-blocks')}</Title>
                <RangeControl value={shadowHOffset} onChange={val => setAttributes({ shadowHOffset: val })} min={0} max={100} step={1} />

                {/* Vertical Offset */}
                <Title>{__('Vertical Offset:', 'b-blocks')}</Title>
                <RangeControl value={shadowVOffset} onChange={val => setAttributes({ shadowVOffset: val })} min={0} max={100} step={1} />

                {/* Blur */}
                <Title>{__('Blur:', 'b-blocks')}</Title>
                <RangeControl value={shadowBlur} onChange={val => setAttributes({ shadowBlur: val })} min={0} max={50} step={1} />

                {/* Spreed */}
                <Title>{__('Spreed:', 'b-blocks')}</Title>
                <RangeControl value={shadowSpreed} onChange={val => setAttributes({ shadowSpreed: val })} min={0} max={50} step={1} />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>


        <div className={`${className} flipBox`} id={`bBlocksFlipBox-${cId}`} style={{ height: `${boxHeight}px` }}>
            <div className={`front ${contentClasses}`} style={contentStyles}>
                <div className='frontContent'>
                    {isImg && fImg && <img className={`w-${imgWidth}-px mb-${imgMB} radius-${imgRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType}`} src={fImg.url} alt={fImg.alt} />}

                    {fTitle && <h3 className={`flipFrontTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }}>{fTitle}</h3>}

                    {isDesc && desc && <p className={`flipDescription fontSize-${descFontSize}`} style={{ color: descColor }}>{desc}</p>}
                </div>
            </div>

            <div className={`back ${contentClasses}`} style={contentStyles}>
                <div className='backContent'>
                    {isImg && bImg && <img className={`w-${imgWidth}-px mb-${imgMB} radius-${imgRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType}`} src={bImg.url} alt={bImg.alt} />}

                    {bTitle && <h3 className={`flipBackTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }}>{bTitle}</h3>}

                    {isBtn && btn && <a href={btnLink} className={`flipBtn fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} radius-${btnRadius}-px`} style={{ color: btnColor, backgroundColor: btnBGColor }} onMouseEnter={btnHov} onMouseLeave={btnHovLeave} target='_blank' rel='noreferrer noopener'>{btn}</a>}
                </div>
            </div>
        </div>
    </>;
};
export default Edit;