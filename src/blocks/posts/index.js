import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';
const icon = icons.article;

// Metadata
import metadata from './block.json';
const { name, title, description, category, keywords, supports, attributes, example } = metadata;

registerBlockType(name, {
    title, description, icon, category, keywords, supports, attributes, example,

    transforms: {
        from: [
            { type: 'block', blocks: ['ap-block/posts'], transform: attributes => createBlock('b-blocks/posts', attributes) },
            { type: 'prefix', prefix: 'apb', transform: () => createBlock('b-blocks/posts') },
            { type: 'prefix', prefix: 'posts', transform: () => createBlock('b-blocks/posts') }
        ],

        to: [
            {
                type: 'block', blocks: ['ap-block/posts'], isMatch: attributes => {
                    if (attributes) return true;
                    return false;
                },
                transform: attributes => createBlock('ap-block/posts', attributes)
            }
        ]
    },

    // Build In Functions
    edit: Edit,

    save: () => null
});