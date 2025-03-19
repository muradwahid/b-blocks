import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { socialShareIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: socialShareIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['bssb/social-share'], transform: attributes => createBlock('b-blocks/social-share', attributes) },
			{ type: 'prefix', prefix: 'share', transform: () => createBlock('b-blocks/social-share') }
		],

		to: [
			{
				type: 'block', blocks: ['bssb/social-share'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('bssb/social-share', attributes)
			}
		]
	},

	// Build in Functions
	edit: Edit,

	save: () => null
});