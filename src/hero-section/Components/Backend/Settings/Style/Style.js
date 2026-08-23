import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, BorderControl, Flex, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { ColorControl, Background, Typography, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Style = ({ attributes, updateObj, device = 'desktop' }) => {
	const [primaryState, setPrimaryState] = useState('normal');

	const { eyebrow = {}, heading = {}, subHeading = {}, button = {} } = attributes;

	const primaryCurrent = button[primaryState] || {};

	// Responsive BoxControl: edits obj[device], label carries the Device switcher.
	const rBox = (label, group, prop, obj, className) => (
		<BoxControl className={className} label={<Flex justify='flex-start'>{label} <Device /></Flex>} units={UNITS} values={obj?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj(group, val, prop, device)} />
	);

	return <>
		<PanelBody className='bPlPanelBody' title={__('Eyebrow', 'b-blocks')} initialOpen={true}>
			<ColorControl label={__('Text Color:', 'b-blocks')} value={eyebrow.color || '#ffffff'} onChange={(val) => updateObj('eyebrow', val, 'color')} defaultColor='#ffffff' />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={eyebrow.bg} onChange={(val) => updateObj('eyebrow', val, 'bg')} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={eyebrow.typo} onChange={(val) => updateObj('eyebrow', val, 'typo')} />

			{rBox(__('Padding', 'b-blocks'), 'eyebrow', 'padding', eyebrow.padding, 'mt10')}

			{rBox(__('Margin', 'b-blocks'), 'eyebrow', 'margin', eyebrow.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={eyebrow.border} onChange={(val) => updateObj('eyebrow', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'eyebrow', 'borderRadius', eyebrow.borderRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Headline', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={heading.color || '#ffffff'} onChange={(val) => updateObj('heading', val, 'color')} defaultColor='#ffffff' />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={heading.bg} onChange={(val) => updateObj('heading', val, 'bg')} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={heading.typo} onChange={(val) => updateObj('heading', val, 'typo')} />

			{rBox(__('Padding', 'b-blocks'), 'heading', 'padding', heading.padding, 'mt10')}

			{rBox(__('Margin', 'b-blocks'), 'heading', 'margin', heading.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={heading.border} onChange={(val) => updateObj('heading', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'heading', 'borderRadius', heading.borderRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Sub-headline', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Color:', 'b-blocks')} value={subHeading.color || 'rgba(255,255,255,0.85)'} onChange={(val) => updateObj('subHeading', val, 'color')} defaultColor='rgba(255,255,255,0.85)' />

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={subHeading.bg} onChange={(val) => updateObj('subHeading', val, 'bg')} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={subHeading.typo} onChange={(val) => updateObj('subHeading', val, 'typo')} />

			{rBox(__('Padding', 'b-blocks'), 'subHeading', 'padding', subHeading.padding, 'mt10')}

			{rBox(__('Margin', 'b-blocks'), 'subHeading', 'margin', subHeading.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={subHeading.border} onChange={(val) => updateObj('subHeading', val || {}, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'subHeading', 'borderRadius', subHeading.borderRadius)}
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
			<Typography label={__('Typography', 'b-blocks')} value={button.typo} onChange={(val) => updateObj('button', val, 'typo')} />

			<ToggleGroupControl className='mt10 flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={primaryState} onChange={(val) => setPrimaryState(val)}>
				<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
				<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
			</ToggleGroupControl>

			<Background className='mt10' label={__('Background:', 'b-blocks')} value={primaryCurrent.bg} onChange={(val) => updateObj('button', val, primaryState, 'bg')} />

			<ColorControl label={__('Text Color:', 'b-blocks')} value={primaryCurrent.color} onChange={(val) => updateObj('button', val, primaryState, 'color')} defaultColor='#1a1a2e' />

			{rBox(__('Padding', 'b-blocks'), 'button', 'padding', button.padding, 'mt10')}

			{rBox(__('Margin', 'b-blocks'), 'button', 'margin', button.margin)}

			<BorderControl label={__('Border', 'b-blocks')} value={primaryCurrent.border} onChange={(val) => updateObj('button', val || {}, primaryState, 'border')} withSlider __next40pxDefaultSize />

			{rBox(__('Border Radius', 'b-blocks'), 'button', 'radius', button.radius)}

			<RangeControl className='mt10' label={__('Transition (s)', 'b-blocks')} value={button.transition ?? 0.2} onChange={(val) => updateObj('button', val, 'transition')} min={0} max={5} step={0.01} __nextHasNoMarginBottom />
		</PanelBody>
	</>;
};
export default Style;
