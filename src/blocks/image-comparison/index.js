import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/image-comparison/block.json';
import Edit from './Edit';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.imageCompare,

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