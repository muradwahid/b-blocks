import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';
const icon = icons.featureBox;

// Metadata
import metadata from '../../../inc/feature-boxes/block.json';

registerBlockType(metadata, {
    icon,

    // Build In Functions
    edit: Edit,

    save: () => null
});