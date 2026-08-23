import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { InnerBlocks } from '@wordpress/block-editor';

import { isBlockEnabled } from '../utils/functions';

import { tableIcon } from '../utils/blocksIcon';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: tableIcon,
	edit: Edit,
	save: InnerBlocks.Content
});