import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/feature-boxes/block.json';
import Edit from './Edit';
import './editor.scss';
import { featureBoxIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: featureBoxIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});