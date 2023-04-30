import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/flip-boxes/block.json';
import Edit from './Edit';
import './editor.scss';
import { flipBoxIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: flipBoxIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});