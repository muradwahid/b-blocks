import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { advancedTabsIcon } from '../utils/blocksIcon';
import save from './save';

registerBlockType(metadata, {
	icon: advancedTabsIcon,
	edit: Edit,
	save
});