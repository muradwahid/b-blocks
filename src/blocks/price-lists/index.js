import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/price-lists/block.json';
import Edit from './Edit';
import './editor.scss';
import { priceListIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: priceListIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});