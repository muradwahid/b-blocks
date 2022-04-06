import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/slider/block.json';
import Edit from './Edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.slider,

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