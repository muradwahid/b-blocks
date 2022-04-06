import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/image-gallery/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.gallery,

	// Build In Functions
	edit: Edit,

	save: () => null
});