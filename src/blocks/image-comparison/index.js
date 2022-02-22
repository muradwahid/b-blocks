import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/image-comparison/block.json';

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