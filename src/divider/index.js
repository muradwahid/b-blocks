import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { dividerIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled( metadata.name ) && registerBlockType( metadata, {
	icon: dividerIcon,

	// Build In Functions
	edit: Edit,

	// Server-rendered: nothing to persist in post_content beyond attributes.
	save: () => null
} );
