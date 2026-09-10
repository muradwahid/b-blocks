import { registerBlockType } from '@wordpress/blocks';

import { codeHighlightIcon } from '../utils/blocksIcon';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import './editor.scss';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: codeHighlightIcon,
	edit: Edit,
	save: () => null
});
