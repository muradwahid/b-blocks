import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/button/block.json';
import Edit from './Components/Backend/Edit';
import './editor.scss';
import { buttonIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: buttonIcon,

	// Build in Functions
	edit: Edit,

	save: () => null
});