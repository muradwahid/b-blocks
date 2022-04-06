import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/button-group/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.buttonGroup,

	// Build In Functions
	edit: Edit,

	save: () => null
});