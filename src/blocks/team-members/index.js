import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/team-members/block.json';
import Edit from './Edit';
import './editor.scss';
import { teamMembersIcon } from './utils/icons';

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