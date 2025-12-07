
import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import './editor.scss';
import { testimonialsIcon } from '../utils/blocksIcon';

registerBlockType(metadata.name, {
	icon: testimonialsIcon,
	edit: Edit
});