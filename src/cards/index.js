import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { cardIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: cardIcon,

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