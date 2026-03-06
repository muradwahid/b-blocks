import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { InnerBlocks } from '@wordpress/block-editor';
import { carouselBlockIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: carouselBlockIcon,
	edit: Edit,
	save: InnerBlocks.Content
});