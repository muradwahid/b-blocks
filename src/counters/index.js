import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { countersIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: countersIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['ctrb/counters'], transform: attributes => createBlock('b-blocks/counters', attributes) },
			{ type: 'prefix', prefix: 'counter', transform: () => createBlock('b-blocks/counters') }
		],

		to: [
			{
				type: 'block', blocks: ['ctrb/counters'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('ctrb/counters', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});