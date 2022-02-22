import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/flip-boxes/block.json';

registerBlockType(metadata, {
	icon: icons.flipBox,

	// Build In Functions
	edit: Edit,

	save: () => null
});