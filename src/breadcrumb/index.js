import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { breadcrumbIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: breadcrumbIcon,
	edit: Edit
});