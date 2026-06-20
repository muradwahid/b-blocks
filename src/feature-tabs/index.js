import { registerBlockType } from '@wordpress/blocks';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { featureTabsIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: featureTabsIcon,
	edit: Edit,
	save: () => null
});
