import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { gifIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: gifIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});