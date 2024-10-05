import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { articleIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: articleIcon,

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