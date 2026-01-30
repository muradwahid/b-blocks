import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { InnerBlocks } from '@wordpress/block-editor';
import { toggleContentIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: toggleContentIcon,
	edit: Edit,
	save:InnerBlocks.Content
});