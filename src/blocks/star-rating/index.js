import { registerBlockType } from '@wordpress/blocks';

import metadata from '../../../inc/star-rating/block.json';
import Edit from './Edit';
import './editor.scss';
import { ratingIcon } from './utils/icons';

registerBlockType(metadata, {
    icon: ratingIcon,

    // Build in Functions
    edit: Edit,

    save: () => null,
});