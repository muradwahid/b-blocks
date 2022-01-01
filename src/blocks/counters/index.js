import { registerBlockType } from '@wordpress/blocks';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icons
import icons from '../../Const/icons';
const icon = icons.counters;

// Metadata
import metadata from '../../../inc/counters/block.json';

registerBlockType(metadata, {
    icon,

    // Build In Functions
    edit: Edit,

    save: () => null
});