import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { isBlockEnabled } from '../utils/functions';
import { timelineIcon } from '../utils/blocksIcon';

isBlockEnabled( metadata.name ) && registerBlockType( metadata, {
	icon: timelineIcon,
	edit: Edit,
	save: InnerBlocks.Content
} );
