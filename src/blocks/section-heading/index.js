import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/section-heading/block.json';
import Edit from './Edit';
import './editor.scss';
import { hIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: hIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});