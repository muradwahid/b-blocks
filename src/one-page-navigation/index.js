import { registerBlockType } from '@wordpress/blocks';

import { onePageNavigationIcon } from '../utils/blocksIcon';

import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import './editor.scss';
import { isBlockEnabled } from '../utils/functions';
//b-blocks/one-page-navigation
isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: onePageNavigationIcon,
	edit: Edit,
	save: () => null
});
