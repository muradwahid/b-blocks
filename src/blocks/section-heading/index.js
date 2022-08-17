import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/section-heading/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.h,

	// Build In Functions
	edit: Edit,

	save: () => null
});