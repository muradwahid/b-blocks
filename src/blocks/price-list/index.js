import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import './parent';
import Edit from './edit';

// Import Sass
import './editor.scss';
// import './style.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    layout: { type: 'string', default: 'vertical' },

    contentAlign: { type: 'string', default: 'center' },
    contentBGColor: { type: 'string', default: '#ffffff00' },
    contentPTB: { type: 'number', default: 50 },
    contentPLR: { type: 'number', default: 20 },

    imgId: { type: 'number' },
    imgUrl: { type: 'string', source: 'attribute', selector: 'img.itemImage', attribute: 'src' },
    imgAtl: { type: 'string', source: 'attribute', selector: 'img.itemImage', attribute: 'alt', default: '' },
    imgMB: { type: 'number', default: 20 },
    imgRadius: { type: 'number', default: 0 },
    imgRadiusType: { type: 'number', default: '%' },

    title: { type: 'string', source: 'html', selector: 'h4.itemTitle' },
    titleFontSize: { type: 'number', default: 18 },
    titleColor: { type: 'string', default: '#333' },
    titleMB: { type: 'number', default: 10 },

    isDesc: { type: 'boolean', default: true },
    desc: { type: 'string', source: 'html', selector: 'p.itemDescription' },
    descFontSize: { type: 'number', default: 15 },
    descColor: { type: 'string', default: '#333' },
    descMB: { type: 'number', default: 15 },

    price: { type: 'string', source: 'html', selector: 'span.itemPrice' },
    priceFontSize: { type: 'number', default: 24 },
    priceColor: { type: 'string', default: '#4527a4' },

    isSep: { type: 'boolean', default: true },
    sepWidth: { type: 'number', default: 40 },
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
        const { layout, contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgMB, imgRadius, imgRadiusType, title, titleFontSize, titleColor, titleMB, isDesc, desc, descFontSize, descColor, descMB, price, priceFontSize, priceColor, isSep, sepWidth } = props.attributes;

        return (
            <div className={`text-${contentAlign} ptb-${contentPTB} plr-${contentPLR} ${'horizontal' === layout ? 'horizontal' : 'vertical'}`} style={{ backgroundColor: contentBGColor }}>
                {imgUrl && <img className={`itemImage ${'horizontal' === layout ? `mr-${imgMB}` : `mb-${imgMB}`} radius-${imgRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType} ${imgId ? `wp-image-${imgId}` : null}`} src={imgUrl} alt={imgAlt} />}

                <div className='itemDetails'>
                    {title && <RichText.Content className={`itemTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h4' value={title} />}

                    {isDesc && desc && <RichText.Content className={`itemDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} />}

                    {price && <RichText.Content className={`itemPrice fontSize-${priceFontSize}`} style={{ color: priceColor }} tagName='span' value={price} />}
                </div>

                {isSep && <span className={`itemSeparator w-${sepWidth}-per`}></span>}
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});