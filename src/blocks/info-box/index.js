import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/info-box/block.json';
import Edit from './Edit';
import './editor.scss';
import { infoBoxIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: infoBoxIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});