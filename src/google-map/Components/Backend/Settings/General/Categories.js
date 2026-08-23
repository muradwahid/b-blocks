import { __ } from '@wordpress/i18n';
import { Button, Dashicon, Flex, PanelBody, TextControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';
import { produce } from 'immer';

import { HexColorControl, Label } from '../../../../../../../bpl-tools/Components';

import { alignmentOptions } from '../../../../utils/data';
import { addNewCategory } from '../../../../utils/options';

const Categories = ({ attributes, setAttributes, updateObj }) => {
	const { categories = [], filterBar = {} } = attributes;

	const updateCategory = (index, key, value) => setAttributes({
		categories: produce(categories, (draft) => { draft[index][key] = value; })
	});

	const removeCategory = (index) => setAttributes({
		categories: categories.filter((_item, i) => i !== index)
	});

	return <PanelBody className='bPlPanelBody' title={__('Categories & Filter Bar', 'b-blocks')} initialOpen={false}>
		{categories.map((category, index) => <Flex key={category.id} className='mt10' align='flex-end' gap={2}>
			<TextControl className='flex2' value={category.label} onChange={(val) => updateCategory(index, 'label', val)} __nextHasNoMarginBottom />

			<HexColorControl label='' value={category.color} onChange={(val) => updateCategory(index, 'color', val)} />

			<Button isDestructive label={__('Remove', 'b-blocks')} onClick={() => removeCategory(index)}>
				<Dashicon icon='no' />
			</Button>
		</Flex>)}

		<Flex justify='center' className='addItem mt15'>
			<Button variant='primary' onClick={() => setAttributes({ categories: [...categories, addNewCategory(categories.length + 1)] })}>
				<Dashicon icon='plus' />
				{__('Add New Category', 'b-blocks')}
			</Button>
		</Flex>

		<hr />

		<ToggleControl
			label={__('Show Filter Bar', 'b-blocks')}
			checked={!!filterBar.show}
			onChange={(val) => updateObj('filterBar', !!val, 'show')}
			help={__('Lets visitors show only the markers in one category.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>

		{filterBar.show && <>
			<ToggleControl className='mt10' label={__('Include an “All” chip', 'b-blocks')} checked={false !== filterBar.showAll} onChange={(val) => updateObj('filterBar', !!val, 'showAll')} __nextHasNoMarginBottom />

			{false !== filterBar.showAll && <Flex className='mt10'>
				<Label className='flex1'>{__('“All” Label', 'b-blocks')}</Label>
				<TextControl className='flex1' value={filterBar.allLabel || ''} onChange={(val) => updateObj('filterBar', val, 'allLabel')} placeholder={__('All', 'b-blocks')} __nextHasNoMarginBottom />
			</Flex>}

			<Label className='mt10'>{__('Filter Bar Alignment', 'b-blocks')}</Label>
			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={filterBar.align || 'left'} onChange={(val) => updateObj('filterBar', val || 'left', 'align')}>
				{alignmentOptions.map((option) => <ToggleGroupControlOption key={option.value} label={option.label} value={option.value} />)}
			</ToggleGroupControl>
		</>}
	</PanelBody>;
};
export default Categories;
