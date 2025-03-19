import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { chartIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: chartIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['b-chart/chart'], transform: attributes => createBlock('b-blocks/chart', attributes) },
			{ type: 'prefix', prefix: 'chart', transform: () => createBlock('b-blocks/chart') }
		],

		to: [
			{
				type: 'block', blocks: ['b-chart/chart'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('b-chart/chart', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});