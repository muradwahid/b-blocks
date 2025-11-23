import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { isBlockEnabled } from '../utils/functions';
import { emojiStack } from '../utils/blocksIcon';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: emojiStack,
	edit: Edit
});
