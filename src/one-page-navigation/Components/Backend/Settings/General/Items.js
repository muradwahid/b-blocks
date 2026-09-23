import { useCallback, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

import { ItemsPanel } from '../../../../../../../bpl-tools/Components';

import { uniqueId } from '../../../../utils/data';
import ItemSettings from './ItemSettings';

const Items = (props) => {
	const { attributes, setAttributes, updateObj } = props;
	const { behavior = {}, items = [] } = attributes;

	const [activeIndex, setActiveIndex] = useState(0);

	const handleCopy = useCallback((index) => {
		const source = items[index] || {};

		setAttributes({ items: [...items.slice(0, index + 1), { ...source, id: uniqueId() }, ...items.slice(index + 1)] });

		setActiveIndex(index + 1);
	}, [JSON.stringify(items)]);


	const newItem = {
		id: uniqueId(),
		label: __('New Section', 'b-blocks'),
		sectionId: '',
		icon: { type: 'icon', icon: '', img: { url: '', id: '' }, svg: '' }
	};

	return <PanelBody className='bPlPanelBody' title={__('Navigation Items', 'b-blocks')} initialOpen={false}>

		<ItemsPanel
			attributes={attributes}
			setAttributes={setAttributes}
			activeIndex={activeIndex}
			setActiveIndex={setActiveIndex}
			arrKey='items'
			minItem={1}
			ItemSettings={ItemSettings}
			itemLabel={__('Item', 'b-blocks')}
			newItem={newItem}
			handleCopy={handleCopy}
			title='label'
			design='sortable'
		/>

		<ToggleControl
			className='mt10'
			label={__('Hide items with missing sections', 'b-blocks')}
			checked={behavior.hideMissingSections}
			onChange={(val) => updateObj('behavior', val, 'hideMissingSections')}
			help={__('Auto-hide items whose section is not on the page.', 'b-blocks')}
		/>
	</PanelBody>;
};

export default Items;
