import { registerBlockType, createBlock } from '@wordpress/blocks';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icons
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/counters/block.json';

registerBlockType(metadata, {
	icon: icons.counters,

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