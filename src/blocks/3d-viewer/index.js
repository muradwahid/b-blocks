import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/3d-viewer/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.tDViewer,

	transforms: {
		from: [
			{ type: 'block', blocks: ['tdvb/td-viewer'], transform: attributes => createBlock('b-blocks/td-viewer', attributes) },
			{ type: 'prefix', prefix: '3d', transform: () => createBlock('b-blocks/td-viewer') }
		],

		to: [
			{
				type: 'block', blocks: ['tdvb/td-viewer'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('tdvb/td-viewer', attributes)
			}
		]
	},

	// Build in Functions
	edit: Edit,

	save: () => null
});