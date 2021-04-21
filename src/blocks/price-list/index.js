const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { RichText } = wp.blockEditor;

import './parent';
import Edit from './edit';

// Import Sass
import './editor.scss';
import './style.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    contentAlign: { type: 'string', default: 'center' },
    contentBGColor: { type: 'string', default: '#ffffff88' },
    contentPTB: { type: 'number', default: 50 },
    contentPLR: { type: 'number', default: 20 },

    imgId: { type: 'number' },
    imgUrl: { type: 'string', source: 'attribute', selector: 'img.itemImage', attribute: 'src' },
    imgAtl: { type: 'string', source: 'attribute', selector: 'img.itemImage', attribute: 'alt', default: '' },
    imgMB: { type: 'number', default: 20 },
    imgRadius: { type: 'number', default: 50 },
    imgRadiusType: { type: 'number', default: '%' },

    title: { type: 'string', source: 'html', selector: 'h4.itemTitle' },
    titleFontSize: { type: 'number', default: 18 },
    titleColor: { type: 'string', default: '#333' },
    titleMB: { type: 'number', default: 10 },

    desc: { type: 'string', source: 'html', selector: 'p.itemDescription' },
    descFontSize: { type: 'number', default: 15 },
    descColor: { type: 'string', default: '#333' },
    descMB: { type: 'number', default: 15 },

    price: { type: 'string', source: 'html', selector: 'span.itemPrice' },
    priceFontSize: { type: 'number', default: 24 },
    priceColor: { type: 'string', default: '#4527a4' },
}

registerBlockType('b-blocks/price-list', {
    // Build In attributes
    title: __('Price List', 'b-blocks'),
    description: __('Display Price list', 'b-blocks'),
    parent: ['b-blocks/price-lists'],
    icon: icons.priceList,
    category: 'bBlocks',
    keywords: [__('price', 'b-blocks'), __('list', 'b-blocks'), __('section price list', 'b-blocks')],
    supports: {
        reusable: false,
        html: false
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgMB, imgRadius, imgRadiusType, title, titleFontSize, titleColor, titleMB, desc, descFontSize, descColor, descMB, price, priceFontSize, priceColor } = props.attributes;

        return (
            <div className={`text-${contentAlign} ptb-${contentPTB} plr-${contentPLR}`} style={{ backgroundColor: contentBGColor }}>
                {imgUrl && <img className={`itemImage mb-${imgMB} radius-${imgRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType} ${imgId ? `wp-image-${imgId}` : null}`} src={imgUrl} alt={imgAlt} />}

                {title && <RichText.Content className={`itemTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h4' value={title} />}

                {desc && <RichText.Content className={`itemDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} />}

                {price && <RichText.Content className={`itemPrice fontSize-${priceFontSize}`} style={{ color: priceColor }} tagName='span' value={price} />}
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});