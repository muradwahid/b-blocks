import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/video/block.json';
import Edit from './Edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.video,

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