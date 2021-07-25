import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { } from '@wordpress/block-editor';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

// Custom Attributes
const attributes = {
    cId: { type: 'string' },

    images: { type: 'array', default: [] },
    columns: {
        type: 'object', default: {
            desktop: 3,
            tablet: 2,
            mobile: 1
        }
    },

    imgPadding: { type: 'object', default: {} },

    imgBorder: { type: 'object', default: {} },

    imgShadow: { type: 'object', default: {} },

    isCap: { type: 'boolean', default: true },
    capTitleTypo: {
        type: 'object', default: {
            fontSize: 15
        }
    },
    capDescTypo: {
        type: 'object', default: {
            fontSize: 15
        }
    },
    capColor: { type: 'string', default: '#333' },
    capAlign: { type: 'string', default: 'left' },
}

registerBlockType('b-blocks/image-gallery', {
    // Build In attributes
    title: __('Image Gallery', 'b-blocks'),
    description: __('Display Multiple Images as Gallery', 'b-blocks'),
    icon: icons.gallery,
    category: 'bBlocks',
    keywords: [__('images', 'b-blocks'), __('photos', 'b-blocks'), __('gallery', 'b-blocks')],
    supports: {
        align: ['wide', 'full']
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: () => null,

    deprecated,

    example: {
        attributes: {
            'preview': true
        },
    },
});