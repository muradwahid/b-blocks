import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import metadata from '../../../../inc/row/column/block.json';
import Edit from './Edit';
import icons from '../../../Const/icons';

registerBlockType(metadata, {
	icon: 'columns',

	// Build in Functions
	edit: Edit,

	save: () => <InnerBlocks.Content />
});