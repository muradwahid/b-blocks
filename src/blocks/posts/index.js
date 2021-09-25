import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

registerBlockType('b-blocks/posts', {
    // Build In attributes
    title: __('Posts', 'b-blocks'),
    description: __('Display blog posts', 'b-blocks'),
    icon: icons.article,
    category: 'bBlocks',
    keywords: [__('Show Posts', 'b-blocks'), __('Blog Posts', 'b-blocks'), __('Category Posts', 'b-blocks')],
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