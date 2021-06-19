
import { RichText, InnerBlocks } from '@wordpress/block-editor';

const Save = props => {
    const { layout = 'vertical', contentAlign = 'left', contentBGColor = '#ffffff00', contentPTB = 20, contentPLR = 10, imgId, imgUrl, imgAlt, imgHeight = 250, imgPos, imgRadius = 5, cat = 'Category', catFontSize = 15, catColor = '#0dcaf0', catMB = 10, title = 'Card Title', titlePos = 'image', titleFontSize = 22, titleColor = '#ff7500', titleMB = 10 } = props.attributes;
    // const { cId, contentAlign = 'left', contentBGColor = '#ffffff00', imgId, imgUrl, imgAlt, cat = 'Category', catColor = '#0dcaf0', title = 'Card Title', titleColor = '#ff7500' } = props.attributes;

    // Get Parent Attributes
    // const { getBlockRootClientId, getBlock, } = select('core/block-editor');
    // const rootClientId = getBlockRootClientId(cId);
    // const rootBlock = getBlock(rootClientId);
    // const { layout = 'vertical', contentPTB = 20, contentPLR = 10, imgHeight = 250, imgPos = 'top', imgRadius = 5, catFontSize = 15, catMB = 10, titlePos = 'image', titleFontSize = 22, titleMB = 10 } = rootBlock?.attributes;
    // const { layout, contentPTB, contentPLR, imgHeight, imgPos, imgRadius, catFontSize, catMB, titlePos, titleFontSize, titleMB } = rootBlock?.attributes || { layout: 'vertical', contentPTB: 20, contentPLR: 10, imgHeight: 250, imgPos: 'top', imgRadius: 5, catFontSize: 15, catMB: 10, titlePos: 'image', titleFontSize: 22, titleMB: 10 };

    // console.log(rootBlock);


    const cardTitle = () => title && <RichText.Content className={`cardTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h3' value={title} />;

    const cardImage = () => imgUrl && <figure className={`cardImage radius-${imgRadius}-px`}>
        <img className={`${imgId ? `wp-image-${imgId}` : null} h-${imgHeight}-px`} src={imgUrl} alt={imgAlt} />

        {'image' === titlePos && cardTitle()}
    </figure>

    return (
        <div>
            <div className={`bBlocksCard ${'horizontal' === layout ? 'horizontal' : 'vertical'} ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`} style={{ backgroundColor: contentBGColor }}>
                {'top' === imgPos && cardImage()}

                <div className={`cardDetails text-${contentAlign} ptb-${contentPTB} plr-${contentPLR}`}>
                    {cat && <RichText.Content className={`cardCategory fontSize-${catFontSize} mb-${catMB}`} style={{ color: catColor }} tagName='h6' value={cat} />}

                    {'content' === titlePos && cardTitle()}

                    <InnerBlocks.Content />
                </div>

                {'bottom' === imgPos && cardImage()}
            </div>
        </div>
    );
};
export default Save;