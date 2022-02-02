import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/lottie-player/block.json';

registerBlockType(metadata, {
    icon: icons.lottie,

    transforms: {
        from: [
            { type: 'block', blocks: ['lpb/lottie-player'], transform: attributes => createBlock('b-blocks/lottie-player', attributes) },
            { type: 'prefix', prefix: 'lottie', transform: () => createBlock('b-blocks/lottie-player') }
        ],

        to: [
            {
                type: 'block', blocks: ['lpb/lottie-player'], isMatch: attributes => {
                    if (attributes) return true;
                    return false;
                },
                transform: attributes => createBlock('lpb/lottie-player', attributes)
            }
        ]
    },

    // Build In Functions
    edit: Edit,

    save: () => null
});