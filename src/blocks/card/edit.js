import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { RichText, MediaPlaceholder, BlockControls, MediaUpload, MediaUploadCheck, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { Spinner, withNotices, ToolbarGroup, Button, PanelBody, SelectControl, TextControl, PanelRow } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';

const Edit = props => {
    const { className, attributes: { layout = 'vertical', contentAlign = 'left', contentBGColor = '#ffffff00', contentPTB = 20, contentPLR = 10, imgId, imgUrl, imgAlt, imgHeight = 250, imgPos, imgBorder = { width: '0px', style: 'solid', color: '#00000000', radius: '5px' }, isCat = true, cat = 'Category', catFontSize = 15, catColor = '#0dcaf0', catMB = 10, isTitle = true, title = 'Card Title', titlePos = 'image', titleFontSize = 22, titleColor = '#ff7500', titleMB = 10 }, setAttributes, clientId, noticeOperations, noticeUI, image, imageSizes } = props;

    // useEffect
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

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

    // Components
    const cardTitle = () => isTitle && <RichText className='cardTitle' tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Card Title', 'b-blocks')} />

    const cardImage = () => imgUrl ? <>
        <figure className='cardImage'>
            <img src={imgUrl} alt={imgAlt} />

            {'image' === titlePos && cardTitle()}
        </figure>
        {isBlobURL(imgUrl) && <Spinner />}
    </> :
        <MediaPlaceholder labels={{ title: __(' Card Image', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectImage} onSelectURL={val => setAttributes({ imgId: null, imgUrl: val, imgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />;

    // Border
    const borderSideCheck = (side) => {
        const bSide = imgBorder?.side.toLowerCase();
        return bSide.includes('all') || bSide.includes(side);
    }
    const border = `${imgBorder?.width} ${imgBorder?.style} ${imgBorder?.color}`;

    return <>
        <InspectorControls>
            <PanelBody title={__('Colors Settings', 'b-blocks')}>
                {/* Content Background Color */}
                <PanelRow>
                    <Title mt='5px'>{__('Content Background Color:', 'b-blocks')}</Title>
                    <BColor value={contentBGColor} onChange={val => setAttributes({ contentBGColor: val })} defaultColor='#ffffff00' />
                </PanelRow>

                {/* Category Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Category Color:', 'b-blocks')}</Title>
                    <BColor value={catColor} onChange={val => setAttributes({ catColor: val })} defaultColor='#0dcaf0' />
                </PanelRow>

                {/* Title Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Title Color:', 'b-blocks')}</Title>
                    <BColor value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#ff7500' />
                </PanelRow>
            </PanelBody>

            {(imgUrl || imgId) && <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                {imgUrl && !isBlobURL(imgUrl) && <>
                    <Title mt='0'>{__('Alt Text (Alternative Text):', 'b-blocks')}</Title>
                    <TextControl label={__('', 'b-blocks')} value={imgAlt} onChange={val => setAttributes({ imgAlt: val })} />
                </>}

                {imgId && <PanelRow className='mt-20p mb-5p'>
                    <Title mt='0' mb='0'>{__('Select Size:', 'b-blocks')}</Title>
                    <SelectControl value={imgUrl} onChange={val => setAttributes({ imgUrl: val })} options={getImageSizes()} />
                </PanelRow>}
            </PanelBody>}
        </InspectorControls>


        <BlockControls>
            {imgUrl && <ToolbarGroup>
                {imgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={imgId} onSelect={onSelectImage} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit Card Photo', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </ToolbarGroup>}
        </BlockControls>


        <div id={`bBlocksCard-${clientId}`} className={className}>
            <style dangerouslySetInnerHTML={{
                __html: `
                    #bBlocksCard-${clientId} .bBlocksCard{ background-color: ${contentBGColor}; }
                    #bBlocksCard-${clientId} .bBlocksCard .cardImage{
                        ${borderSideCheck('top') && `border-top: ${border}`};
                        ${borderSideCheck('right') && `border-right: ${border}`};
                        ${borderSideCheck('bottom') && `border-bottom: ${border}`};
                        ${borderSideCheck('left') && `border-left: ${border}`};
                        border-radius: ${imgBorder?.radius};
                    }
                    #bBlocksCard-${clientId} .bBlocksCard .cardImage img{ height: ${imgHeight}px; }
                    #bBlocksCard-${clientId} .bBlocksCard .cardDetails{ padding: ${contentPTB}px ${contentPLR}px; }
                    #bBlocksCard-${clientId} .bBlocksCard .cardDetails .cardCategory{ color: ${catColor}; font-size: ${catFontSize}px; margin-bottom: ${catMB}px; }
                    #bBlocksCard-${clientId} .bBlocksCard .cardTitle{ color: ${titleColor}; font-size: ${titleFontSize}px; margin-bottom: ${titleMB}px; }
                `}} />

            <div className={`bBlocksCard ${'horizontal' === layout ? 'horizontal' : 'vertical'} ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
                {'top' === imgPos && cardImage()}

                <div className={`cardDetails text-${contentAlign}`}>
                    {isCat && <RichText className='cardCategory' tagName='h6' value={cat} onChange={val => setAttributes({ cat: val })} placeholder={__('Card Category', 'b-blocks')} />}

                    {'content' === titlePos && cardTitle()}

                    <InnerBlocks allowedBlocks={['b-blocks/section-heading', 'core/heading', 'core/paragraph', 'core/button', 'core/image', 'core/list', 'core/code', 'core/quote', 'core/pullquote', 'core/preformatted', 'core/html', 'core/spacer', 'core/separator', 'core/shortcode']} template={[['core/paragraph', { content: 'Lorem ipsum dolor sit amet, consectetur adipis cingelit. Etiam lacinia elit et placerat finibus. Praesent justo metus, pharetra vel nibh sit amet, tincidunt posuere nulla. Vivamus odio antement, feugiat eget nisi sit amet, scelerisque dignissim velit antement.' }
                    ]]} />
                </div>

                {'bottom' === imgPos && cardImage()}
            </div>
        </div>
    </>
};
export default withSelect((select, props) => {
    const { imgId } = props.attributes;

    // const { getBlockRootClientId, getBlock, } = select('core/block-editor');
    // const rootClientId = getBlockRootClientId(props.clientId);
    // const rootBlock = getBlock(rootClientId);
    // const { attributes: { layout, contentPTB, contentPLR, imgHeight, imgPos, imgBorder, catFontSize, catMB, titlePos, titleFontSize, titleMB } } = rootBlock;

    return {
        image: imgId ? select('core').getMedia(imgId) : null,
        imageSizes: select('core/block-editor').getSettings().imageSizes,
        // parentAttr: rootBlock.attributes || {}
    }
})(withNotices(Edit));