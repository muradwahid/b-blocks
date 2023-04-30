import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/image-gallery/block.json';
import Edit from './Edit';
import './editor.scss';
import { galleryIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: galleryIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});