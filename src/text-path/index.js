import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { textPathIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: textPathIcon,
	edit: Edit
});