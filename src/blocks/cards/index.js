import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/cards/block.json';
import Edit from './Edit';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.card,

	transforms: {
		from: [
			{ type: 'block', blocks: ['crd/cards'], transform: attributes => createBlock('b-blocks/cards', attributes) },
			{ type: 'prefix', prefix: 'counter', transform: () => createBlock('b-blocks/cards') }
		],

		to: [
			{
				type: 'block', blocks: ['crd/cards'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('crd/cards', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});