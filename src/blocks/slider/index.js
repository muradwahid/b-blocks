import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icons
import icons from '../../Const/icons';
const icon = icons.slider;

// Metadata
import metadata from './block.json';
const { name, example, title, description, category, keywords, supports } = metadata;

// Deprecated
import deprecated from './deprecated';

registerBlockType(name, {
    title, description, icon, category, keywords, supports, example,

    // Build In Functions
    edit: Edit,

    save: () => null,

    deprecated
});