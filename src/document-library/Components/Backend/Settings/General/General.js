import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, SelectControl, TextControl, TextareaControl, ToggleControl, __experimentalNumberControl as NumberControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device, ItemsPanel } from '../../../../../../../bpl-tools/Components';
import ItemSettings from './ItemSettings';
import { newItem } from '../../../../utils/common';
import { headerPresets } from '../../../../utils/data';
import { alignOptions, densityOptions, filterByOptions, pagingOptions, presetOptions, pxUnits, sortOptions, templateOptions, titleTagOptions, viewActionOptions, viewerOptions } from '../../../../utils/options';

const General = ({ attributes, setAttributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, header = {}, toolbar = {}, itemOptions = {}, viewButton = {}, downloadButton = {}, headerStyle = {} } = attributes;
	const { template = 'grid', perPage = 0, listDensity = 'comfortable', paging = 'loadMore' } = layout;

	const [activeIndex, setActiveIndex] = useState(0);

	const toggle = (group, value, prop, label) => <ToggleControl className='mt10' label={label} checked={value[prop]} onChange={(val) => updateObj(group, val, prop)} />;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Documents', 'b-blocks')} initialOpen={true}>
			<ItemsPanel
				attributes={attributes}
				setAttributes={setAttributes}
				arrKey='items'
				newItem={newItem()}
				itemLabel={__('Document', 'b-blocks')}
				title='title'
				design='sortable'
				minItem={0}
				activeIndex={activeIndex}
				setActiveIndex={setActiveIndex}
				ItemSettings={ItemSettings}
			/>
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={false}>
			<SelectControl label={__('Template', 'b-blocks')} value={template} options={templateOptions} labelPosition='edge' onChange={(val) => updateObj('layout', val, 'template')} __next40pxDefaultSize __nextHasNoMarginBottom />

			{'grid' === template ? <>
				<RangeControl className='mt10' label={<>{__('Columns', 'b-blocks')} <Device /></>} value={layout[device]?.columns || ''} min={1} max={6} allowReset onChange={(val) => updateObj('layout', val || '', device, 'columns')} __nextHasNoMarginBottom />

				<UnitControl className='mt10' __next40pxDefaultSize label={<>{__('Gap', 'b-blocks')} <Device /></>} value={layout[device]?.gap} units={pxUnits} onChange={(val) => updateObj('layout', val || '', device, 'gap')} />
			</> :
				<SelectControl className='mt10' label={__('Row Density', 'b-blocks')} value={listDensity} labelPosition='edge' options={densityOptions} onChange={(val) => updateObj('layout', val, 'listDensity')} __next40pxDefaultSize __nextHasNoMarginBottom />}

			<NumberControl className='mt10' label={__('Documents per Page', 'b-blocks')} help={__('0 shows every document.', 'b-blocks')} value={perPage} min={0} onChange={(val) => updateObj('layout', Math.max(0, parseInt(val, 10) || 0), 'perPage')} />

			<SelectControl className='mt10' label={__('Title Tag', 'b-blocks')} help={__('Heading level of each document title, to fit the headings around the block.', 'b-blocks')} value={layout.titleTag || 'h3'} labelPosition='edge' options={titleTagOptions} onChange={(val) => updateObj('layout', val, 'titleTag')} __next40pxDefaultSize __nextHasNoMarginBottom />

			{0 < perPage && <SelectControl className='mt10' label={__('Paging', 'b-blocks')} value={paging} options={pagingOptions} labelPosition='edge' onChange={(val) => updateObj('layout', val, 'paging')} __next40pxDefaultSize __nextHasNoMarginBottom />}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Header', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Header', 'b-blocks')} checked={header.show} onChange={(val) => updateObj('header', val, 'show')} />

			{header.show && <>
				<TextControl className='mt10' label={__('Title', 'b-blocks')} value={header.title} onChange={(val) => updateObj('header', val, 'title')} __next40pxDefaultSize __nextHasNoMarginBottom />

				<TextareaControl className='mt10' label={__('Description', 'b-blocks')} value={header.description} onChange={(val) => updateObj('header', val, 'description')} rows={2} __nextHasNoMarginBottom />

				<SelectControl className='mt10' label={__('Alignment', 'b-blocks')} value={header.align} options={alignOptions} labelPosition='edge' onChange={(val) => updateObj('header', val, 'align')} __next40pxDefaultSize __nextHasNoMarginBottom />

				<SelectControl
					className='mt10'
					label={__('Color Preset', 'b-blocks')}
					help={__('Sets the header background, title and description colors together.', 'b-blocks')}
					labelPosition='edge'
					value={header.preset}
					options={presetOptions}
					onChange={(val) => setAttributes({
						header: { ...header, preset: val },
						headerStyle: {
							...headerStyle,
							bg: { type: 'solid', color: headerPresets[val].bg },
							title: { ...headerStyle.title, color: headerPresets[val].title },
							description: { ...headerStyle.description, color: headerPresets[val].description }
						}
					})}
					__next40pxDefaultSize
					__nextHasNoMarginBottom
				/>
			</>}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Toolbar', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Show Toolbar', 'b-blocks')} checked={toolbar.show} onChange={(val) => updateObj('toolbar', val, 'show')} />

			{toolbar.show && <>
				{toggle('toolbar', toolbar, 'showSearch', __('Search Box', 'b-blocks'))}
				{toggle('toolbar', toolbar, 'showTypeFilter', __('Filter', 'b-blocks'))}

				{toolbar.showTypeFilter && <SelectControl className='mt10' label={__('Filter By', 'b-blocks')} help={'category' === toolbar.filterBy ? __('Give documents a category in the Documents panel.', 'b-blocks') : undefined} value={toolbar.filterBy || 'type'} options={filterByOptions} onChange={(val) => updateObj('toolbar', val, 'filterBy')} __next40pxDefaultSize __nextHasNoMarginBottom />}
				{toggle('toolbar', toolbar, 'showSort', __('Sort By', 'b-blocks'))}
				{toggle('toolbar', toolbar, 'showCopyList', __('Copy Links Button', 'b-blocks'))}
			</>}

			<SelectControl className='mt10' label={__('Initial Order', 'b-blocks')} help={__('How documents are ordered when the page opens.', 'b-blocks')} value={toolbar.defaultSort || 'default'} options={sortOptions} onChange={(val) => updateObj('toolbar', val, 'defaultSort')} __next40pxDefaultSize __nextHasNoMarginBottom />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Item Content', 'b-blocks')} initialOpen={false}>
			{toggle('itemOptions', itemOptions, 'showIcon', 'list' === template ? __('File Badge', 'b-blocks') : __('File Icon', 'b-blocks'))}
			{toggle('itemOptions', itemOptions, 'showDescription', __('Description', 'b-blocks'))}
			{toggle('itemOptions', itemOptions, 'showSize', __('Size', 'b-blocks'))}
			{toggle('itemOptions', itemOptions, 'showDate', __('Date', 'b-blocks'))}
			{toggle('itemOptions', itemOptions, 'showAuthor', __('Author', 'b-blocks'))}
			{'list' === template && toggle('itemOptions', itemOptions, 'showType', __('File Type', 'b-blocks'))}

			<NumberControl className='mt10' label={__('New Badge (days)', 'b-blocks')} help={__('Media Library documents uploaded within this many days get a New badge. 0 turns it off.', 'b-blocks')} value={itemOptions.newDays || 0} min={0} onChange={(val) => updateObj('itemOptions', Math.max(0, parseInt(val, 10) || 0), 'newDays')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Buttons', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('View Button', 'b-blocks')} checked={viewButton.show} onChange={(val) => updateObj('viewButton', val, 'show')} />

			{viewButton.show && <>
				{toggle('viewButton', viewButton, 'showText', __('Show Text on View Button', 'b-blocks'))}

				<TextControl className='mt10' label={__('View Text', 'b-blocks')} value={viewButton.text} onChange={(val) => updateObj('viewButton', val, 'text')} __next40pxDefaultSize __nextHasNoMarginBottom />

				<SelectControl className='mt10' label={__('View Opens', 'b-blocks')} value={viewButton.action || 'modal'} options={viewActionOptions} onChange={(val) => updateObj('viewButton', val, 'action')} __next40pxDefaultSize __nextHasNoMarginBottom />

				{'newtab' !== viewButton.action && <SelectControl className='mt10' label={__('Viewer', 'b-blocks')} value={viewButton.viewer} options={viewerOptions} onChange={(val) => updateObj('viewButton', val, 'viewer')} __next40pxDefaultSize __nextHasNoMarginBottom />}
			</>}

			<ToggleControl className='mt20' label={__('Download Button', 'b-blocks')} checked={downloadButton.show} onChange={(val) => updateObj('downloadButton', val, 'show')} />

			{downloadButton.show && <>
				{toggle('downloadButton', downloadButton, 'showText', __('Show Text on Download Button', 'b-blocks'))}

				<TextControl className='mt10' label={__('Download Text', 'b-blocks')} value={downloadButton.text} onChange={(val) => updateObj('downloadButton', val, 'text')} __next40pxDefaultSize __nextHasNoMarginBottom />
			</>}
		</PanelBody>
	</>;
};
export default General;