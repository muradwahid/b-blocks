import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { __experimentalBorderBoxControl as BorderControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, ShadowControl } from '../../../../../../../bpl-tools/Components';

import { hasBorder, hasRing, itemState, numberState, resolveBox, resolveDevice, showsMarkerColor, showsNumber, showsPadding, toBackground } from '../../../../utils/options';


const Item = ({ attributes, updateObj, device = 'desktop' }) => {
	const { item = {}, number = {}, layout = {} } = attributes;

	const [state, setState] = useState('normal');


	const paint = itemState(attributes, state, true);


	const edged = hasBorder(layout.preset || 'glassBullseye');
	const marked = showsMarkerColor(attributes);
	// Only the bullseye draws a ring around its marker.
	const ringed = hasRing(layout.preset);
	// A fixed marker shape is sized, not padded.
	const padded = showsPadding(layout.preset || 'glassBullseye');
	// The steps draw a number in place of a marker colour.
	const numbered = showsNumber(attributes);

	const length = (label, key) => <Flex className='mt10'>
		<Label className='mb0 flex2'>{label} <Device /></Label>

		<UnitControl
			className='flex1'
			value={resolveDevice(item, device, key, '')}
			onChange={(val) => updateObj('item', undefined === val ? '' : val, device, key)}
			__next40pxDefaultSize
		/>
	</Flex>;

	return <PanelBody className='bPlPanelBody' title={__('Item', 'b-blocks')} initialOpen={false}>
		<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={state} onChange={(val) => setState(val)}>
			<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
			<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
			<ToggleGroupControlOption label={__('Active', 'b-blocks')} value='active' />
		</ToggleGroupControl>

		<ColorControl className='mt10' label={__('Color', 'b-blocks')} value={paint.color} onChange={(val) => updateObj('item', val, state, 'color')} />

		<Background
			className='mt10'
			label={__('Background', 'b-blocks')}
			value={toBackground(paint.background)}
			onChange={(val) => updateObj('item', val, state, 'background')}
		/>

		{marked && <ColorControl
			className='mt10'
			label={__('Marker Color', 'b-blocks')}
			value={paint.markerColor}
			onChange={(val) => updateObj('item', val, state, 'markerColor')}
			help={__('The icon or number inside the marker. Icon / Image sets a drawn icon on its own.', 'b-blocks')}
		/>}

		{numbered && <ColorControl
			className='mt10'
			label={__('Number Color', 'b-blocks')}
			value={numberState(number, state)}
			onChange={(val) => updateObj('number', val, state, 'color')}
		/>}

		{ringed && <ColorControl
			className='mt10'
			label={__('Ring Color', 'b-blocks')}
			value={item?.[state]?.ringColor}
			onChange={(val) => updateObj('item', val, state, 'ringColor')}
			help={__('The circle around the marker. Its filled part is Line / Track ▸ Progress Color.', 'b-blocks')}
		/>}

		{edged && <BorderControl
			className='mt20'
			label={__('Border', 'b-blocks')}
			value={paint.border}
			onChange={(val) => updateObj('item', val, state, 'border')}
			__next40pxDefaultSize
		/>}

		<ShadowControl
			className='mt20'
			label={__('Shadow', 'b-blocks')}
			value={item?.[state]?.shadow}
			onChange={(val) => updateObj('item', val, state, 'shadow')}
		/>

		{padded && <>
			<Label className='mb0 mt20'>{__('Padding', 'b-blocks')} <Device /></Label>

			<BoxControl values={resolveBox(item, device, 'padding')} onChange={(val) => updateObj('item', val, device, 'padding')} />
		</>}

		<Label className='mb0 mt10'>{__('Border Radius', 'b-blocks')} <Device /></Label>

		<BoxControl values={resolveBox(item, device, 'radius')} onChange={(val) => updateObj('item', val, device, 'radius')} />

		{ringed && length(__('Ring Size', 'b-blocks'), 'ringSize')}

		{length(__('Spacing', 'b-blocks'), 'spacing')}

		{length(__('Width', 'b-blocks'), 'width')}

		{length(__('Height', 'b-blocks'), 'height')}
	</PanelBody>;
};

export default Item;
