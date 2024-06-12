import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../../inc/services/child/block.json';
import Edit from './Components/Backend/Edit';
import { servicesIcon } from '../utils/icons';

registerBlockType(metadata, {
	icon: servicesIcon,

	// Build in Functions
	edit: Edit,

	save: () => null
});