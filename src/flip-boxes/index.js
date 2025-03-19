import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { flipBoxIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: flipBoxIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});