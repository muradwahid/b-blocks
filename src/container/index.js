import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { containerIcon } from '../utils/blocksIcon';

registerBlockType(metadata, {
	icon: containerIcon,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
	variations: [{ isDefault: true }]
});