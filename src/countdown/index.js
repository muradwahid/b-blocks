import { registerBlockType, createBlock } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { countdownIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: countdownIcon,

	transforms: {
		from: [
			{ type: 'block', blocks: ['ctb/countdown-time'], transform: attributes => createBlock('b-blocks/countdown', attributes) },
			{ type: 'prefix', prefix: 'count', transform: () => createBlock('b-blocks/countdown') }
		],

		to: [
			{
				type: 'block', blocks: ['ctb/countdown-time'], isMatch: attributes => {
					if (attributes) return true;
					return false;
				},
				transform: attributes => createBlock('ctb/countdown-time', attributes)
			}
		]
	},

	// Build In Functions
	edit: Edit,

	save: () => <InnerBlocks.Content />
});