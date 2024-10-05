import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { servicesIcon } from '../services/utils/icons';

registerBlockType(metadata, {
	icon: servicesIcon,

	// Build in Functions
	edit: Edit,

	save: () => null
});