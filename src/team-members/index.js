import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { teamMembersIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: teamMembersIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['tsb/team'], transform: attributes => createBlock('b-blocks/team-members', attributes) },
			{ type: 'prefix', prefix: 'counter', transform: () => createBlock('b-blocks/team-members') }
		],

		to: [
			{
				type: 'block', blocks: ['tsb/team'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('tsb/team', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});