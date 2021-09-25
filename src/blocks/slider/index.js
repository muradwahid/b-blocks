import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icons
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

registerBlockType('b-blocks/slider', {
    // Build In attributes
    title: __('Slider', 'b-blocks'),
    description: __('Display image and content slider', 'b-blocks'),
    icon: icons.slider,
    category: 'bBlocks',
    keywords: [__('content slider', 'b-blocks'), __('image slider', 'b-blocks'), __('image carousel', 'b-blocks')],
    supports: {
        align: ['wide', 'full'],
        html: false
    },

    // Build In Functions
    edit: Edit,

    save: () => null,

    deprecated,

    example: {
        attributes: {
            'preview': true,
            columns: {
                desktop: 1,
                tablet: 1,
                mobile: 1
            },
        },
    }
});