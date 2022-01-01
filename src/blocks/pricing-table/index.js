import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';
const icon = icons.pricingTable;

// Metadata
import metadata from '../../../inc/pricing-table/block.json';

registerBlockType(metadata, {
    icon,

    // Build in Functions
    edit: Edit,

    save: () => null
});