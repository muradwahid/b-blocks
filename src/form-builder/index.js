import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { blockIcon } from './utils/icons';
import './style.scss'
import { InnerBlocks } from '@wordpress/block-editor';

registerBlockType(metadata, {
	icon: blockIcon,
	edit: Edit,
	save: InnerBlocks.Content,
});