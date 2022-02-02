import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/pricing-table/block.json';

registerBlockType(metadata, {
    icon: icons.pricingTable,

    transforms: {
        from: [
            { type: 'block', blocks: ['bptb/pricing-table'], transform: attributes => createBlock('b-blocks/pricing-table', attributes) },
            { type: 'prefix', prefix: 'count', transform: () => createBlock('b-blocks/pricing-table') }
        ],

        to: [
            {
                type: 'block', blocks: ['bptb/pricing-table'], isMatch: attributes => {
                    if (attributes) return true;
                    return false;
                },
                transform: attributes => createBlock('bptb/pricing-table', attributes)
            }
        ]
    },

    // Build in Functions
    edit: Edit,

    save: () => null
});