import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/button-group/block.json';
import Edit from './Edit';
import './editor.scss';
import { buttonGroupIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: buttonGroupIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});