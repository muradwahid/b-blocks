import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { imageIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: imageIcon,
	edit: Edit
});