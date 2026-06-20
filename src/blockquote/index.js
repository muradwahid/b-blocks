import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { blockquoteIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: blockquoteIcon,

	// Build In Functions
	edit: Edit,

	save: () => null
});
