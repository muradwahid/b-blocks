import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, ToggleControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

import { placementOf, positions, resolveDevice, verticalAligns } from '../../../../utils/options';

const Behavior = ({ attributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, behavior = {} } = attributes;

	const align = placementOf(layout, device, 'verticalAlign', 'center');

	const place = (label, key) => <>
		<Label className='mb0 mt10'>{label} <Device /></Label>

		<UnitControl
			value={resolveDevice(layout, device, key, '')}
			onChange={(val) => updateObj('layout', undefined === val ? '' : val, device, key)}
			__next40pxDefaultSize
		/>
	</>;

	const length = (label, key, { units, help } = {}) => <>
		<Label className='mb0 mt10'>{label} <Device /></Label>

		<UnitControl
			value={resolveDevice(behavior, device, key, '')}
			onChange={(val) => updateObj('behavior', undefined === val ? '' : val, device, key)}
			units={units}
			help={help}
			__next40pxDefaultSize
		/>
	</>;

	const pixels = [{ label: 'px', value: 'px' }];

	return <PanelBody className='bPlPanelBody' title={__('Behavior', 'b-blocks')} initialOpen={false}>
		<ToggleControl
			label={__('Enable Scroll Spy', 'b-blocks')}
			checked={behavior.scrollSpy}
			onChange={(val) => updateObj('behavior', val, 'scrollSpy')}
			help={__('Highlights the item whose section is currently in view.', 'b-blocks')}
		/>

		<ToggleControl
			label={__('Smooth Scroll', 'b-blocks')}
			checked={behavior.smoothScroll}
			onChange={(val) => updateObj('behavior', val, 'smoothScroll')}
			help={__('Off, a click jumps straight to the section.', 'b-blocks')}
		/>

		<Label className='mb0 mt20'>{__('Position', 'b-blocks')} <Device /></Label>

		<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={placementOf(layout, device, 'position', 'right')} onChange={(val) => updateObj('layout', val, device, 'position')}>
			{positions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<Label className='mb0 mt20'>{__('Vertical Align', 'b-blocks')} <Device /></Label>

		<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={placementOf(layout, device, 'verticalAlign', 'center')} onChange={(val) => updateObj('layout', val, device, 'verticalAlign')}>
			{verticalAligns.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		{place(__('Horizontal Offset', 'b-blocks'), 'offsetX')}

		{'center' !== align && place(__('Vertical Offset', 'b-blocks'), 'offsetY')}

		{length(__('Scroll Offset', 'b-blocks'), 'scrollOffset', { units: pixels, help: __('Keeps the target clear of a sticky header.', 'b-blocks') })}

		<Label className='mb0 mt10'>{__('Scroll Speed', 'b-blocks')}</Label>

		<RangeControl
			value={parseInt(behavior.scrollSpeed, 10) || 0}
			onChange={(val) => updateObj('behavior', undefined === val ? 600 : val, 'scrollSpeed')}
			min={0}
			max={2000}
			step={50}
			allowReset
			resetFallbackValue={600}
			help={__('How long the scroll takes. Higher = slower.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>
	</PanelBody>;
};

export default Behavior;
