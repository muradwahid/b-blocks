import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { focusStateOptions, pageStateOptions, pxUnits, stateOptions } from '../../../../utils/options';

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, header = {}, toolbar = {}, itemOptions = {}, viewButton = {}, downloadButton = {}, container = {}, headerStyle = {}, toolbarStyle = {}, card = {}, row = {}, icon = {}, fileName = {}, size = {}, date = {}, description = {}, author = {}, fileType = {}, badges = {}, pagination = {}, downloadBtn = {}, viewBtn = {}, items = [] } = attributes;
	const isList = 'list' === layout.template;

	const [itemState, setItemState] = useState('normal');
	const [textState, setTextState] = useState('normal');
	const [downloadState, setDownloadState] = useState('normal');
	const [viewState, setViewState] = useState('normal');
	const [fieldState, setFieldState] = useState('normal');
	const [pageState, setPageState] = useState('normal');
	// Active (the current page) exists only with page numbers; Load More shows Normal then.
	const pageShown = 'numbers' !== layout.paging && 'active' === pageState ? 'normal' : pageState;

	const stateSwitch = (value, setValue, options = stateOptions) => <ToggleGroupControl className='mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={value} onChange={(val) => setValue(val || 'normal')}>
		{options.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
	</ToggleGroupControl>;

	const padding = (group, value, label = __('Padding', 'b-blocks')) => <BoxControl className='mt10' label={<Flex justify='flex-start'>{label} <Device /></Flex>} values={value[device]?.padding} onChange={(val) => updateObj(group, val, device, 'padding')} />;

	// Text color + typography, Normal / Hover color: file name, size and date.
	const text = (group, value) => <>
		<Typography label={__('Typography', 'b-blocks')} value={value.typo} onChange={(val) => updateObj(group, val, 'typo')} />
		<ColorControl className='mt10' label={'hover' === textState ? __('Hover Color:', 'b-blocks') : __('Color:', 'b-blocks')} value={value[textState]?.color} onChange={(val) => updateObj(group, val, textState, 'color')} />
	</>;

	// The View and Download buttons share one shape.
	const button = (group, value, state, setState) => <>
		<Typography label={__('Typography', 'b-blocks')} value={value.typo} onChange={(val) => updateObj(group, val, 'typo')} />

		{padding(group, value)}

		{stateSwitch(state, setState)}

		<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={value[state]?.color?.text} onChange={(val) => updateObj(group, val, state, 'color', 'text')} />

		<Background key={`${group}-bg-${state}`} className='mt10' label={__('Background:', 'b-blocks')} value={value[state]?.color?.bg} isImage={false} onChange={(val) => updateObj(group, val, state, 'color', 'bg')} />

		<BorderBoxControl key={`${group}-border-${state}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={value[state]?.border} onChange={(val) => updateObj(group, val || {}, state, 'border')} />

		<BoxControl key={`${group}-radius-${state}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={value[state]?.[device]?.radius} onChange={(val) => updateObj(group, val, state, device, 'radius')} />
	</>;

	return <>
		<PanelBody className='bPlPanelBody' title={__('Container', 'b-blocks')} initialOpen={true}>
			<Background label={__('Background:', 'b-blocks')} value={container.bg} onChange={(val) => updateObj('container', val, 'bg')} />

			{padding('container', container)}
		</PanelBody>

		{header.show && <PanelBody className='bPlPanelBody' title={__('Header', 'b-blocks')} initialOpen={false}>
			<Background label={__('Background:', 'b-blocks')} value={headerStyle.bg} onChange={(val) => updateObj('headerStyle', val, 'bg')} />

			{padding('headerStyle', headerStyle)}

			<Typography className='mt10' label={__('Title Typography', 'b-blocks')} value={headerStyle.title?.typo} onChange={(val) => updateObj('headerStyle', val, 'title', 'typo')} />
			<ColorControl className='mt10' label={__('Title Color:', 'b-blocks')} value={headerStyle.title?.color} onChange={(val) => updateObj('headerStyle', val, 'title', 'color')} />

			<Typography className='mt10' label={__('Description Typography', 'b-blocks')} value={headerStyle.description?.typo} onChange={(val) => updateObj('headerStyle', val, 'description', 'typo')} />
			<ColorControl className='mt10' label={__('Description Color:', 'b-blocks')} value={headerStyle.description?.color} onChange={(val) => updateObj('headerStyle', val, 'description', 'color')} />
		</PanelBody>}

		{/* Style panels only for what the page shows (same defaults as the templates). */}
		{false !== toolbar.show && (false !== toolbar.showSearch || false !== toolbar.showTypeFilter || false !== toolbar.showSort || toolbar.showCopyList) && <PanelBody className='bPlPanelBody' title={__('Toolbar', 'b-blocks')} initialOpen={false}>
			<Background label={__('Background:', 'b-blocks')} value={toolbarStyle.bg} onChange={(val) => updateObj('toolbarStyle', val, 'bg')} />

			{padding('toolbarStyle', toolbarStyle)}

			<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Gap', 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={toolbarStyle[device]?.gap} units={pxUnits} onChange={(val) => updateObj('toolbarStyle', val, device, 'gap')} />

			{/* The search box and the filter and sort menus share one look. */}
			{(false !== toolbar.showSearch || false !== toolbar.showTypeFilter || false !== toolbar.showSort) && <>
				<h3 className='mt20'>{__('Search & Filters', 'b-blocks')}</h3>

				<Typography label={__('Typography', 'b-blocks')} value={toolbarStyle.field?.typo} onChange={(val) => updateObj('toolbarStyle', val, 'field', 'typo')} />

				<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Height', 'b-blocks')} <Device /></Flex>} value={toolbarStyle.field?.[device]?.height} labelPosition='edge' units={pxUnits} onChange={(val) => updateObj('toolbarStyle', val, 'field', device, 'height')} />

				{/* Inside the search box and the menus. The search icon and the menu arrow keep their room on top of it. */}
				<BoxControl key={`field-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={toolbarStyle.field?.[device]?.padding} onChange={(val) => updateObj('toolbarStyle', val, 'field', device, 'padding')} />

				{false !== toolbar.showSearch && <>
					<ColorControl className='mt10' label={__('Placeholder Color:', 'b-blocks')} value={toolbarStyle.field?.placeholder} onChange={(val) => updateObj('toolbarStyle', val, 'field', 'placeholder')} />
					<ColorControl className='mt10' label={__('Search Icon Color:', 'b-blocks')} value={toolbarStyle.field?.icon} onChange={(val) => updateObj('toolbarStyle', val, 'field', 'icon')} />
				</>}

				<RangeControl className='mt10' label={__('Transition (s)', 'b-blocks')} help={__('How long the change to the Focus look takes. 0 is instant.', 'b-blocks')} value={Number(toolbarStyle.field?.transition) || 0} min={0} max={2} step={0.1} onChange={(val) => updateObj('toolbarStyle', val || 0, 'field', 'transition')} __nextHasNoMarginBottom />

				{stateSwitch(fieldState, setFieldState, focusStateOptions)}

				<ColorControl key={`field-color-${fieldState}`} className='mt10' label={__('Text Color:', 'b-blocks')} value={toolbarStyle.field?.[fieldState]?.color} onChange={(val) => updateObj('toolbarStyle', val, 'field', fieldState, 'color')} />

				<Background key={`field-bg-${fieldState}`} className='mt10' label={__('Background:', 'b-blocks')} value={toolbarStyle.field?.[fieldState]?.bg} isImage={false} onChange={(val) => updateObj('toolbarStyle', val, 'field', fieldState, 'bg')} />

				<BorderBoxControl key={`field-border-${fieldState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={toolbarStyle.field?.[fieldState]?.border} onChange={(val) => updateObj('toolbarStyle', val || {}, 'field', fieldState, 'border')} />

				{'focus' === fieldState && <ColorControl className='mt10' label={__('Focus Ring Color:', 'b-blocks')} value={toolbarStyle.field?.focus?.ring} defaultColor='#0f766e' onChange={(val) => updateObj('toolbarStyle', val, 'field', 'focus', 'ring')} />}

				<BoxControl key={`field-radius-${fieldState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={toolbarStyle.field?.[fieldState]?.[device]?.radius} onChange={(val) => updateObj('toolbarStyle', val, 'field', fieldState, device, 'radius')} />
			</>}
		</PanelBody>}

		{isList ? <PanelBody className='bPlPanelBody' title={__('Rows', 'b-blocks')} initialOpen={false}>
			{stateSwitch(itemState, setItemState)}

			<Background key={`row-bg-${itemState}`} className='mt10' label={__('Row Background:', 'b-blocks')} value={'string' === typeof row[itemState]?.bg ? { type: 'solid', color: row[itemState].bg } : row[itemState]?.bg} isImage={false} onChange={(val) => updateObj('row', val, itemState, 'bg')} />

			<ColorControl className='mt10' label={__('Divider Color:', 'b-blocks')} value={row.divider} defaultColor='#e5e7eb' onChange={(val) => updateObj('row', val, 'divider')} />

			<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={row[device]?.radius} onChange={(val) => updateObj('row', val, device, 'radius')} />
		</PanelBody> :
			<PanelBody className='bPlPanelBody' title={__('Card', 'b-blocks')} initialOpen={false}>
				{padding('card', card)}

				<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={card[device]?.radius} onChange={(val) => updateObj('card', val, device, 'radius')} />

				{stateSwitch(itemState, setItemState)}

				<Background key={`card-bg-${itemState}`} className='mt10' label={__('Background:', 'b-blocks')} value={card[itemState]?.bg} onChange={(val) => updateObj('card', val, itemState, 'bg')} />

				<BorderBoxControl key={`card-border-${itemState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={card[itemState]?.border} onChange={(val) => updateObj('card', val || {}, itemState, 'border')} />

				<ShadowControl key={`card-shadow-${itemState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={card[itemState]?.shadow} onChange={(val) => updateObj('card', val, itemState, 'shadow')} />
			</PanelBody>}

		{!isList && false !== itemOptions.showIcon && <PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>
			<UnitControl __next40pxDefaultSize label={__('Size', 'b-blocks')} value={icon.size} units={pxUnits} onChange={(val) => updateObj('icon', val || '', 'size')} />

			<ColorControl className='mt10' label={__('Color:', 'b-blocks')} value={icon.normal?.color} onChange={(val) => updateObj('icon', val, 'normal', 'color')} />

			<ColorControl className='mt10' label={__('Hover Color:', 'b-blocks')} value={icon.hover?.color} onChange={(val) => updateObj('icon', val, 'hover', 'color')} />
		</PanelBody>}

		<PanelBody className='bPlPanelBody' title={__('Texts', 'b-blocks')} initialOpen={false}>
			{stateSwitch(textState, setTextState)}

			<h3 className='mt20'>{__('File Name', 'b-blocks')}</h3>
			{text('fileName', fileName)}

			{false !== itemOptions.showSize && <>
				<h3 className='mt20'>{__('Size', 'b-blocks')}</h3>
				{text('size', size)}
			</>}

			{false !== itemOptions.showDate && <>
				<h3 className='mt20'>{__('Date', 'b-blocks')}</h3>
				{text('date', date)}
			</>}

			{false !== itemOptions.showDescription && <>
				<h3 className='mt20'>{__('Description', 'b-blocks')}</h3>
				{text('description', description)}
			</>}

			{itemOptions.showAuthor && <>
				<h3 className='mt20'>{__('Author', 'b-blocks')}</h3>
				{text('author', author)}
			</>}

			{isList && false !== itemOptions.showType && <>
				<h3 className='mt20'>{__('File Type', 'b-blocks')}</h3>
				{text('fileType', fileType)}
			</>}
		</PanelBody>

		{/* Featured and New badges: shown once a document is featured or the New badge is on. */}
		{(0 < itemOptions.newDays || items.some((item) => item?.featured)) && <PanelBody className='bPlPanelBody' title={__('Badges', 'b-blocks')} initialOpen={false}>
			<h3>{__('Featured', 'b-blocks')}</h3>
			<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={badges.featured?.color} onChange={(val) => updateObj('badges', val, 'featured', 'color')} />
			<Background className='mt10' label={__('Background:', 'b-blocks')} value={badges.featured?.bg} isImage={false} onChange={(val) => updateObj('badges', val, 'featured', 'bg')} />

			<h3 className='mt20'>{__('New', 'b-blocks')}</h3>
			<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={badges.new?.color} onChange={(val) => updateObj('badges', val, 'new', 'color')} />
			<Background className='mt10' label={__('Background:', 'b-blocks')} value={badges.new?.bg} isImage={false} onChange={(val) => updateObj('badges', val, 'new', 'bg')} />
		</PanelBody>}

		{/* Load More or the page numbers: only when the list is split into pages. */}
		{0 < (Number(layout.perPage) || 0) && <PanelBody className='bPlPanelBody' title={'numbers' === layout.paging ? __('Page Numbers', 'b-blocks') : __('Load More Button', 'b-blocks')} initialOpen={false}>
			<Typography label={__('Typography', 'b-blocks')} value={pagination.typo} onChange={(val) => updateObj('pagination', val, 'typo')} />

			{/* Page numbers are fixed squares: padding is for the Load More button only. */}
			{'numbers' !== layout.paging && <BoxControl key={`pagination-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={pagination[device]?.padding} onChange={(val) => updateObj('pagination', val, device, 'padding')} />}

			{/* Space around the Load More button or the row of page numbers. */}
			<BoxControl key={`pagination-margin-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>} values={pagination[device]?.margin} onChange={(val) => updateObj('pagination', val, device, 'margin')} />

			<BoxControl key={`pagination-radius-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={pagination[device]?.radius} onChange={(val) => updateObj('pagination', val, device, 'radius')} />

			{/* The current page only exists with page numbers. */}
			{stateSwitch(pageShown, setPageState, 'numbers' === layout.paging ? pageStateOptions : stateOptions)}

			<ColorControl key={`pagination-color-${pageShown}`} className='mt10' label={__('Text Color:', 'b-blocks')} value={pagination[pageShown]?.color} onChange={(val) => updateObj('pagination', val, pageShown, 'color')} />
			<Background key={`pagination-bg-${pageShown}`} className='mt10' label={__('Background:', 'b-blocks')} value={pagination[pageShown]?.bg} isImage={false} onChange={(val) => updateObj('pagination', val, pageShown, 'bg')} />
			<BorderBoxControl key={`pagination-border-${pageShown}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={pagination[pageShown]?.border} onChange={(val) => updateObj('pagination', val || {}, pageShown, 'border')} />
		</PanelBody>}

		{viewButton.show && <PanelBody className='bPlPanelBody' title={__('View Button', 'b-blocks')} initialOpen={false}>
			{button('viewBtn', viewBtn, viewState, setViewState)}
		</PanelBody>}

		{downloadButton.show && <PanelBody className='bPlPanelBody' title={__('Download Button', 'b-blocks')} initialOpen={false}>
			{button('downloadBtn', downloadBtn, downloadState, setDownloadState)}
		</PanelBody>}
	</>;
};
export default Style;
