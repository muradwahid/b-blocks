
import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { skillBarIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) &&registerBlockType( metadata, {
	icon: skillBarIcon,
	edit: Edit,
	save,
} );
	