import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/flip-boxes/block.json';
import Edit from './Edit';
import './editor.scss';
import icons from '../../Const/icons';

registerBlockType(metadata, {
	icon: icons.flipBox,

	// Build In Functions
	edit: Edit,

	save: () => null
});