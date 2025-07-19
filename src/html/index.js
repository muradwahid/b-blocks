import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { isBlockEnabled } from '../utils/functions';
import { htmlIcon } from '../utils/blocksIcon';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: htmlIcon,
	edit: Edit
});