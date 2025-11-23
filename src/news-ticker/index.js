import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import Edit from './edit';
import metadata from './block.json';
import { isBlockEnabled } from '../utils/functions';
import { newsTicker } from '../utils/blocksIcon';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: newsTicker,
	edit: Edit,
} );
