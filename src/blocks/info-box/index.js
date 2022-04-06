import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/info-box/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.infoBox,

	// Build In Functions
	edit: Edit,

	save: () => null
});