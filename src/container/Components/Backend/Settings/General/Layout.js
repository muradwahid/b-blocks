import { __, isRTL } from '@wordpress/i18n';
import { Dashicon, PanelBody, PanelRow, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Label, Device } from '../../../../../../../bpl-tools/Components';
import { updateData } from '../../../../../../../bpl-tools/utils/functions';

import { heights, horizontalAlignOptions, itemsAlignOptions, itemsDirectionOptions, itemsJustifyOptions, itemsWrapOptions, verticalAlignOptions } from '../../../../utils/options';

const Layout = ({ attributes, setAttributes, device }) => {
	const { content, itemsLayout = {} } = attributes;
	const { isFullWidth, width, height, verticalAlign, horizontalAlign } = content;
	const { direction = '', justify = '', align = '', wrap = '', columnGap = '', rowGap = '' } = itemsLayout[device] || {};

	const set = (key, val) => setAttributes({ itemsLayout: { ...itemsLayout, [device]: { ...itemsLayout[device], [key]: val ?? '' } } });

	const devices = ['desktop', 'tablet', 'mobile'];
	const shownDirection = devices.slice(0, devices.indexOf(device) + 1).reduce((val, d) => itemsLayout[d]?.direction || val, '') || 'column';
	const turn = shownDirection.startsWith('column') ? 90 : 0;

	const justifyTurn = { row: 0, 'row-reverse': 180, column: 90, 'column-reverse': -90 }[shownDirection];

	const flip = isRTL() ? 'scaleX(-1) ' : '';

	const inherited = (key, options) => {
		const from = 'desktop' === device || itemsLayout[device]?.[key] ? null : devices.slice(0, devices.indexOf(device)).reverse().find(d => itemsLayout[d]?.[key]);
		return from ? <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#757575' }}>{`${'desktop' === from ? __('Desktop', 'b-blocks') : __('Tablet', 'b-blocks')}: ${options?.find(o => o.value === itemsLayout[from][key])?.label ?? itemsLayout[from][key]}`}</p> : null;
	};

	return <>
		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={false}>
			<ToggleControl label={__('Enable Full Width', 'b-blocks')} checked={isFullWidth} onChange={val => setAttributes({ content: updateData(content, val, 'isFullWidth') })} />

			{!isFullWidth && <>
				<PanelRow className='mt20'>
					<Label className=''>{__('Width:', 'b-blocks')}</Label>
					<Device />
				</PanelRow>
				<UnitControl label={__('Width', 'b-blocks')} hideLabelFromVision value={width[device]} onChange={val => setAttributes({ content: updateData(content, val, 'width', device) })} beforeIcon='grid-view'></UnitControl>
			</>}

			<SelectControl className='mt20' label={__('Height', 'b-blocks')} labelPosition='left' value={height} onChange={val => { setAttributes({ content: updateData(content, val, 'height') }) }} options={heights} />

			<SelectControl className='mt20' label={__('Vertical Align', 'b-blocks')} labelPosition='left' value={verticalAlign} options={verticalAlignOptions} onChange={(val) => { setAttributes({ content: updateData(content, val, 'verticalAlign') }) }} />

			<SelectControl className='mt20' label={__('Horizontal Align', 'b-blocks')} labelPosition='left' value={horizontalAlign} options={horizontalAlignOptions} onChange={(val) => { setAttributes({ content: updateData(content, val, 'horizontalAlign') }) }} />

			<PanelRow className='mt20'>
				<Label className=''>{__('Direction', 'b-blocks')}</Label>
				<Device />
			</PanelRow>
			<ToggleGroupControl label={__('Direction', 'b-blocks')} hideLabelFromVision isBlock isDeselectable __nextHasNoMarginBottom __next40pxDefaultSize value={direction || undefined} onChange={val => set('direction', val)}>
				{itemsDirectionOptions.map(({ value, label, icon }) => <ToggleGroupControlOptionIcon key={value} value={value} label={label} icon={<Dashicon icon={icon} style={flip ? { transform: flip } : undefined} />} />)}
			</ToggleGroupControl>
			{inherited('direction', itemsDirectionOptions)}

			<PanelRow className='mt20'>
				<Label className=''>{__('Justify Content', 'b-blocks')}</Label>
				<Device />
			</PanelRow>
			<ToggleGroupControl label={__('Justify Content', 'b-blocks')} hideLabelFromVision isBlock isDeselectable __nextHasNoMarginBottom __next40pxDefaultSize value={justify || undefined} onChange={val => set('justify', val)}>
				{itemsJustifyOptions.map(({ value, label, icon }) => <ToggleGroupControlOptionIcon key={value} value={value} label={label} icon={<span style={{ display: 'flex', transform: `${flip}rotate(${justifyTurn}deg)` }}>{icon}</span>} />)}
			</ToggleGroupControl>
			{inherited('justify', itemsJustifyOptions)}

			<PanelRow className='mt20'>
				<Label className=''>{__('Align Items', 'b-blocks')}</Label>
				<Device />
			</PanelRow>
			<ToggleGroupControl label={__('Align Items', 'b-blocks')} hideLabelFromVision isBlock isDeselectable __nextHasNoMarginBottom __next40pxDefaultSize value={align || undefined} onChange={val => set('align', val)}>
				{itemsAlignOptions.map(({ value, label, icon }) => <ToggleGroupControlOptionIcon key={value} value={value} label={label} icon={<span style={{ display: 'flex', transform: `${flip}rotate(-${turn}deg)` }}>{icon}</span>} />)}
			</ToggleGroupControl>
			{inherited('align', itemsAlignOptions)}

			<PanelRow className='mt20'>
				<Label className=''>{__('Wrap', 'b-blocks')}</Label>
				<Device />
			</PanelRow>
			<ToggleGroupControl label={__('Wrap', 'b-blocks')} hideLabelFromVision isBlock isDeselectable __nextHasNoMarginBottom __next40pxDefaultSize value={wrap || undefined} onChange={val => set('wrap', val)}>
				{itemsWrapOptions.map(({ value, label, icon }) => <ToggleGroupControlOptionIcon key={value} value={value} label={label} icon={<span style={{ display: 'flex', transform: `${flip}rotate(${turn}deg)` }}>{icon}</span>} />)}
			</ToggleGroupControl>
			{inherited('wrap', itemsWrapOptions)}

			<PanelRow className='mt20'>
				<Label className=''>{__('Column Gap', 'b-blocks')}</Label>
				<Device />
			</PanelRow>
			<UnitControl label={__('Column Gap', 'b-blocks')} hideLabelFromVision __next40pxDefaultSize min={0} value={columnGap} units={[{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }, { value: 'rem', label: 'rem' }, { value: '%', label: '%' }, { value: 'vw', label: 'vw' }]} onChange={val => set('columnGap', val)} />
			{inherited('columnGap')}

			<PanelRow className='mt20'>
				<Label className=''>{__('Row Gap', 'b-blocks')}</Label>
				<Device />
			</PanelRow>
			<UnitControl label={__('Row Gap', 'b-blocks')} hideLabelFromVision __next40pxDefaultSize min={0} value={rowGap} units={[{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }, { value: 'rem', label: 'rem' }, { value: '%', label: '%' }, { value: 'vh', label: 'vh' }]} onChange={val => set('rowGap', val)} />
			{inherited('rowGap')}
		</PanelBody>
	</>
}

export default Layout
