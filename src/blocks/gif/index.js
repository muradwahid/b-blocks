import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/gif/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.gif,

	// Build In Functions
	edit: Edit,

	save: () => null
});