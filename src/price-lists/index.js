import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { priceListIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: priceListIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});