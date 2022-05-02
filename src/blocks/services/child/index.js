import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../../inc/services/child/block.json';
import Edit from './Edit';
import icons from '../../../Const/icons';

registerBlockType(metadata, {
	icon: icons.services,

	// Build in Functions
	edit: Edit,

	save: () => null
});