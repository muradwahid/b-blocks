import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/countdown/block.json';

registerBlockType(metadata, {
	icon: icons.countdown,

	transforms: {
		from: [
			{ type: 'block', blocks: ['ctb/countdown-time'], transform: attributes => createBlock('b-blocks/countdown', attributes) },
			{ type: 'prefix', prefix: 'count', transform: () => createBlock('b-blocks/countdown') }
		],

		to: [
			{
				type: 'block', blocks: ['ctb/countdown-time'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('ctb/countdown-time', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});