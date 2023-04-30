import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/pricing-table/block.json';
import Edit from './Edit';
import './editor.scss';
import { pricingTableIcon } from './utils/icons';

registerBlockType(metadata, {
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