import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { servicesIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
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