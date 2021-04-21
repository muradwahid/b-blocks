const { __ } = wp.i18n;
const { useEffect, Fragment } = wp.element;
const { withSelect } = wp.data;
const { RichText, MediaPlaceholder, BlockControls, AlignmentToolbar, MediaUpload, MediaUploadCheck, InspectorControls, ColorPalette } = wp.blockEditor;
const { Spinner, withNotices, Toolbar, Button, PanelBody, SelectControl, TextControl, FontSizePicker, RangeControl, PanelRow } = wp.components;
const { isBlobURL } = wp.blob;

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import options from '../../Const/options';
const { fontSizes, colors, aligns, sizeTypes } = options;

const Edit = props => {
    const { className, attributes: { contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgMB, imgRadius, imgRadiusType, title, titleFontSize, titleColor, titleMB, desc, descFontSize, descColor, descMB, price, priceFontSize, priceColor }, setAttributes, noticeOperations, noticeUI, image, imageSizes } = props;

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

    return ([
        <InspectorControls>
            <PanelBody title={__('Content Settings', 'b-blocks')}>
                {/* Background Color */}
                <PanelRow>
                    <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                    <BColor value={contentBGColor} onChange={cng => setAttributes({ contentBGColor: cng })} defaultColor="#ffffff88" />
                </PanelRow>

                {/* Padding Top Bottom */}
                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                <RangeControl value={contentPTB} onChange={val => setAttributes({ contentPTB: val })} min={0} max={100} step={1} />

                {/* Padding Left Right */}
                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                <RangeControl value={contentPLR} onChange={val => setAttributes({ contentPLR: val })} min={0} max={100} step={1} />
            </PanelBody>

            {(imgUrl || imgId) && <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                {imgUrl && !isBlobURL(imgUrl) && <Fragment>
                    <Title mt="0">{__('Alt Text (Alternative Text):', 'b-blocks')}</Title>
                    <TextControl label={__('', 'b-blocks')} value={imgAlt} onChange={val => setAttributes({ imgAlt: val })} />
                </Fragment>}

                {imgId && <Fragment>
                    <Title>{__('Select Size:', 'b-blocks')}</Title>
                    <SelectControl value={imgUrl} onChange={val => setAttributes({ imgUrl: val })} options={getImageSizes()} />
                </Fragment>}

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={imgMB} onChange={val => setAttributes({ imgMB: val })} min={0} max={100} step={1} />

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={imgRadiusType} setState={(cng, def) => setAttributes({ imgRadiusType: cng })} classes="b_blocks_size_type" size="small" />

                <RangeControl value={imgRadius} onChange={cng => setAttributes({ imgRadius: cng })} min={0} max={50} step={1} />
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
                {/* Font Size */}
                <Title mt="0">{__('Font Size:', 'b-blocks')}</Title>
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
        </InspectorControls>,


        <BlockControls>
            {imgUrl && <Toolbar>
                {imgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={imgId} onSelect={onSelectImage} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit Product Photo', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </Toolbar>}
        </BlockControls>,


        <div className={`${className} text-${contentAlign} ptb-${contentPTB} plr-${contentPLR}`} style={{ backgroundColor: contentBGColor }}>
            <BlockControls>
                <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
            </BlockControls>

            {imgUrl ? <Fragment>
                <img className={`itemImage mb-${imgMB} radius-${imgRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType}`} src={imgUrl} alt={imgAlt} />
                {isBlobURL(imgUrl) && <Spinner />}
            </Fragment> :
                <MediaPlaceholder labels={{ title: __(' Product Image', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectImage} onSelectURL={val => setAttributes({ imgId: null, imgUrl: val, imgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
            }

            <RichText className={`itemTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h4' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Product Name', 'b-blocks')} />

            <RichText className={`itemDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Description of the product', 'b-blocks')} />

            <RichText className={`itemPrice fontSize-${priceFontSize}`} style={{ color: priceColor }} tagName='span' value={price} onChange={val => setAttributes({ price: val })} placeholder={__('$99.99', 'b-blocks')} />
        </div>
    ]);
};
export default withSelect((select, props) => {
    const { imgId } = props.attributes;

    return {
        image: imgId ? select('core').getMedia(imgId) : null,
        imageSizes: select('core/block-editor').getSettings().imageSizes
    }
})(withNotices(Edit));