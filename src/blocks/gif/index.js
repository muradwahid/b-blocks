import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/gif/block.json';
import Edit from './Edit';
import './editor.scss';
import { gifIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: gifIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});