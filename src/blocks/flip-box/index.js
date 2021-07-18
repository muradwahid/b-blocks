import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import './parent';
import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

registerBlockType('b-blocks/flip-box', {
    // Build In attributes
    title: __('Flip Box', 'b-blocks'),
    description: __('Flip box', 'b-blocks'),
    parent: ['b-blocks/flip-boxes'],
    icon: icons.flipBox,
    category: 'bBlocks',
    keywords: [__('flip', 'b-blocks'), __('box', 'b-blocks'), __('rotate box', 'b-blocks')],
    supports: {
        reusable: false,
        html: false
    },

    styles: [],

    // Build In Functions
    edit: Edit,

    save: () => null,

    deprecated,

    example: {
        attributes: {
            'preview': true
        },
    }
});