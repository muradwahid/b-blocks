import { registerBlockType, createBlock } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { lottieIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
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