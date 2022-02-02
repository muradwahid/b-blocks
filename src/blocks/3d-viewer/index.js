import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/3d-viewer/block.json';

registerBlockType(metadata, {
    icon: icons.tDViewer,

    transforms: {
        from: [
            { type: 'block', blocks: ['tdvb/td-viewer'], transform: attributes => createBlock('b-blocks/td-viewer', attributes) },
            { type: 'prefix', prefix: '3d', transform: () => createBlock('b-blocks/td-viewer') }
        ],

        to: [
            {
                type: 'block', blocks: ['tdvb/td-viewer'], isMatch: attributes => {
                    if (attributes) return true;
                    return false;
                },
                transform: attributes => createBlock('tdvb/td-viewer', attributes)
            }
        ]
    },

    // Build in Functions
    edit: Edit,

    save: () => null
});