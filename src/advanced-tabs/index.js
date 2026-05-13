import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './style.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { advancedTabsIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';
isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: advancedTabsIcon,
	edit: Edit,
	save: InnerBlocks.Content,
	deprecated: [
		{
			attributes: {
				...metadata.attributes,
				oldHTML: {
					type: 'string',
					source: 'html',
				}
			},
			isEligible: () => {
				return true;
			},
			migrate: (attributes, innerBlocks) => {
				return [attributes, innerBlocks];
			},
			save: () => null,
		}
	]
});