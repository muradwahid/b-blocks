import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/chart/block.json';

registerBlockType(metadata, {
    icon: icons.chart,

    transforms: {
        from: [
            { type: 'block', blocks: ['b-chart/chart'], transform: attributes => createBlock('b-blocks/chart', attributes) },
            { type: 'prefix', prefix: 'chart', transform: () => createBlock('b-blocks/chart') }
        ],

        to: [
            {
                type: 'block', blocks: ['b-chart/chart'], isMatch: attributes => {
                    if (attributes) return true;
                    return false;
                },
                transform: attributes => createBlock('b-chart/chart', attributes)
            }
        ]
    },

    // Build In Functions
    edit: Edit,

    save: () => null
});