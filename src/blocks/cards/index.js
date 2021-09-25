import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icons
import icons from '../../Const/icons';

registerBlockType('b-blocks/cards', {
    // Build In attributes
    title: __('Cards', 'b-blocks'),
    description: __('Display cards section', 'b-blocks'),
    icon: icons.card,
    category: 'bBlocks',
    keywords: [__('card', 'b-blocks'), __('cards', 'b-blocks'), __('cards section', 'b-blocks')],
    supports: {
        align: ['wide', 'full'],
        html: false
    },

    // Build In Functions
    edit: Edit,

    save: () => null,

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