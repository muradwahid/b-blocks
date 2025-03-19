import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { videoIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: videoIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['vpb/video'], transform: attributes => createBlock('b-blocks/video', attributes) },
			{ type: 'prefix', prefix: 'video', transform: () => createBlock('b-blocks/video') }
		],

		to: [
			{
				type: 'block', blocks: ['vpb/video'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('vpb/video', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});