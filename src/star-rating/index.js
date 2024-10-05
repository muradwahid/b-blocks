import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { ratingIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: ratingIcon,

	// Build in Functions
	edit: Edit,

	save: () => null,
});