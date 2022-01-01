import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';
const icon = icons.priceList;

// Metadata
import metadata from '../../../inc/price-lists/block.json';

registerBlockType(metadata, {
    icon,

    // Build In Functions
    edit: Edit,

    save: () => null
});