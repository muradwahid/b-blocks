import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { RichText, MediaPlaceholder, BlockControls, AlignmentToolbar, MediaUpload, MediaUploadCheck, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { Spinner, withNotices, ToolbarGroup, Button, PanelBody, SelectControl, TextControl, FontSizePicker, RangeControl, PanelRow, ButtonGroup, Tooltip } from '@wordpress/components';
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
    const { className, attributes: { layout, contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgPos, imgRadius, title, titleFontSize, titleColor, titleMB }, setAttributes, noticeOperations, noticeUI, image, imageSizes } = props;

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
                <PanelRow>
                    <Title mt='0'>{__('Layout Type:', 'b-blocks')}</Title>
                    <ButtonGroup className="b_blocks_button_groups">
                        <Tooltip text={__('Vertical', 'b-blocks')} position="top">
                            <Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout} aria-pressed={'vertical' === layout} onClick={() => setAttributes({ layout: 'vertical', contentAlign: 'center', contentPTB: 0 })}></Button>
                        </Tooltip>

                        <Tooltip text={__('Horizontal', 'b-blocks')} position="top">
                            <Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout} aria-pressed={'horizontal' === layout} onClick={() => setAttributes({ layout: 'horizontal', contentAlign: 'left', contentPTB: 30 })}></Button>
                        </Tooltip>
                    </ButtonGroup>
                </PanelRow>
            </PanelBody>

            <PanelBody title={__('Content Settings', 'b-blocks')}>
                {/* Background Color */}
                <PanelRow>
                    <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                    <BColor value={contentBGColor} onChange={val => setAttributes({ contentBGColor: val })} defaultColor="#ffffff00" />
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

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <RangeControl value={imgRadius} onChange={val => setAttributes({ imgRadius: val })} min={0} max={50} step={1} />
            </PanelBody>}

            <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                {/* Font Size */}
                <Title mt="0">{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={22} value={titleFontSize} onChange={val => setAttributes({ titleFontSize: 'undefined' === typeof val ? 22 : val })} />

                {/* Color */}
                <Title>{__('Color:', 'b-blocks')}</Title>
                <BColor value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor="#333" />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={titleMB} onChange={val => setAttributes({ titleMB: val })} min={0} max={100} step={1} />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            {imgUrl && <ToolbarGroup>
                {imgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={imgId} onSelect={onSelectImage} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit Card Photo', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </ToolbarGroup>}

            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>


        <div className={`${className} bBlocksCard ${'horizontal' === layout ? 'horizontal' : 'vertical'}`} style={{ backgroundColor: contentBGColor }}>
            {imgUrl ? <>
                <figure className={`cardImage radius-${imgRadius}-px`} style={{ background: `url(${imgUrl}) center center / cover no-repeat rgba(0, 0, 0, .3)` }}>
                    {/* <img src={imgUrl} alt={imgAlt} /> */}
                </figure>
                {isBlobURL(imgUrl) && <Spinner />}
            </> :
                <MediaPlaceholder labels={{ title: __(' Card Image', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectImage} onSelectURL={val => setAttributes({ imgId: null, imgUrl: val, imgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
            }

            <div className={`cardDetails text-${contentAlign} ptb-${contentPTB} plr-${contentPLR}`}>
                <RichText className={`cardTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Card TItle', 'b-blocks')} />

                <InnerBlocks allowedBlocks={['core/heading', 'core/paragraph', 'core/button', 'core/image', 'core/list', 'core/code', 'core/quote']} template={[['core/paragraph']]} />
            </div>
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