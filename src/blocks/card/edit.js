import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { RichText, BlockControls, InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import { Spinner, PanelBody, SelectControl, TextControl, PanelRow } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BorderControl from '../../GutenComp/BorderControl';
import { ImagePlaceholder, ImageEditControl } from '../../GutenComp/ImageControl';
import func from '../../Const/functions';
const { getImageSizes } = func;

const Edit = props => {
    const { className, attributes: { layout, textAlign, bgColor, img, imgPos, imgBorder, isCat, cat, catColor, isTitle, title, titlePos, titleColor }, setAttributes, clientId, image, imageSizes } = props;

    // useEffect
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    useEffect(() => {
        if (img?.url && isBlobURL(img?.url) && !img?.id) {
            setAttributes({ ...img, url: '', alt: '' });
        }
    }, []);

    // Components
    const cardTitle = () => isTitle && <RichText className='cardTitle' tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Card Title', 'b-blocks')} />

    const cardImage = () => img?.url ? <>
        <figure className='cardImage'>
            <img src={img?.url} alt={img?.alt} />

            {'image' === titlePos && cardTitle()}
        </figure>
        {isBlobURL(img?.url) && <Spinner />}
    </> : <ImagePlaceholder label={__(' Card Image:', 'b-blocks')} img={img} onChange={val => setAttributes({ img: val })} />;

    return <>
        <InspectorControls>
            <PanelBody title={__('Colors Settings', 'b-blocks')}>
                {/* Content Background Color */}
                <BColor label={__('Content Background Color:', 'b-blocks')} value={bgColor} onChange={val => setAttributes({ bgColor: val })} defaultColor='#ffffff00' />

                {/* Category Color */}
                <BColor className='mt-20p mb-5p' label={__('Category Color:', 'b-blocks')} value={catColor} onChange={val => setAttributes({ catColor: val })} defaultColor='#0dcaf0' />

                {/* Title Color */}
                <BColor className='mt-20p mb-5p' label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#ff7500' />
            </PanelBody>

            {(img?.url || img?.id) && <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                {/* Border */}
                <BorderControl label={__('Border', 'b-blocks')} border={imgBorder} onChange={val => setAttributes({ imgBorder: val })} defaults={{ radius: '5px' }} />

                {img?.url && !isBlobURL(img?.url) && <>
                    <Title>{__('Alt Text (Alternative Text):', 'b-blocks')}</Title>
                    <TextControl value={img?.alt} onChange={val => setAttributes({ img: { ...img, alt: val } })} />
                </>}

                {img?.id && <PanelRow className='mt-20p mb-5p'>
                    <Title mt='0' mb='0'>{__('Select Size:', 'b-blocks')}</Title>
                    <SelectControl value={img?.url} onChange={val => setAttributes({ img: { ...img, ['url']: val } })} options={getImageSizes(image, imageSizes)} />
                </PanelRow>}
            </PanelBody>}
        </InspectorControls>


        <BlockControls>
            <ImageEditControl label={__('Edit Front Image:', 'b-blocks')} img={img} onChange={val => setAttributes({ img: val })} />
        </BlockControls>


        <div className={className} id={`bBlocksCard-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                #bBlocksCard-${clientId} .bBlocksCard{ background-color: ${bgColor}; }

                #bBlocksCard-${clientId} .bBlocksCard .cardImage{${imgBorder?.styles || 'border-radius: 5px;'}}

                #bBlocksCard-${clientId} .bBlocksCard .cardDetails .cardCategory{ color: ${catColor}; }
                #bBlocksCard-${clientId} .bBlocksCard .cardTitle{ color: ${titleColor}; }
            `}} />

            <div className={`bBlocksCard ${'horizontal' === layout ? 'horizontal' : 'vertical'} ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
                {'top' === imgPos && cardImage()}

                <div className={`cardDetails text-${textAlign}`}>
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
    const { img } = props.attributes;

    // const { getBlockRootClientId, getBlock } = select('core/block-editor');
    // const rootClientId = getBlockRootClientId(props.clientId);
    // const rootBlock = getBlock(rootClientId);
    // const { attributes: {} } = rootBlock;

    return {
        image: img?.id ? select('core').getMedia(img?.id) : null,
        imageSizes: select('core/block-editor').getSettings().imageSizes
    }
})(Edit);