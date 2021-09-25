import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icons
import icons from '../../Const/icons';

registerBlockType('b-blocks/flip-boxes', {
    // Build In attributes
    title: __('Flip Boxes', 'b-blocks'),
    description: __('Display Flip boxes section', 'b-blocks'),
    icon: icons.flipBox,
    category: 'bBlocks',
    keywords: [__('flip', 'b-blocks'), __('flip boxes', 'b-blocks'), __('flip boxes section', 'b-blocks')],
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