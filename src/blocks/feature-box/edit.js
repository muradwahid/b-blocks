import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { RichText, MediaPlaceholder, BlockControls, AlignmentToolbar, MediaUpload, MediaUploadCheck, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { Spinner, withNotices, ToolbarItem, Button, PanelBody, SelectControl, TextControl, FontSizePicker, RangeControl, ToggleControl } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import options from '../../Const/options';
const { fontSizes, colors, borderStyles } = options;

const Edit = props => {
    const { className, attributes: { contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgMB, title, titleFontSize, titleColor, titleMB, isSep, sepWidth, sepThick, sepStyle, sepColor, sepMB, isDesc, desc, descFontSize, descColor, descMB }, setAttributes, noticeOperations, noticeUI, image, imageSizes } = props;

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
            <PanelBody title={__('Content Settings', 'b-blocks')}>
                {/* Background Color */}
                <BColor label={__('Background Color:', 'b-blocks')} value={contentBGColor} onChange={val => setAttributes({ contentBGColor: val })} defaultColor="#ffffff00" />

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
                    <TextControl value={imgAlt} onChange={val => setAttributes({ imgAlt: val })} />
                </>}

                {imgId && getImageSizes().length !== 0 && <>
                    <Title>{__('Select Size:', 'b-blocks')}</Title>
                    <SelectControl value={imgUrl} onChange={val => setAttributes({ imgUrl: val })} options={getImageSizes()} />
                </>}

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={imgMB} onChange={val => setAttributes({ imgMB: val })} min={0} max={100} step={1} />
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

            <PanelBody title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isSep ? 'Hide Separator' : 'Show Separator'} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={sepWidth} onChange={val => setAttributes({ sepWidth: val })} min={0} max={100} step={1} />

                {/* Thickness */}
                <Title>{__('Thickness:', 'b-blocks')}</Title>
                <RangeControl value={sepThick} onChange={val => setAttributes({ sepThick: val })} min={0} max={20} step={.1} />

                {/* Style */}
                <Title>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={sepStyle} onChange={val => setAttributes({ sepStyle: val })} options={borderStyles} />

                {/* Color */}
                <Title>{__('Color:', 'b-blocks')}</Title>
                <ColorPalette value={sepColor} onChange={val => setAttributes({ sepColor: val })} colors={colors} />

                {/* Margin Bottom */}
                <Title>{__('Margin Bottom:', 'b-blocks')}</Title>
                <RangeControl value={sepMB} onChange={val => setAttributes({ sepMB: val })} min={0} max={100} step={1} />
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
        </InspectorControls>


        <BlockControls>
            {imgUrl && <ToolbarItem>
                {imgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={imgId} onSelect={onSelectImage} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit Product Photo', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </ToolbarItem>}

            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>


        <div className={`${className} text-${contentAlign} ptb-${contentPTB} plr-${contentPLR}`} style={{ backgroundColor: contentBGColor }}>
            {imgUrl ? <>
                <img className={`featureImage mb-${imgMB}`} src={imgUrl} alt={imgAlt} />
                {isBlobURL(imgUrl) && <Spinner />}
            </> :
                <MediaPlaceholder labels={{ title: __(' Feature Image', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectImage} onSelectURL={val => setAttributes({ imgId: null, imgUrl: val, imgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
            }

            <div className='featureDetails'>
                <RichText className={`featureTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h4' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Feature Title', 'b-blocks')} />

                {isSep && <span className={`featureSeparator w-${sepWidth}-per mb-${sepMB}`} style={{ borderTop: `${sepThick}px ${sepStyle} ${sepColor}` }}></span>}

                {isDesc && <RichText className={`featureDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Description of the feature', 'b-blocks')} />}
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