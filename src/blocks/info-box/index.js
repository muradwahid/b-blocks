import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/info-box/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.infoBox,

	// Build In Functions
	edit: Edit,

	save: () => null
});