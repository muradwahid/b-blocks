import { __ } from '@wordpress/i18n';
import { Button, Flex, RangeControl, SelectControl, TextControl, TextareaControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { produce } from 'immer';

import { ColorControl, Label, Notice } from '../../../../../../../../bpl-tools/Components';

import { toNumber } from '../../../../../utils/data';
import { parsePath } from '../../../../../utils/mapHelpers';
import { shapeGeometry, shapeTypes } from '../../../../../utils/options';

const ShapeItemSettings = (props) => {
	const { attributes, setAttributes, arrKey = 'shapes', index } = props;

	const items = attributes[arrKey] || [];
	const item = items[index];

	if (!item) return null;

	const updateItem = (type, val, childType = null) => setAttributes({
		[arrKey]: produce(items, (draft) => {
			if (null !== childType) {
				draft[index][type][childType] = val;
			} else {
				draft[index][type] = val;
			}
		})
	});

	const isPath = 'polyline' === item.type || 'polygon' === item.type;
	const hasFill = 'polyline' !== item.type;

	// Mirror the renderer's own guards so an unrenderable shape is visible here
	// rather than just missing from the map.
	const incomplete = (() => {
		if (isPath) return parsePath(item.path).length < 2;
		if ('circle' === item.type) return null === toNumber(item.center?.lat) || null === toNumber(item.center?.lng) || !toNumber(item.radius);
		return ['north', 'south', 'east', 'west'].some((side) => null === toNumber(item.bounds?.[side]));
	})();

	// Shapes saved before geometry was seeded have empty path/centre/bounds and
	// can never draw; this refills every type in one go.
	const resetGeometry = () => setAttributes({
		[arrKey]: produce(items, (draft) => {
			Object.assign(draft[index], shapeGeometry(attributes.source?.center, index));
		})
	});

	return <>
		{incomplete && <Notice status='warning' isIcon={true}>
			{isPath
				? __('This shape needs at least two "latitude,longitude" points before it appears on the map.', 'b-blocks')
				: 'circle' === item.type
					? __('This circle needs a centre latitude, longitude and radius before it appears on the map.', 'b-blocks')
					: __('This rectangle needs all four bounds before it appears on the map.', 'b-blocks')}
		</Notice>}

		{incomplete && <Button className='mt10' variant='secondary' onClick={resetGeometry}>
			{__('Fill from map centre', 'b-blocks')}
		</Button>}

		<TextControl label={__('Label', 'b-blocks')} value={item.label || ''} onChange={(val) => updateItem('label', val)} __nextHasNoMarginBottom />

		<SelectControl className='mt10' label={__('Type', 'b-blocks')} value={item.type} options={shapeTypes} onChange={(val) => updateItem('type', val)} __nextHasNoMarginBottom />

		{isPath && <TextareaControl
			className='mt10'
			label={__('Path', 'b-blocks')}
			value={item.path || ''}
			onChange={(val) => updateItem('path', val)}
			rows={4}
			placeholder={'23.8103,90.4125\n23.7900,90.4000'}
			help={__('One "latitude,longitude" pair per line — or paste a JSON array of {lat, lng} objects.', 'b-blocks')}
			__nextHasNoMarginBottom
		/>}

		{'circle' === item.type && <>
			<Flex className='mt10' gap={2}>
				<NumberControl className='flex1' label={__('Center Latitude', 'b-blocks')} step={0.000001} value={item.center?.lat ?? ''} onChange={(val) => updateItem('center', toNumber(val, 0), 'lat')} __next40pxDefaultSize />

				<NumberControl className='flex1' label={__('Center Longitude', 'b-blocks')} step={0.000001} value={item.center?.lng ?? ''} onChange={(val) => updateItem('center', toNumber(val, 0), 'lng')} __next40pxDefaultSize />
			</Flex>

			<NumberControl className='mt10' label={__('Radius (metres)', 'b-blocks')} min={1} step={50} value={item.radius ?? 1000} onChange={(val) => updateItem('radius', toNumber(val, 1000))} __next40pxDefaultSize />
		</>}

		{'rectangle' === item.type && <>
			<Label className='mt10'>{__('Bounds', 'b-blocks')}</Label>
			<Flex gap={2}>
				<NumberControl className='flex1' label={__('North', 'b-blocks')} step={0.000001} value={item.bounds?.north ?? ''} onChange={(val) => updateItem('bounds', toNumber(val, 0), 'north')} __next40pxDefaultSize />

				<NumberControl className='flex1' label={__('South', 'b-blocks')} step={0.000001} value={item.bounds?.south ?? ''} onChange={(val) => updateItem('bounds', toNumber(val, 0), 'south')} __next40pxDefaultSize />
			</Flex>

			<Flex className='mt5' gap={2}>
				<NumberControl className='flex1' label={__('East', 'b-blocks')} step={0.000001} value={item.bounds?.east ?? ''} onChange={(val) => updateItem('bounds', toNumber(val, 0), 'east')} __next40pxDefaultSize />

				<NumberControl className='flex1' label={__('West', 'b-blocks')} step={0.000001} value={item.bounds?.west ?? ''} onChange={(val) => updateItem('bounds', toNumber(val, 0), 'west')} __next40pxDefaultSize />
			</Flex>
		</>}

		<ColorControl className='mt10' label={__('Stroke Color:', 'b-blocks')} value={item.strokeColor} onChange={(val) => updateItem('strokeColor', val)} />

		<RangeControl className='mt10' label={__('Stroke Opacity', 'b-blocks')} value={toNumber(item.strokeOpacity, 0.9)} min={0} max={1} step={0.05} onChange={(val) => updateItem('strokeOpacity', toNumber(val, 0.9))} __next40pxDefaultSize __nextHasNoMarginBottom />

		<RangeControl className='mt10' label={__('Stroke Weight', 'b-blocks')} value={toNumber(item.strokeWeight, 3)} min={1} max={20} onChange={(val) => updateItem('strokeWeight', toNumber(val, 3))} __next40pxDefaultSize __nextHasNoMarginBottom />

		{hasFill && <>
			<ColorControl className='mt10' label={__('Fill Color:', 'b-blocks')} value={item.fillColor} onChange={(val) => updateItem('fillColor', val)} />

			<RangeControl className='mt10' label={__('Fill Opacity', 'b-blocks')} value={toNumber(item.fillOpacity, 0.25)} min={0} max={1} step={0.05} onChange={(val) => updateItem('fillOpacity', toNumber(val, 0.25))} __next40pxDefaultSize __nextHasNoMarginBottom />
		</>}
	</>;
};
export default ShapeItemSettings;
