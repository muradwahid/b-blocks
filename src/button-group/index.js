import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { buttonGroupIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: buttonGroupIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});