import { registerBlockType } from '@wordpress/blocks';

import { instagramIcon } from '../utils/blocksIcon';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import './editor.scss';

registerBlockType(metadata, {
	icon: instagramIcon,
	edit: Edit,
	save: () => null
});
