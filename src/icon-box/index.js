import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { iconBoxIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: iconBoxIcon,
	edit: Edit
});