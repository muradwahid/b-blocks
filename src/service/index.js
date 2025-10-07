import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { servicesIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled('b-blocks/services') && registerBlockType(metadata, {
	icon: servicesIcon,

	// Build in Functions
	edit: Edit,

	save: () => null
});