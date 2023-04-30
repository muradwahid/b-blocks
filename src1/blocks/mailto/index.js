import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/mailto/block.json';
import Edit from './Edit';
import './editor.scss';
import { mailIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: mailIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});