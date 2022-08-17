import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/feature-boxes/block.json';
import Edit from './edit';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.featureBox,

	// Build In Functions
	edit: Edit,

	save: () => null
});