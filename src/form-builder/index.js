import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import './style.scss'
import { InnerBlocks } from '@wordpress/block-editor';
import { formBuilderIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: formBuilderIcon,
	edit: Edit,
	save: InnerBlocks.Content,
});