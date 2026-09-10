import { useMemo } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ItemsPanel } from '../../../../../../../bpl-tools/Components';

import { newItem } from '../../../../utils/options';
import ItemSettings from './ItemSettings';

const Items = ({ attributes, setAttributes, activeIndex, setActiveIndex }) => {
	const { items = [] } = attributes;

	// Only rebuilt when the list changes, or every render mints a wasted id.
	const nextItem = useMemo(() => newItem(items), [items.length]);

	return <PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Segment Items', 'b-blocks')} initialOpen={false}>
		<ItemsPanel
			attributes={attributes}
			setAttributes={setAttributes}
			activeIndex={activeIndex}
			setActiveIndex={setActiveIndex}
			arrKey='items'
			minItem={1}
			ItemSettings={ItemSettings}
			itemLabel={__('Segment', 'b-blocks')}
			newItem={nextItem}
			title='buttonLabel'
			design='sortable'
		/>
	</PanelBody>;
};

export default Items;
