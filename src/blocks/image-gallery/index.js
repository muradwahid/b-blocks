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