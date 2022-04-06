import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/social-share/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.socialShare,

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