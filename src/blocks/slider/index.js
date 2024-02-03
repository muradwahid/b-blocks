import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/slider/block.json';
import Edit from './Components/Backend/Edit';
import './editor.scss';
import { sliderIcon } from './utils/icons';

registerBlockType(metadata, {
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