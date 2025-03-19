import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { qrCodeIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: qrCodeIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});