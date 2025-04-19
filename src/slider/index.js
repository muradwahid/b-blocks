import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { sliderIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: sliderIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['csb/content-slider-block'], transform: attributes => createBlock('b-blocks/slider', attributes) },
			{ type: 'prefix', prefix: 'slider', transform: () => createBlock('b-blocks/slider') }
		],

		to: [
			{
				type: 'block', blocks: ['csb/content-slider-block'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('csb/content-slider-block', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});