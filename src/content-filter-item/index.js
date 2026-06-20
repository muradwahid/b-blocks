import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { contentFilterItemIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

// Gate registration on the parent's enabled status (the child is useless without it).
isBlockEnabled('b-blocks/content-filter') && registerBlockType(metadata, {
	icon: contentFilterItemIcon,
	edit: Edit,
	save: InnerBlocks.Content,
});
