import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { isBlockEnabled } from '../utils/functions';
import { timelineItemIcon } from '../utils/blocksIcon';
import { timelineBlockName } from './utils/options';

// Gate on the parent: a Timeline Item is unusable on its own, and its styles
// and editor styles ship with the Timeline block.
isBlockEnabled( timelineBlockName ) && registerBlockType( metadata, {
	icon: timelineItemIcon,
	edit: Edit,
	save: InnerBlocks.Content
} );
