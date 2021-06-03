import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, InnerBlocks } from '@wordpress/block-editor';

import './parent';
import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    layout: { type: 'string', default: 'vertical' },

    contentAlign: { type: 'string', default: 'center' },
    contentBGColor: { type: 'string', default: '#ffffff00' },
    contentPTB: { type: 'number', default: 20 },
    contentPLR: { type: 'number', default: 10 },

    imgId: { type: 'number' },
    // imgUrl: { type: 'string', source: 'attribute', selector: '.cardImage img', attribute: 'src' },
    // imgAlt: { type: 'string', source: 'attribute', selector: '.cardImage img', attribute: 'alt', default: '' },
    imgUrl: { type: 'string' },
    imgAlt: { type: 'string' },
    imgPos: { type: 'string', default: 'top' },
    imgRadius: { type: 'number', default: 5 },

    title: { type: 'string', source: 'html', selector: 'h3.cardTitle' },
    titleFontSize: { type: 'number', default: 22 },
    titleColor: { type: 'string', default: '#333' },
    titleMB: { type: 'number', default: 10 }
}

registerBlockType('b-blocks/card', {
    // Build In attributes
    title: __('Card', 'b-blocks'),
    description: __('Design a card', 'b-blocks'),
    parent: ['b-blocks/cards'],
    icon: icons.card,
    category: 'bBlocks',
    keywords: [__('card', 'b-blocks'), __('design card', 'b-blocks'), __('section card', 'b-blocks')],
    supports: { reusable: false, html: false },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { layout, contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgPos, imgRadius, title, titleFontSize, titleColor, titleMB } = props.attributes;

        return (
            <div className={`bBlocksCard ${'horizontal' === layout ? 'horizontal' : 'vertical'}`} style={{ backgroundColor: contentBGColor }}>
                {imgUrl && <figure className={`cardImage radius-${imgRadius}-px`} style={{ background: `url(${imgUrl}) center center / cover no-repeat rgba(0, 0, 0, .3)` }}>
                    {/* <img className={`${imgId ? `wp-image-${imgId}` : null}`} src={imgUrl} alt={imgAlt} /> */}
                </figure>}

                <div className={`cardDetails text-${contentAlign} ptb-${contentPTB} plr-${contentPLR}`}>
                    {title && <RichText.Content className={`cardTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h3' value={title} />}

                    <InnerBlocks.Content />
                </div>
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    }
});