import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { scrollToTopIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: scrollToTopIcon,
	edit: Edit
});