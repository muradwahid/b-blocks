import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/qr-code/block.json';
import Edit from './Edit';
import './editor.scss';
import { qrCodeIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: qrCodeIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});