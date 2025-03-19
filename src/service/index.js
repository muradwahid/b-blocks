import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { servicesIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: servicesIcon,

	// Build in Functions
	edit: Edit,

	save: () => null
});