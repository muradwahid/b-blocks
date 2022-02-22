import { registerBlockType, createBlock } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/team-members/block.json';

registerBlockType(metadata, {
	icon: icons.teamMembers,

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