import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/image-gallery/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.gallery,

	// Build In Functions
	edit: Edit,

	save: () => null
});