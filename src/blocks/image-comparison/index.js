import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';
const icon = icons.imageCompare;

// Metadata
import metadata from './block.json';
const { name, title, description, category, keywords, supports, example } = metadata;

registerBlockType(name, {
    title, description, icon, category, keywords, supports, example,

    // Build In Functions
    edit: Edit,

    save: () => null,

    deprecated
});