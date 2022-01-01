import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';
const icon = icons.slider;

// Metadata
import metadata from '../../../inc/slider/block.json';

registerBlockType(metadata, {
    icon,

    transforms: {
        from: [
            { type: 'block', blocks: ['csb/content-slider-block'], transform: attributes => createBlock('b-blocks/slider', attributes) },
            { type: 'prefix', prefix: 'slider', transform: () => createBlock('b-blocks/slider') }
        ],

        to: [
            {
                type: 'block', blocks: ['csb/content-slider-block'], isMatch: attributes => {
                    if (attributes) return true;
                    return false;
                },
                transform: attributes => createBlock('csb/content-slider-block', attributes)
            }
        ]
    },

    // Build In Functions
    edit: Edit,

    save: () => null
});