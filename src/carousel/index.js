import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
// import save from './save';
import { carouselBlockIcon } from '../utils/blocksIcon';
import { InnerBlocks } from '@wordpress/block-editor';
// import Deprecated1 from './deprecated/deprecated1';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: carouselBlockIcon,
	edit: Edit,
	save: InnerBlocks.Content
	// save,
	// deprecated: [
	// 	{
	// 		attributes: {
	// 			...metadata.attributes	
	// 		},
	// 		save: Deprecated1,
	// 		migrate: (attributes) => {
	// 			return attributes;
	// 		}
	// 	}
	// ]
});