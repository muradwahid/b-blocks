import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { columnsIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled('b-blocks/row') && registerBlockType(metadata, {
	icon: columnsIcon,

	// Build in Functions
	edit: Edit,

	save: () => <InnerBlocks.Content />
});