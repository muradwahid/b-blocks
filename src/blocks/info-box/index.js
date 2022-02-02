import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/info-box/block.json';

registerBlockType(metadata, {
    icon: icons.infoBox,

    // Build In Functions
    edit: Edit,

    save: () => null
});