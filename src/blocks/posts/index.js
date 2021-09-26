import { registerBlockType } from '@wordpress/blocks';

// Import Files
import Edit from './edit';
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';
const icon = icons.article;

// Metadata
import metadata from './block.json';
const { name, example, title, description, category, keywords, supports } = metadata;

registerBlockType(name, {
    title, description, icon, category, keywords, supports, example,

    // Build In Functions
    edit: Edit,

    save: () => null,

    deprecated
});