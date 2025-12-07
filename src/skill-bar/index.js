
import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { skillBarIcon } from '../utils/blocksIcon';

registerBlockType( metadata, {
	icon: skillBarIcon,
	edit: Edit,
	save,
} );
	