import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import metadata from '../../../inc/row/block.json';
import Edit from './Edit';
import './column';
import './editor.scss';
import icons from '../../utils/icons';

registerBlockType(metadata, {
	icon: icons.row,

	// Build in Functions
	edit: Edit,

	save: () => <InnerBlocks.Content />
});