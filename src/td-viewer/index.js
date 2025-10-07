import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { tDViewerIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: tDViewerIcon,

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