import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import metadata from '../../../inc/row/block.json';
import Edit from './Edit';
import './column';
import './editor.scss';
import { rowIcon } from './utils/icons';

registerBlockType(metadata, {
	icon: rowIcon,

	// Build in Functions
	edit: Edit,

	save: () => <InnerBlocks.Content />
});