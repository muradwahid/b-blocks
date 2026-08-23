import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RangeControl, SelectControl, ToggleControl, __experimentalNumberControl as NumberControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

import { alignmentOptions, aspectRatioOptions, pick, toNumber } from '../../../../utils/data';
import { gestureOptions, mapTypes, UNITS } from '../../../../utils/options';

const MapOptions = ({ map = {}, updateObj, device = 'desktop' }) => <PanelBody className='bPlPanelBody' title={__('Map Options', 'b-blocks')} initialOpen={false}>
	<RangeControl
		label={__('Zoom', 'b-blocks')}
		value={toNumber(map.zoom, 12)}
		min={1}
		max={22}
		onChange={(val) => updateObj('map', toNumber(val, 12), 'zoom')}
		__next40pxDefaultSize
		__nextHasNoMarginBottom
	/>

	<Flex className='mt10' gap={2}>
		{/* Bounded against each other: Google throws InvalidValueError rather than
		    clamping when minZoom exceeds maxZoom. */}
		<NumberControl className='flex1' label={__('Min Zoom', 'b-blocks')} min={1} max={toNumber(map.maxZoom) ?? 22} value={map.minZoom ?? ''} onChange={(val) => updateObj('map', val, 'minZoom')} __next40pxDefaultSize />
		<NumberControl className='flex1' label={__('Max Zoom', 'b-blocks')} min={toNumber(map.minZoom) ?? 1} max={22} value={map.maxZoom ?? ''} onChange={(val) => updateObj('map', val, 'maxZoom')} __next40pxDefaultSize />
	</Flex>

	<Flex className='mt10'>
		<Label className='flex1'>{__('Map Type', 'b-blocks')}</Label>
		<SelectControl className='flex1' value={map.mapType || 'roadmap'} options={mapTypes} onChange={(val) => updateObj('map', val, 'mapType')} __nextHasNoMarginBottom />
	</Flex>

	<ToggleControl
		className='mt10'
		label={__('Let visitors switch map type', 'b-blocks')}
		checked={false !== map.allowTypeSwitch}
		onChange={(val) => updateObj('map', !!val, 'allowTypeSwitch')}
		__nextHasNoMarginBottom
	/>

	<SelectControl
		className='mt10'
		label={__('Gesture Handling', 'b-blocks')}
		value={map.gestureHandling || 'cooperative'}
		options={gestureOptions}
		onChange={(val) => updateObj('map', val, 'gestureHandling')}
		help={__('Cooperative requires Ctrl/⌘ + scroll to zoom, so the page never traps the visitor’s scroll.', 'b-blocks')}
		__nextHasNoMarginBottom
	/>

	<ToggleControl className='mt10' label={__('Draggable', 'b-blocks')} checked={false !== map.draggable} onChange={(val) => updateObj('map', !!val, 'draggable')} __nextHasNoMarginBottom />

	<ToggleControl className='mt10' label={__('Zoom on scroll wheel', 'b-blocks')} checked={!!map.scrollwheel} onChange={(val) => updateObj('map', !!val, 'scrollwheel')} __nextHasNoMarginBottom />

	<ToggleControl
		className='mt10'
		label={__('Fit map to all markers', 'b-blocks')}
		checked={!!map.fitBounds}
		onChange={(val) => updateObj('map', !!val, 'fitBounds')}
		help={__('Overrides the center and zoom above when two or more markers have coordinates.', 'b-blocks')}
		__nextHasNoMarginBottom
	/>

	<hr />

	<ToggleControl
		label={__('Use Aspect Ratio', 'b-blocks')}
		checked={!!map.useAspectRatio}
		onChange={(val) => updateObj('map', !!val, 'useAspectRatio')}
		help={__('When on, the map sizes by a fixed aspect ratio (fluid). When off, fixed heights per breakpoint.', 'b-blocks')}
		__nextHasNoMarginBottom
	/>

	{map.useAspectRatio ? <Flex className='mt10'>
		<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Aspect Ratio', 'b-blocks')} <Device /></Flex></Label>
		<SelectControl className='flex1' value={map.aspectRatio?.[device] || ''} options={[{ label: __('Inherit', 'b-blocks'), value: '' }, ...aspectRatioOptions]} onChange={(val) => updateObj('map', val, 'aspectRatio', device)} __nextHasNoMarginBottom />
	</Flex> : <Flex className='mt10'>
		<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Height', 'b-blocks')} <Device /></Flex></Label>
		<UnitControl className='flex1' value={pick(map, device, 'height')} units={UNITS} onChange={(val) => updateObj('map', val, device, 'height')} __next40pxDefaultSize />
	</Flex>}

	<Flex className='mt10'>
		<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Max Width', 'b-blocks')} <Device /></Flex></Label>
		<UnitControl className='flex1' value={pick(map, device, 'maxWidth')} units={UNITS} onChange={(val) => updateObj('map', val, device, 'maxWidth')} __next40pxDefaultSize />
	</Flex>

	<Label className='mt10'><Flex justify='flex-start' gap={0}>{__('Map Alignment', 'b-blocks')} <Device /></Flex></Label>
	<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable value={pick(map, device, 'align')} onChange={(val) => updateObj('map', val, device, 'align')}>
		{alignmentOptions.map((option) => <ToggleGroupControlOption key={option.value} label={option.label} value={option.value} />)}
	</ToggleGroupControl>
</PanelBody>;
export default MapOptions;
