import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { imageCompareIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: imageCompareIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['icb/image-compare'], transform: attributes => createBlock('b-blocks/image-comparison', attributes) },
			{ type: 'prefix', prefix: 'image-compare', transform: () => createBlock('b-blocks/image-comparison') }
		],

		to: [
			{
				type: 'block', blocks: ['icb/image-compare'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('icb/image-compare', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});