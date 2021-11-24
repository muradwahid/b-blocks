import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';
const icon = icons.slider;

// Metadata
import metadata from './block.json';
const { name, example, title, description, category, keywords, attributes, supports } = metadata;

registerBlockType(name, {
    title, description, icon, category, keywords, supports, attributes, example,

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