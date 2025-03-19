import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { mailIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: mailIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});