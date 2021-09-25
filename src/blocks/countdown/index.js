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

registerBlockType('b-blocks/countdown', {
    // Build In attributes
    title: __('Countdown', 'b-blocks'),
    description: __('Timer for an event', 'b-blocks'),
    icon: icons.countdown,
    category: 'bBlocks',
    keywords: [__('countdown timer', 'b-blocks'), __('countdown events', 'b-blocks'), __('set timer', 'b-blocks')],
    supports: {
        align: ['center', 'wide', 'full']
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