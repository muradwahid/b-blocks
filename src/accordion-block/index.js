import { registerBlockType } from '@wordpress/blocks';

import './style.scss';
import Edit from './Components/Backend/Edit';
// import Edit from './edit';
import metadata from './block.json';
import { telexAccordionIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata.name, {
	icon: telexAccordionIcon,
	edit: Edit
} );
