import { registerBlockType, createBlock } from '@wordpress/blocks';

import metadata from '../../../inc/lottie-player/block.json';
import Edit from './Edit';
import './editor.scss';
import { lottieIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: lottieIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['lpb/lottie-player'], transform: attributes => createBlock('b-blocks/lottie-player', attributes) },
			{ type: 'prefix', prefix: 'lottie', transform: () => createBlock('b-blocks/lottie-player') }
		],

		to: [
			{
				type: 'block', blocks: ['lpb/lottie-player'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('lpb/lottie-player', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => null
});