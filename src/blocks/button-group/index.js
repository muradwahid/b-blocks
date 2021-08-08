import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

registerBlockType('b-blocks/button-group', {
    // Build In attributes
    title: __('Button Group', 'b-blocks'),
    description: __('Display Dual Button', 'b-blocks'),
    icon: icons.buttonGroup,
    category: 'bBlocks',
    keywords: [__('button', 'b-blocks'), __('multiple buttons', 'b-blocks'), __('group of buttons', 'b-blocks')],
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