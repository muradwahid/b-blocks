import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InnerBlocks } from '@wordpress/block-editor';

import './parent';
import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

registerBlockType('b-blocks/card', {
    // Build In attributes
    title: __('Card', 'b-blocks'),
    description: __('Design a card', 'b-blocks'),
    parent: ['b-blocks/cards'],
    icon: icons.card,
    category: 'bBlocks',
    keywords: [__('card', 'b-blocks'), __('design card', 'b-blocks'), __('section card', 'b-blocks')],
    supports: { reusable: false, html: false },

    // Build In Functions
    edit: Edit,

    save: () => <InnerBlocks.Content />,

    deprecated,

    example: {
        attributes: {
            'preview': true
        },
    }
});