import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, SelectControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { alignOptions, fieldStateOptions, footerAlignOptions, stateOptions, thumbPositionOptions } from '../../../../utils/options';
import { PRESET_HIDDEN, PRESET_STYLES } from '../../../../utils/presets';
import { perUnit, pxUnit } from '../../../../../../../bpl-tools/utils/options';

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const { preset = 'preset-1', search = {}, totalResults = {}, viewAll = {}, searchField = {}, button = {}, thumb = {}, field = {}, searchIcon = {}, closeIcon = {}, loader = {}, resultBox = {}, item = {}, total = {}, notFound = {}, searchBtn = {}, viewAllBtn = {} } = attributes;

	// Style panels follow what the General tab shows.
	const { showImage = true, showExcerpt = true, showDate = false, showType = false, highlight = true } = search;
	const { show: showTotal = true } = totalResults;
	const { show: showViewAll = true } = viewAll;
	const { showIcon: showSearchIcon = true } = searchField;
	const { show: showButton = true } = button;

	const [fieldState, setFieldState] = useState('normal');
	const [boxState, setBoxState] = useState('normal');
	const [itemState, setItemState] = useState('normal');
	const [btnState, setBtnState] = useState('normal');
	const [viewState, setViewState] = useState('normal');

	const toBg = (val) => (typeof val === 'string' ? { type: 'solid', color: val } : val);

	// A control the chosen preset turns off (PRESET_HIDDEN) is hidden while the block still has the preset's value; a
	// value changed before (or saved by an older version) keeps its control so it stays editable. One closure instead of
	// 15 copies of the same check.
	const presetData = PRESET_STYLES[preset] || {};
	const isOff = (key, value, presetValue) => (PRESET_HIDDEN[preset] || []).includes(key) && JSON.stringify(value) === JSON.stringify(presetValue);

	return <>
		<PanelBody className='bPlPanelBody' title={__('Search Field', 'b-blocks')} initialOpen={true}>
			{!isOff('field.bg', field.bg, presetData.field?.bg) && <Background label={__('Background:', 'b-blocks')} value={toBg(field.bg)} isImage={false} onChange={(val) => updateObj('field', val, 'bg')} />}

			<Typography className={isOff('field.bg', field.bg, presetData.field?.bg) ? '' : 'mt10'} label={__('Typography', 'b-blocks')} value={field.typo} onChange={(val) => updateObj('field', val, 'typo')} />

			<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Height', 'b-blocks')} <Device /></Flex>} labelPosition='edge' value={field[device]?.height} units={[pxUnit(), perUnit(100)]} onChange={(val) => updateObj('field', val || '', device, 'height')} />

			<BoxControl key={`field-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={field[device]?.padding} onChange={(val) => updateObj('field', val, device, 'padding')} />

			{ /* Hover also shows while the visitor types in the field, unless Focus has its own value. */}
			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={fieldState} onChange={(val) => setFieldState(val || 'normal')}>
				{fieldStateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>

			<ColorControl key={`field-color-${fieldState}`} className='mt10' label={__('Text Color:', 'b-blocks')} value={field[fieldState]?.color} onChange={(val) => updateObj('field', val, fieldState, 'color')} />
			<ColorControl key={`field-ph-${fieldState}`} className='mt10' label={__('Placeholder Color:', 'b-blocks')} value={field[fieldState]?.placeholder} onChange={(val) => updateObj('field', val, fieldState, 'placeholder')} />

			<BorderBoxControl key={`field-border-${fieldState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={field[fieldState]?.border} onChange={(val) => updateObj('field', val || {}, fieldState, 'border')} />
			{!isOff(`field.${fieldState}.radius`, field[fieldState]?.[device]?.radius, presetData.field?.[fieldState]?.[device]?.radius) && <BoxControl key={`field-radius-${fieldState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={field[fieldState]?.[device]?.radius} onChange={(val) => updateObj('field', val, fieldState, device, 'radius')} />}
			<ShadowControl key={`field-shadow-${fieldState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={field[fieldState]?.shadow} onChange={(val) => updateObj('field', val, fieldState, 'shadow')} />

			{showSearchIcon && <>
				<h3 className='mt20'>{__('Search Icon', 'b-blocks')}</h3>
				<UnitControl __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Icon Size', 'b-blocks')} <Device /></Flex>} value={searchIcon[device]?.size} labelPosition='edge' onChange={(val) => updateObj('searchIcon', val || '', device, 'size')} />
				<ColorControl className='mt10' label={__('Icon Color:', 'b-blocks')} value={searchIcon.color} onChange={(val) => updateObj('searchIcon', val, 'color')} />
			</>}

			<h3 className='mt20'>{__('Search Close Icon', 'b-blocks')}</h3>
			<ColorControl label={__('Icon Color:', 'b-blocks')} value={closeIcon.color} onChange={(val) => updateObj('closeIcon', val, 'color')} />
			{!isOff('closeIcon.bg', closeIcon.bg, presetData.closeIcon?.bg) && <ColorControl className='mt10' label={__('Circle Color:', 'b-blocks')} value={closeIcon.bg} onChange={(val) => updateObj('closeIcon', val, 'bg')} />}

			<h3 className='mt20'>{__('Search Loader', 'b-blocks')}</h3>
			<ColorControl label={__('Loader Color:', 'b-blocks')} value={loader.color} onChange={(val) => updateObj('loader', val, 'color')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Search Result Box', 'b-blocks')} initialOpen={false}>
			<Background label={__('Background:', 'b-blocks')} value={toBg(resultBox.bg)} isImage={false} onChange={(val) => updateObj('resultBox', val, 'bg')} />

			<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Width', 'b-blocks')} <Device /></Flex>} value={resultBox[device]?.width} labelPosition='edge' onChange={(val) => updateObj('resultBox', val || '', device, 'width')} />
			<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Max Height', 'b-blocks')} <Device /></Flex>} help={__('Longer result lists scroll. Empty: no limit.', 'b-blocks')} value={resultBox[device]?.maxHeight || ''} labelPosition='edge' onChange={(val) => updateObj('resultBox', val || '', device, 'maxHeight')} />
			{(showTotal || showViewAll) && <SelectControl className='mt10' label={__('Footer Alignment', 'b-blocks')} labelPosition='edge' value={resultBox.footerAlign || 'space-between'} options={footerAlignOptions} onChange={(val) => updateObj('resultBox', val, 'footerAlign')} __next40pxDefaultSize __nextHasNoMarginBottom />}

			<BoxControl key={`resultBox-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={resultBox[device]?.padding} onChange={(val) => updateObj('resultBox', val, device, 'padding')} />
			<BoxControl key={`resultBox-margin-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>} values={resultBox[device]?.margin} onChange={(val) => updateObj('resultBox', val, device, 'margin')} />

			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={boxState} onChange={(val) => setBoxState(val || 'normal')}>
				{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>
			<BorderBoxControl key={`resultBox-border-${boxState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={resultBox[boxState]?.border} onChange={(val) => updateObj('resultBox', val || {}, boxState, 'border')} />
			{!isOff(`resultBox.${boxState}.radius`, resultBox[boxState]?.[device]?.radius, presetData.resultBox?.[boxState]?.[device]?.radius) && <BoxControl key={`resultBox-radius-${boxState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={resultBox[boxState]?.[device]?.radius} onChange={(val) => updateObj('resultBox', val, boxState, device, 'radius')} />}
			{!isOff(`resultBox.${boxState}.shadow`, resultBox[boxState]?.shadow, presetData.resultBox?.[boxState]?.shadow) && <ShadowControl key={`resultBox-shadow-${boxState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={resultBox[boxState]?.shadow} onChange={(val) => updateObj('resultBox', val, boxState, 'shadow')} />}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Search Content', 'b-blocks')} initialOpen={false}>
			<BoxControl key={`item-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={item[device]?.padding} onChange={(val) => updateObj('item', val, device, 'padding')} />
			<BoxControl key={`item-margin-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>} values={item[device]?.margin} onChange={(val) => updateObj('item', val, device, 'margin')} />

			<Typography className='mt10' label={__('Title Typography', 'b-blocks')} value={item.titleTypo} onChange={(val) => updateObj('item', val, 'titleTypo')} />
			{showExcerpt && <Typography className='mt10' label={__('Content Typography', 'b-blocks')} value={item.contentTypo} onChange={(val) => updateObj('item', val, 'contentTypo')} />}
			{(showDate || showType) && <Typography className='mt10' label={__('Date & Type Typography', 'b-blocks')} value={item.metaTypo} onChange={(val) => updateObj('item', val, 'metaTypo')} />}

			{ /* Hover also styles the result picked with the arrow keys. */}
			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={itemState} onChange={(val) => setItemState(val || 'normal')}>
				{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>

			{!isOff(`item.${itemState}.bg`, item[itemState]?.bg, presetData.item?.[itemState]?.bg) && <Background key={`item-bg-${itemState}`} className='mt10' label={'hover' === itemState ? __('Hover Background:', 'b-blocks') : __('Background:', 'b-blocks')} value={toBg(item[itemState]?.bg)} isImage={false} onChange={(val) => updateObj('item', val, itemState, 'bg')} />}
			<ColorControl key={`item-title-${itemState}`} className='mt10' label={__('Title Color:', 'b-blocks')} value={item[itemState]?.title} onChange={(val) => updateObj('item', val, itemState, 'title')} />
			{(showDate || showType) && <ColorControl key={`item-meta-${itemState}`} className='mt10' label={__('Date & Type Color:', 'b-blocks')} value={item[itemState]?.meta} onChange={(val) => updateObj('item', val, itemState, 'meta')} />}
			{showExcerpt && <ColorControl key={`item-content-${itemState}`} className='mt10' label={__('Content Color:', 'b-blocks')} value={item[itemState]?.content} onChange={(val) => updateObj('item', val, itemState, 'content')} />}

			<BorderBoxControl key={`item-border-${itemState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={item[itemState]?.border} onChange={(val) => updateObj('item', val || {}, itemState, 'border')} />
			{!isOff(`item.${itemState}.radius`, item[itemState]?.[device]?.radius, presetData.item?.[itemState]?.[device]?.radius) && <BoxControl key={`item-radius-${itemState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={item[itemState]?.[device]?.radius} onChange={(val) => updateObj('item', val, itemState, device, 'radius')} />}
			<ShadowControl key={`item-shadow-${itemState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={item[itemState]?.shadow} onChange={(val) => updateObj('item', val, itemState, 'shadow')} />

			{showImage && <>
				<h3 className='mt20'>{__('Image', 'b-blocks')}</h3>
				<ToggleGroupControl label={__('Position', 'b-blocks')} __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={thumb.position || 'left'} onChange={(val) => updateObj('thumb', val || 'left', 'position')}>
					{thumbPositionOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
				</ToggleGroupControl>
				<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Size', 'b-blocks')} <Device /></Flex>} value={thumb[device]?.size} labelPosition='edge' onChange={(val) => updateObj('thumb', val || '', device, 'size')} />
				{!isOff('thumb.radius', thumb[device]?.radius, presetData.thumb?.[device]?.radius) && <BoxControl key={`thumb-radius-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={thumb[device]?.radius} onChange={(val) => updateObj('thumb', val, device, 'radius')} />}
			</>}

			{highlight && <>
				<h3 className='mt20'>{__('Highlight Keyword', 'b-blocks')}</h3>
				<ColorControl label={__('Color:', 'b-blocks')} value={item.highlight?.color} onChange={(val) => updateObj('item', val, 'highlight', 'color')} />
				<ColorControl className='mt10' label={__('Background Color:', 'b-blocks')} value={item.highlight?.bg} onChange={(val) => updateObj('item', val, 'highlight', 'bg')} />
			</>}
		</PanelBody>

		{showTotal && <PanelBody className='bPlPanelBody' title={__('Total Results Text', 'b-blocks')} initialOpen={false}>
			<Typography label={__('Typography', 'b-blocks')} value={total.typo} onChange={(val) => updateObj('total', val, 'typo')} />
			<ColorControl className='mt10' label={__('Color:', 'b-blocks')} value={total.color} onChange={(val) => updateObj('total', val, 'color')} />
		</PanelBody>}

		<PanelBody className='bPlPanelBody' title={__('Not Found Message', 'b-blocks')} initialOpen={false}>
			<Typography label={__('Typography', 'b-blocks')} value={notFound.typo} onChange={(val) => updateObj('notFound', val, 'typo')} />
			<ColorControl className='mt10' label={__('Color:', 'b-blocks')} value={notFound.color} onChange={(val) => updateObj('notFound', val, 'color')} />
			<SelectControl className='mt10' label={__('Alignment', 'b-blocks')} labelPosition='edge' value={notFound.align} options={alignOptions} onChange={(val) => updateObj('notFound', val, 'align')} __next40pxDefaultSize __nextHasNoMarginBottom />
		</PanelBody>

		{showButton && <PanelBody className='bPlPanelBody' title={__('Search Button', 'b-blocks')} initialOpen={false}>
			{ /* An icon follows the text size and colours. */}
			<Typography label={__('Typography', 'b-blocks')} value={searchBtn.typo} onChange={(val) => updateObj('searchBtn', val, 'typo')} />

			<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Width', 'b-blocks')} <Device /></Flex>} value={searchBtn[device]?.width} labelPosition='edge' onChange={(val) => updateObj('searchBtn', val || '', device, 'width')} />
			<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Height', 'b-blocks')} <Device /></Flex>} value={searchBtn[device]?.height} labelPosition='edge' onChange={(val) => updateObj('searchBtn', val || '', device, 'height')} />

			<BoxControl key={`searchBtn-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={searchBtn[device]?.padding} onChange={(val) => updateObj('searchBtn', val, device, 'padding')} />

			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={btnState} onChange={(val) => setBtnState(val || 'normal')}>
				{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>
			<ColorControl key={`btn-color-${btnState}`} className='mt10' label={'hover' === btnState ? __('Hover Text Color:', 'b-blocks') : __('Button Text Color:', 'b-blocks')} value={searchBtn[btnState]?.color} onChange={(val) => updateObj('searchBtn', val, btnState, 'color')} />
			{!isOff(`searchBtn.${btnState}.bg`, searchBtn[btnState]?.bg, presetData.searchBtn?.[btnState]?.bg) && <Background key={`btn-bg-${btnState}`} className='mt10' label={'hover' === btnState ? __('Hover Background:', 'b-blocks') : __('Button Background:', 'b-blocks')} value={toBg(searchBtn[btnState]?.bg)} isImage={false} onChange={(val) => updateObj('searchBtn', val, btnState, 'bg')} />}
			<BorderBoxControl key={`searchBtn-border-${btnState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={searchBtn[btnState]?.border} onChange={(val) => updateObj('searchBtn', val || {}, btnState, 'border')} />
			{!isOff(`searchBtn.${btnState}.radius`, searchBtn[btnState]?.[device]?.radius, presetData.searchBtn?.[btnState]?.[device]?.radius) && <BoxControl key={`searchBtn-radius-${btnState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={searchBtn[btnState]?.[device]?.radius} onChange={(val) => updateObj('searchBtn', val, btnState, device, 'radius')} />}
			<ShadowControl key={`searchBtn-shadow-${btnState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={searchBtn[btnState]?.shadow} onChange={(val) => updateObj('searchBtn', val, btnState, 'shadow')} />
		</PanelBody>}

		{showViewAll && <PanelBody className='bPlPanelBody' title={__('View All Button', 'b-blocks')} initialOpen={false}>
			<Typography label={__('Typography', 'b-blocks')} value={viewAllBtn.typo} onChange={(val) => updateObj('viewAllBtn', val, 'typo')} />

			<BoxControl key={`viewAllBtn-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={viewAllBtn[device]?.padding} onChange={(val) => updateObj('viewAllBtn', val, device, 'padding')} />

			<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={viewState} onChange={(val) => setViewState(val || 'normal')}>
				{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>
			<ColorControl key={`view-color-${viewState}`} className='mt10' label={'hover' === viewState ? __('Hover Text Color:', 'b-blocks') : __('Text Color:', 'b-blocks')} value={viewAllBtn[viewState]?.color} onChange={(val) => updateObj('viewAllBtn', val, viewState, 'color')} />
			{!isOff(`viewAllBtn.${viewState}.bg`, viewAllBtn[viewState]?.bg, presetData.viewAllBtn?.[viewState]?.bg) && <Background key={`view-bg-${viewState}`} className='mt10' label={'hover' === viewState ? __('Hover Background:', 'b-blocks') : __('Background:', 'b-blocks')} value={toBg(viewAllBtn[viewState]?.bg)} isImage={false} onChange={(val) => updateObj('viewAllBtn', val, viewState, 'bg')} />}
			<BorderBoxControl key={`viewAllBtn-border-${viewState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={viewAllBtn[viewState]?.border} onChange={(val) => updateObj('viewAllBtn', val || {}, viewState, 'border')} />
			{!isOff(`viewAllBtn.${viewState}.radius`, viewAllBtn[viewState]?.[device]?.radius, presetData.viewAllBtn?.[viewState]?.[device]?.radius) && <BoxControl key={`viewAllBtn-radius-${viewState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={viewAllBtn[viewState]?.[device]?.radius} onChange={(val) => updateObj('viewAllBtn', val, viewState, device, 'radius')} />}
			<ShadowControl key={`viewAllBtn-shadow-${viewState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={viewAllBtn[viewState]?.shadow} onChange={(val) => updateObj('viewAllBtn', val, viewState, 'shadow')} />
		</PanelBody>}
	</>;
};
export default Style;
