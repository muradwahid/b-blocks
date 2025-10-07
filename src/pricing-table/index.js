import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { pricingTableIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: pricingTableIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['bptb/pricing-table'], transform: attributes => createBlock('b-blocks/pricing-table', attributes) },
			{ type: 'prefix', prefix: 'count', transform: () => createBlock('b-blocks/pricing-table') }
		],

		to: [
			{
				type: 'block', blocks: ['bptb/pricing-table'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('bptb/pricing-table', attributes)
			}
		]
	},

	// Build in Functions
	edit: Edit,

	save: () => null
});