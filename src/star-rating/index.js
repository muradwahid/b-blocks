import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { starRatingIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: starRatingIcon,

	// Build in Functions
	edit: Edit,

	save: () => null,
});