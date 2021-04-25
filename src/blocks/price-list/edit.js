import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { RichText, MediaPlaceholder, BlockControls, AlignmentToolbar, MediaUpload, MediaUploadCheck, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { Spinner, withNotices, ToolbarGroup, Button, PanelBody, SelectControl, TextControl, FontSizePicker, RangeControl, PanelRow, ButtonGroup, Tooltip, ToggleControl } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

// Icons
import icons from '../../Const/icons';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import options from '../../Const/options';
const { fontSizes, colors, sizeTypes } = options;

const Edit = props => {
    const { className, attributes: { layout, contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgMB, imgRadius, imgRadiusType, title, titleFontSize, titleColor, titleMB, isDesc, desc, descFontSize, descColor, descMB, price, priceFontSize, priceColor, isSep, sepWidth }, setAttributes, noticeOperations, noticeUI, image, imageSizes } = props;

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
            <PanelBody title={__('Layouts Settings')}>
                <Title mt='0'>{__('Layout Type:', 'b-blocks')}</Title>
                <ButtonGroup className="b_blocks_button_groups">
                    <Tooltip text={__('Vertical', 'b-blocks')} position="top">
                        <Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout} aria-pressed={'vertical' === layout} onClick={() => setAttributes({ layout: 'vertical', contentAlign: 'center', contentPTB: 50, sepWidth: 40 })}></Button>
                    </Tooltip>

                    <Tooltip text={__('Horizontal', 'b-blocks')} position="top">
                        <Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout} aria-pressed={'horizontal' === layout} onClick={() => setAttributes({ layout: 'horizontal', contentAlign: 'left', contentPTB: 30, sepWidth: 80 })}></Button>
                    </Tooltip>
                </ButtonGroup>
            </PanelBody>

            <PanelBody title={__('Content Settings', 'b-blocks')}>
                {/* Background Color */}
                <PanelRow>
                    <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                    <BColor value={contentBGColor} onChange={val => setAttributes({ contentBGColor: val })} defaultColor="#ffffff88" />
                </PanelRow>

                {/* Padding Top Bottom */}
                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                <RangeControl value={contentPTB} onChange={val => setAttributes({ contentPTB: val })} min={0} max={100} step={1} />

                {/* Padding Left Right */}
                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                <RangeControl value={contentPLR} onChange={val => setAttributes({ contentPLR: val })} min={0} max={100} step={1} />
            </PanelBody>

            {(imgUrl || imgId) && <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                {imgUrl && !isBlobURL(imgUrl) && <>
                    <Title mt="0">{__('Alt Text (Alternative Text):', 'b-blocks')}</Title>
                    <TextControl label={__('', 'b-blocks')} value={imgAlt} onChange={val => setAttributes({ imgAlt: val })} />
                </>}

                {imgId && <>
                    <Title>{__('Select Size:', 'b-blocks')}</Title>
                    <SelectControl value={imgUrl} onChange={val => setAttributes({ imgUrl: val })} options={getImageSizes()} />
                </>}

                {/* Margin Bottom */}
                <Title>{__('horizontal' === layout ? 'Margin Right:' : 'Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={imgMB} onChange={val => setAttributes({ imgMB: val })} min={0} max={100} step={1} />

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={imgRadiusType} setState={val => setAttributes({ imgRadiusType: val })} classes="b_blocks_size_type" size="small" />

                <RangeControl value={imgRadius} onChange={val => setAttributes({ imgRadius: val })} min={0} max={50} step={1} />
            </PanelBody>}

            <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                {/* Font Size */}
                <Title mt="0">{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={18} value={titleFontSize} onChange={val => setAttributes({ titleFontSize: 'undefined' === typeof val ? 18 : val })} />

                {/* Color */}
                <Title>{__('Color:', 'b-blocks')}</Title>
                <ColorPalette value={titleColor} onChange={val => setAttributes({ titleColor: val })} colors={colors} />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={titleMB} onChange={val => setAttributes({ titleMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isDesc ? 'Hide Description' : 'Show Description'} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                {/* Font Size */}
                <Title>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={descFontSize} onChange={val => setAttributes({ descFontSize: 'undefined' === typeof val ? 15 : val })} />

                {/* Color */}
                <Title>{__('Color:', 'b-blocks')}</Title>
                <ColorPalette value={descColor} onChange={val => setAttributes({ descColor: val })} colors={colors} />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={descMB} onChange={val => setAttributes({ descMB: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody title={__('Price Settings', 'b-blocks')} initialOpen={false}>
                {/* Font Size */}
                <Title mt="0">{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={24} value={priceFontSize} onChange={val => setAttributes({ priceFontSize: 'undefined' === typeof val ? 24 : val })} />

                {/* Color */}
                <Title>{__('Color:', 'b-blocks')}</Title>
                <ColorPalette value={priceColor} onChange={val => setAttributes({ priceColor: val })} colors={colors} />
            </PanelBody>

            <PanelBody title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isSep ? 'Hide Separator' : 'Show Separator'} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={sepWidth} onChange={val => setAttributes({ sepWidth: val })} min={0} max={100} step={1} />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            {imgUrl && <ToolbarGroup>
                {imgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={imgId} onSelect={onSelectImage} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit Product Photo', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </ToolbarGroup>}

            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>


        <div className={`${className} text-${contentAlign} ptb-${contentPTB} plr-${contentPLR} ${'horizontal' === layout ? 'horizontal' : 'vertical'}`} style={{ backgroundColor: contentBGColor }}>
            {imgUrl ? <>
                <img className={`itemImage ${'horizontal' === layout ? `mr-${imgMB}` : `mb-${imgMB}`} radius-${imgRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType}`} src={imgUrl} alt={imgAlt} />
                {isBlobURL(imgUrl) && <Spinner />}
            </> :
                <MediaPlaceholder labels={{ title: __(' Product Image', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectImage} onSelectURL={val => setAttributes({ imgId: null, imgUrl: val, imgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
            }

            <div className='itemDetails'>
                <RichText className={`itemTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h4' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Product Name', 'b-blocks')} />

                {isDesc && <RichText className={`itemDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Description of the product', 'b-blocks')} />}

                <RichText className={`itemPrice fontSize-${priceFontSize}`} style={{ color: priceColor }} tagName='span' value={price} onChange={val => setAttributes({ price: val })} placeholder={__('$99.99', 'b-blocks')} />
            </div>

            {isSep && <span className={`itemSeparator w-${sepWidth}-per`}></span>}
        </div>
    </>
};
export default withSelect((select, props) => {
    const { imgId } = props.attributes;

    return {
        image: imgId ? select('core').getMedia(imgId) : null,
        imageSizes: select('core/block-editor').getSettings().imageSizes
    }
})(withNotices(Edit));