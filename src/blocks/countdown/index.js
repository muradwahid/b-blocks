import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/countdown/block.json';
import Edit from './Edit';
import './editor.scss';
import icons from '../../Const/icons';

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