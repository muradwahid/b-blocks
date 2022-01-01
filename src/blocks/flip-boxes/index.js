import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';
const icon = icons.flipBox;

// Metadata
import metadata from '../../../inc/flip-boxes/block.json';

registerBlockType(metadata, {
    icon,

    // Build In Functions
    edit: Edit,

    save: () => null
});