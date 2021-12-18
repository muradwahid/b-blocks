import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';
const icon = icons.animation;

// Metadata
import metadata from './block.json';
const { name, title, description, category, keywords, supports, attributes, example } = metadata;

registerBlockType(name, {
    title, description, icon, category, keywords, supports, attributes, example,

    transforms: {
        from: [
            { type: 'block', blocks: ['atb/animated-text'], transform: attributes => createBlock('b-blocks/animated-text', attributes) },
            {
                type: 'block', blocks: ['b-blocks/alert'], transform: ({ message, textAlign }) => {
                    return createBlock('b-blocks/animated-text', { content: message, textAlign });
                }
            },
            {
                type: 'block', blocks: ['core/paragraph'], transform: ({ content, align }) => {
                    return createBlock('b-blocks/animated-text', { content, textAlign: align });
                }
            },
            {
                type: 'block', blocks: ['core/heading'], transform: ({ content, textAlign }) => {
                    return createBlock('b-blocks/animated-text', { content, textAlign });
                }
            },
            { type: 'prefix', prefix: 'animated-text', transform: () => createBlock('b-blocks/animated-text') }
        ],

        to: [
            {
                type: 'block', blocks: ['atb/animated-text'], isMatch: attributes => {
                    if (attributes) return true;
                    return false;
                },
                transform: attributes => createBlock('atb/animated-text', attributes)
            },
            {
                type: 'block', blocks: ['core/paragraph'], isMatch: ({ content }) => {
                    if (content) return true;
                    return false;
                }, transform: ({ content, textAlign }) => {
                    return createBlock('core/paragraph', { content, align: textAlign });
                }
            },
            {
                type: 'block', blocks: ['b-blocks/alert'], isMatch: ({ content }) => {
                    if (content) return true;
                    return false;
                }, transform: ({ content, textAlign }) => {
                    return createBlock('b-blocks/alert', { message: content, textAlign });
                }
            },
            {
                type: 'block', blocks: ['core/heading'], isMatch: ({ content }) => {
                    if (content) return true;
                    return false;
                }, transform: ({ content, textAlign }) => {
                    return createBlock('core/heading', { content, textAlign });
                }
            }
        ]
    },

    // Build in Functions
    edit: Edit,

    save: () => null
});