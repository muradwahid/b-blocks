import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/block-editor';

import './editor.scss';
import metadata from './block.json';
import Edit from './Components/Backend/Edit';
import { containerIcon } from '../utils/blocksIcon';
import { isBlockEnabled } from '../utils/functions';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
	icon: containerIcon,
	edit: Edit,
	save: () => <InnerBlocks.Content />,
	// A container inserted from now on starts with a 20px gap between its blocks. The attribute default stays empty,
	// so containers already on a site keep the spacing they have.
	variations: [{
		name: 'container',
		isDefault: true,
		attributes: {
			itemsLayout: {
				desktop: { direction: '', justify: '', align: '', wrap: '', columnGap: '20px', rowGap: '20px' },
				tablet: { direction: '', justify: '', align: '', wrap: '', columnGap: '', rowGap: '' },
				mobile: { direction: '', justify: '', align: '', wrap: '', columnGap: '', rowGap: '' }
			}
		}
	}]
});