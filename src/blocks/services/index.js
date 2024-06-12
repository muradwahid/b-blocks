import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import metadata from '../../../inc/services/block.json';
import Edit from './Components/Backend/Edit';
import './child';
import './editor.scss';
import { servicesIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: servicesIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['services-section/services'], transform: attributes => createBlock('b-blocks/services', attributes) },
			{ type: 'prefix', prefix: 'slider', transform: () => createBlock('b-blocks/services') }
		],

		to: [
			{
				type: 'block', blocks: ['services-section/services'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('services-section/services', attributes)
			}
		]
	},

	// Build in Functions
	edit: Edit,

	save: () => <InnerBlocks.Content />
});