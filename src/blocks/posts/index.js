import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/posts/block.json';
import Edit from './Edit';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.article,

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