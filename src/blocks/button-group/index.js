import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Metadata
import metadata from '../../../inc/button-group/block.json';

registerBlockType(metadata, {
    icon: icons.buttonGroup,

    // Build In Functions
    edit: Edit,

    save: () => null
});