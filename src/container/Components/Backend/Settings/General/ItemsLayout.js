import { __ } from '@wordpress/i18n';
import { Dashicon, PanelBody, PanelRow, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, Device } from '../../../../../../../bpl-tools/Components';

import { itemsAlignOptions, itemsDirectionOptions, itemsJustifyOptions, itemsWrapOptions } from '../../../../utils/options';

// How the blocks inside the container are laid out, per device. Nothing set = the container as it always was; an empty
// value on tablet or mobile keeps what the larger screen has.
const ItemsLayout = (props) => {
	const { attributes, setAttributes, device } = props;
	const { itemsLayout = {} } = attributes;
	const { direction = '', justify = '', align = '', wrap = '', columnGap = '', rowGap = '' } = itemsLayout[device] || {};

	// The toggle groups get `undefined` when nothing is chosen: WordPress only hides the selected backdrop for undefined, not for an empty string.
	// One setter for the six controls (saves the value exactly as the control gives it).
	const set = (key, val) => setAttributes({ itemsLayout: { ...itemsLayout, [device]: { ...itemsLayout[device], [key]: val ?? '' } } });

	// The icons are drawn for a row; in a column (the default, or what a larger screen set) they turn with it.
	const devices = ['desktop', 'tablet', 'mobile'];
	const shownDirection = devices.slice(0, devices.indexOf(device) + 1).reduce((val, d) => itemsLayout[d]?.direction || val, '') || 'column';
	const turn = shownDirection.startsWith('column') ? 90 : 0;

	return <PanelBody className='bPlPanelBody' title={__('Items Layout', 'b-blocks')} initialOpen={false}>
		<PanelRow>
			<Label className=''>{__('Direction', 'b-blocks')}</Label>
			<Device />
		</PanelRow>
		<ToggleGroupControl label={__('Direction', 'b-blocks')} hideLabelFromVision isBlock isDeselectable __nextHasNoMarginBottom __next40pxDefaultSize value={direction || undefined} onChange={val => set('direction', val)}>
			{itemsDirectionOptions.map(({ value, label, icon }) => <ToggleGroupControlOptionIcon key={value} value={value} label={label} icon={<Dashicon icon={icon} />} />)}
		</ToggleGroupControl>

		<PanelRow className='mt20'>
			<Label className=''>{__('Justify Content', 'b-blocks')}</Label>
			<Device />
		</PanelRow>
		<ToggleGroupControl label={__('Justify Content', 'b-blocks')} hideLabelFromVision isBlock isDeselectable __nextHasNoMarginBottom __next40pxDefaultSize value={justify || undefined} onChange={val => set('justify', val)}>
			{itemsJustifyOptions.map(({ value, label, icon }) => <ToggleGroupControlOptionIcon key={value} value={value} label={label} icon={<span style={{ display: 'flex', transform: `rotate(${turn}deg)` }}>{icon}</span>} />)}
		</ToggleGroupControl>

		<PanelRow className='mt20'>
			<Label className=''>{__('Align Items', 'b-blocks')}</Label>
			<Device />
		</PanelRow>
		<ToggleGroupControl label={__('Align Items', 'b-blocks')} hideLabelFromVision isBlock isDeselectable __nextHasNoMarginBottom __next40pxDefaultSize value={align || undefined} onChange={val => set('align', val)}>
			{itemsAlignOptions.map(({ value, label, icon }) => <ToggleGroupControlOptionIcon key={value} value={value} label={label} icon={<span style={{ display: 'flex', transform: `rotate(-${turn}deg)` }}>{icon}</span>} />)}
		</ToggleGroupControl>

		<PanelRow className='mt20'>
			<Label className=''>{__('Wrap', 'b-blocks')}</Label>
			<Device />
		</PanelRow>
		<ToggleGroupControl label={__('Wrap', 'b-blocks')} hideLabelFromVision isBlock isDeselectable __nextHasNoMarginBottom __next40pxDefaultSize value={wrap || undefined} onChange={val => set('wrap', val)}>
			{itemsWrapOptions.map(({ value, label, icon }) => <ToggleGroupControlOptionIcon key={value} value={value} label={label} icon={<span style={{ display: 'flex', transform: `rotate(${turn}deg)` }}>{icon}</span>} />)}
		</ToggleGroupControl>

		<PanelRow className='mt20'>
			<Label className=''>{__('Column Gap', 'b-blocks')}</Label>
			<Device />
		</PanelRow>
		<UnitControl __next40pxDefaultSize value={columnGap} units={[{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }, { value: 'rem', label: 'rem' }, { value: '%', label: '%' }, { value: 'vw', label: 'vw' }]} onChange={val => set('columnGap', val)} />

		<PanelRow className='mt20'>
			<Label className=''>{__('Row Gap', 'b-blocks')}</Label>
			<Device />
		</PanelRow>
		<UnitControl __next40pxDefaultSize value={rowGap} units={[{ value: 'px', label: 'px' }, { value: 'em', label: 'em' }, { value: 'rem', label: 'rem' }, { value: '%', label: '%' }, { value: 'vh', label: 'vh' }]} onChange={val => set('rowGap', val)} />
	</PanelBody>
}
export default ItemsLayout;