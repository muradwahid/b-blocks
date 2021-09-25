import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

registerBlockType('b-blocks/image-comparison', {
    // Build In attributes
    title: __('Image Comparison', 'b-blocks'),
    description: __('Compare between two images', 'b-blocks'),
    icon: icons.imageCompare,
    category: 'bBlocks',
    keywords: [__('image slider', 'b-blocks'), __('image compare', 'b-blocks'), __('image filter', 'b-blocks')],
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