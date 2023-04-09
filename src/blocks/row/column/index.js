import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import metadata from '../../../../inc/row/column/block.json';
import Edit from './Edit';
import './editor.scss';
import { columnsIcon } from '../utils/icons';

registerBlockType(metadata, {
	icon: columnsIcon,

	// Build in Functions
	edit: Edit,

	save: () => <InnerBlocks.Content />
});