import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, BorderControl, Flex, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { ColorControl, Background, Typography, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const [btnState, setBtnState] = useState('normal');

	const { icon = {}, title = {}, description = {}, meta = {}, button = {} } = attributes;
	const btnCurrent = button[btnState] || {};

	// Responsive BoxControl: edits obj[device], label carries the Device switcher.
	const rBox = (label, group, prop, obj, className) => (
		<BoxControl className={className} label={<Flex justify='flex-start'>{label} <Device /></Flex>} units={UNITS} values={obj?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj(group, val, prop, device)} />
	);

	// State-aware responsive BoxControl for the button's normal/hover objects.
	const rBoxState = (label, prop, obj, className) => (
		<BoxControl className={className} label={<Flex justify='flex-start'>{label} <Device /></Flex>} units={UNITS} values={obj?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('button', val, btnState, prop, device)} />
	);

	return <>
		<PanelBody className='bPlPanelBody' title={__('Icon Badge', 'b-blocks')} initialOpen={true}>
			<Background label={__('Background:', 'b-blocks')} value={icon.bg} onChange={(val) => updateObj('icon', val, 'bg')} />

			<ColorControl className='mt10' label={__('Icon / Text Color:', 'b-blocks')} value={icon.color} onChange={(val) => updateObj('icon', val, 'color')} defaultColor='#2563eb' />

			{rBox(__('Padding', 'b-blocks'), 'icon', 'padding', icon.padding, 'mt10')}

			{rBox(__('Margin', 'b-blocks'), 'icon', 'margin', icon.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={icon.border} onChange={(val) => updateObj('icon', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Corner Radius', 'b-blocks'), 'icon', 'radius', icon.radius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={title.color || '#111827'} onChange={(val) => updateObj('title', val, 'color')} defaultColor='#111827' />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={title.bg} onChange={(val) => updateObj('title', val, 'bg')} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={title.typo} onChange={(val) => updateObj('title', val, 'typo')} />

			{rBox(__('Padding', 'b-blocks'), 'title', 'padding', title.padding, 'mt10')}

			{rBox(__('Margin', 'b-blocks'), 'title', 'margin', title.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={title.border} onChange={(val) => updateObj('title', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'title', 'borderRadius', title.borderRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={description.color || '#6b7280'} onChange={(val) => updateObj('description', val, 'color')} defaultColor='#6b7280' />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={description.bg} onChange={(val) => updateObj('description', val, 'bg')} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={description.typo} onChange={(val) => updateObj('description', val, 'typo')} />

			{rBox(__('Padding', 'b-blocks'), 'description', 'padding', description.padding, 'mt10')}

			{rBox(__('Margin', 'b-blocks'), 'description', 'margin', description.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={description.border} onChange={(val) => updateObj('description', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'description', 'borderRadius', description.borderRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Meta', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={meta.color || '#9ca3af'} onChange={(val) => updateObj('meta', val, 'color')} defaultColor='#9ca3af' />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={meta.bg} onChange={(val) => updateObj('meta', val, 'bg')} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={meta.typo} onChange={(val) => updateObj('meta', val, 'typo')} />

			{rBox(__('Padding', 'b-blocks'), 'meta', 'padding', meta.padding, 'mt10')}

			{rBox(__('Margin', 'b-blocks'), 'meta', 'margin', meta.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={meta.border} onChange={(val) => updateObj('meta', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'meta', 'borderRadius', meta.borderRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
			<Typography label={__('Typography', 'b-blocks')} value={button.typo} onChange={(val) => updateObj('button', val, 'typo')} />

			<ToggleGroupControl className='mt10 flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={btnState} onChange={(val) => setBtnState(val)}>
				<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
				<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
			</ToggleGroupControl>

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={btnCurrent.bg} onChange={(val) => updateObj('button', val, btnState, 'bg')} />

			<ColorControl label={__('Text Color:', 'b-blocks')} value={btnCurrent.color || ''} onChange={(val) => updateObj('button', val, btnState, 'color')} defaultColor='#ffffff' />

			{rBoxState(__('Padding', 'b-blocks'), 'padding', btnCurrent.padding, 'mt10')}

			{rBoxState(__('Margin', 'b-blocks'), 'margin', btnCurrent.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={btnCurrent.border} onChange={(val) => updateObj('button', val || {}, btnState, 'border')} withSlider __next40pxDefaultSize />

			{rBoxState(__('Border Radius', 'b-blocks'), 'radius', btnCurrent.radius)}

			{btnState === 'hover' && (
				<RangeControl className='mt10' label={__('Transition (s)', 'b-blocks')} value={button.transition ?? 0.2} onChange={(val) => updateObj('button', val, 'transition')} min={0} max={5} step={0.01} __nextHasNoMarginBottom />
			)}
		</PanelBody>
	</>;
};
export default Style;
