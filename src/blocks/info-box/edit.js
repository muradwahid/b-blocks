import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { AlignmentToolbar, BlockControls, InspectorControls, MediaPlaceholder, MediaUpload, MediaUploadCheck, RichText } from '@wordpress/block-editor';
import { Button, ButtonGroup, FontSizePicker, PanelBody, PanelRow, RangeControl, SelectControl, TextControl, ToggleControl, ToolbarItem, Tooltip, withNotices, Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import options from '../../Const/options';
const { fontSizes, gradientType, radialType, borderStyles } = options;
const imgPositions = [
    { label: 'Top', value: 'top', icon: 'Top' },
    { label: 'Bottom', value: 'bottom', icon: 'Bottom' },
];
const inTab = [
    { label: 'New Tab', value: 'new', icon: 'New Tab' },
    { label: 'Self Tab', value: 'self', icon: 'Self Tab' },
];

const Edit = props => {
    const { className, attributes: { contentAlign, contentBGType, contentBGColor, contentBGImg, isContentBGOpacity, contentBGOpacityColor, contentBGGradType, contentBGGradRadialType, contentBGGradFColor, contentBGGradSColor, contentBGGradFColorPos, contentBGGradSColorPos, contentBGGradAngel, contentBGGradRadialXPos, contentBGGradRadialYPos, contentPTB, contentPLR, borderWidth, borderStyle, borderColor, borderRadius, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpreed, isImg, imgPos, imgId, imgUrl, imgAlt, imgWidth, imgMB, title, titleFontSize, titleColor, titleMB, isDesc, desc, descFontSize, descColor, descMB, isBtn, btn, btnLink, btnLinkTab, btnFontSize, btnTextColor, btnBGColor, btnPTB, btnPLR, btnRadius }, setAttributes, noticeOperations, noticeUI, image, imageSizes } = props;

    // useEffect
    useEffect(() => {
        if (imgUrl && isBlobURL(imgUrl) && !imgId) {
            setAttributes({ imgUrl: '', imgAlt: '' });
        }
    }, []);

    // Functions
    const onSelectImage = ({ id, url, alt }) => setAttributes({ imgId: id, imgUrl: url, imgAlt: alt });

    const getImageSizes = () => {
        if (!image) return [];
        let options = [];
        const sizes = image.media_details.sizes;

        for (const key in sizes) {
            const imageSize = imageSizes.find(s => s.slug === key);
            if (imageSize) {
                options.push({ label: imageSize.name, value: sizes[key].source_url });
            }
        }
        return options;
    }

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')}>
                {/* Background */}
                <Title mt='0'>{__('Background Type:', 'b-blocks')}</Title>
                <ButtonGroup className='bBlocksBtnGroup'>
                    <Tooltip text={__('Color', 'b-blocks')} position='top'>
                        <Button isMedium isPrimary={'color' === contentBGType} aria-pressed={'color' === contentBGType} onClick={() => setAttributes({ contentBGType: 'color', titleColor: '#333', descColor: '#333' })}>{__('Color', 'b-blocks')}</Button>
                    </Tooltip>

                    <Tooltip text={__('Image', 'b-blocks')} position='top'>
                        <Button isMedium isPrimary={'image' === contentBGType} aria-pressed={'image' === contentBGType} onClick={() => setAttributes({ contentBGType: 'image', titleColor: '#eee', descColor: '#eee' })}>{__('Image', 'b-blocks')}</Button>
                    </Tooltip>

                    <Tooltip text={__('Gradient', 'b-blocks')} position='top'>
                        <Button isMedium isPrimary={'gradient' === contentBGType} aria-pressed={'gradient' === contentBGType} onClick={() => setAttributes({ contentBGType: 'gradient', titleColor: '#eee', descColor: '#eee' })}>{__('Gradient', 'b-blocks')}</Button>
                    </Tooltip>
                </ButtonGroup>

                {'color' === contentBGType && <BColor className='mt-20p mb-5p' label={__('Background Color:', 'b-blocks')} value={contentBGColor} onChange={val => setAttributes({ contentBGColor: val })} defaultColor='#ffffff00' />}

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

                    {isContentBGOpacity && <BColor className='mb-5p' label={__('Background Opacity Color:', 'b-blocks')} value={contentBGOpacityColor} onChange={val => setAttributes({ contentBGOpacityColor: val })} defaultColor='#000000b3' />}
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

                    <BColor className='mt-20p mb-5p' label={__('First Color:', 'b-blocks')} value={contentBGGradFColor} onChange={val => setAttributes({ contentBGGradFColor: val })} defaultColor='#4527a4' />

                    <BColor className='mt-20p mb-5p' label={__('Second Color:', 'b-blocks')} value={contentBGGradSColor} onChange={val => setAttributes({ contentBGGradSColor: val })} defaultColor='#8344c5' />

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

            <PanelBody className='bBlocksPanelBody' title={__('Border Settings', 'b-blocks')} initialOpen={false}>
                {/* Width */}
                <Title mt='0'>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={borderWidth} onChange={val => setAttributes({ borderWidth: val })} min={0} max={30} step={1} />

                {/* Style */}
                <Title>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={borderStyle} onChange={val => setAttributes({ borderStyle: val })} options={borderStyles} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={borderColor} onChange={val => setAttributes({ borderColor: val })} defaultColor='#00000000' />

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <RangeControl value={borderRadius} onChange={val => setAttributes({ borderRadius: val })} min={0} max={50} step={1} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Shadow Settings', 'b-blocks')} initialOpen={false}>
                {/* Color */}
                <BColor label={__('Color:', 'b-blocks')} value={shadowColor} onChange={val => setAttributes({ shadowColor: val })} defaultColor='#000' />

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

            <PanelBody className='bBlocksPanelBody' title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isImg ? 'Hide Image' : 'Show Image'} checked={isImg} onChange={val => setAttributes({ isImg: val })} />

                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Position:', 'b-blocks')}</Title>
                    <BtnGroup options={imgPositions} myValue={imgPos} setState={val => setAttributes({ imgPos: val })} />
                </PanelRow>

                {imgUrl && !isBlobURL(imgUrl) && <>
                    <Title>{__('Alt Text (Alternative Text):', 'b-blocks')}</Title>
                    <TextControl value={imgAlt} onChange={val => setAttributes({ imgAlt: val })} />
                </>}

                {imgId && getImageSizes().length !== 0 && <>
                    <Title>{__('Select Size:', 'b-blocks')}</Title>
                    <SelectControl value={imgUrl} onChange={val => setAttributes({ imgUrl: val })} options={getImageSizes()} />
                </>}

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={imgWidth} onChange={val => setAttributes({ imgWidth: val })} min={0} max={500} step={1} />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={imgMB} onChange={val => setAttributes({ imgMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                {/* Font Size */}
                <Title mt='0'>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={18} value={titleFontSize} onChange={val => setAttributes({ titleFontSize: 'undefined' === typeof val ? 18 : val })} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#333' />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={titleMB} onChange={val => setAttributes({ titleMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isDesc ? 'Hide Description' : 'Show Description'} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                {/* Font Size */}
                <Title>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={descFontSize} onChange={val => setAttributes({ descFontSize: 'undefined' === typeof val ? 15 : val })} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#333' />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={descMB} onChange={val => setAttributes({ descMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Button Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isBtn ? 'Hide Button' : 'Show Button'} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

                {isBtn && <>
                    {/* Link */}
                    <Title>{__('Link:', 'b-blocks')}</Title>
                    <TextControl value={btnLink} onChange={val => setAttributes({ btnLink: val })} />

                    {/* Open in */}
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('Open in:', 'b-blocks')}</Title>
                        <BtnGroup options={inTab} myValue={btnLinkTab} setState={val => setAttributes({ btnLinkTab: val })} />
                    </PanelRow>

                    {/* Font Size */}
                    <Title>{__('Font Size:', 'b-blocks')}</Title>
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={btnFontSize} onChange={val => setAttributes({ btnFontSize: 'undefined' === typeof val ? 15 : val })} />

                    {/* Text Color */}
                    <BColor className='mt-20p mb-5p' label={__('Text Color:', 'b-blocks')} value={btnTextColor} onChange={val => setAttributes({ btnTextColor: val })} defaultColor='#fff' />

                    {/* Background Color */}
                    <BColor className='mt-20p mb-5p' label={__('Background Color:', 'b-blocks')} value={btnBGColor} onChange={val => setAttributes({ btnBGColor: val })} defaultColor='#4527a4' />

                    {/* Padding Top Bottom */}
                    <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                    <RangeControl value={btnPTB} onChange={val => setAttributes({ btnPTB: val })} min={0} max={100} step={1} />

                    {/* Padding Left Right */}
                    <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                    <RangeControl value={btnPLR} onChange={val => setAttributes({ btnPLR: val })} min={0} max={100} step={1} />

                    {/* Border Radius */}
                    <Title>{__('Border Radius:', 'b-blocks')}</Title>
                    <RangeControl value={btnRadius} onChange={val => setAttributes({ btnRadius: val })} min={0} max={50} step={1} />
                </>}
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            {imgUrl && <ToolbarItem>
                {imgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={imgId} onSelect={onSelectImage} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit Info Photo', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </ToolbarItem>}

            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>


        <div className={`${className} text-${contentAlign} ptb-${contentPTB} plr-${contentPLR} radius-${borderRadius}-px`} style={{
            background: 'color' === contentBGType ? contentBGColor :

                'image' === contentBGType ? `url(${contentBGImg && contentBGImg.url}) center center / cover no-repeat ${isContentBGOpacity && contentBGOpacityColor}` :

                    'gradient' === contentBGType && 'linear' === contentBGGradType ? `linear-gradient(${contentBGGradAngel}deg, ${contentBGGradFColor} ${contentBGGradFColorPos}%, ${contentBGGradSColor} ${contentBGGradSColorPos}%)` :

                        'gradient' === contentBGType && 'radial' === contentBGGradType ? `radial-gradient(${'circle' === contentBGGradRadialType ? 'circle at' : 'at'} ${contentBGGradRadialXPos}% ${contentBGGradRadialYPos}%, ${contentBGGradFColor} ${contentBGGradFColorPos}%, ${contentBGGradSColor} ${contentBGGradSColorPos}%)` : 'none',
            border: `${borderWidth}px ${borderStyle} ${borderColor}`, boxShadow: `${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px ${shadowSpreed}px`
        }}>
            {'bottom' === imgPos && <>
                <RichText className={`infoTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Info Title', 'b-blocks')} />

                {isDesc && <RichText className={`infoDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Description of info', 'b-blocks')} />}
            </>}

            {isImg && <>
                {imgUrl ? <>
                    <img className={`infoImage mb-${imgMB}`} src={imgUrl} alt={imgAlt} style={{ width: `${imgWidth}px` }} />
                    {isBlobURL(imgUrl) && <Spinner />}
                </> :
                    <MediaPlaceholder labels={{ title: __(' Info Image', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectImage} onSelectURL={val => setAttributes({ imgId: null, imgUrl: val, imgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
                }
            </>}

            {'top' === imgPos && <>
                <RichText className={`infoTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Info Title', 'b-blocks')} />

                {isDesc && <RichText className={`infoDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Description of info', 'b-blocks')} />}
            </>}

            {isBtn && <>
                <div></div>
                <RichText className={`infoButton fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} radius-${btnRadius}-px`} style={{ color: btnTextColor, backgroundColor: btnBGColor }} tagName='a' value={btn} href={btnLink} target={'new' === btnLinkTab ? '_blank' : ''} rel='noreferrer noopener' onChange={val => setAttributes({ btn: val })} placeholder={__('Click Me', 'b-blocks')} />
            </>}
        </div>
    </>;
};
export default withSelect((select, props) => {
    const { imgId } = props.attributes;

    return {
        image: imgId ? select('core').getMedia(imgId) : null,
        imageSizes: select('core/block-editor').getSettings().imageSizes
    }
})(withNotices(Edit));