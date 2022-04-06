import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/qr-code/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.qrCode,

	// Build In Functions
	edit: Edit,

	save: () => null
});