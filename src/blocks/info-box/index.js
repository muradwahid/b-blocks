import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';
const icon = icons.infoBox;

// Metadata
import metadata from '../../../inc/info-box/block.json';

registerBlockType(metadata, {
    icon,

    // Build In Functions
    edit: Edit,

    save: () => null
});