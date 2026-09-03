import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, Notice, Typography } from '../../../../../../../bpl-tools/Components';

import { AlignCenterIcon, AlignEndIcon, AlignStartIcon } from '../../../../utils/icons';
import { EMPTY_BOX } from '../../../../utils/options';

const CtaStyle = ({ attributes, updateObj, device = 'desktop' }) => {
	const { cta = {}, columns = [] } = attributes;
	const [state, setState] = useState('normal');

	const hasCta = columns.some((column) => column?.ctaLabel);

	return <PanelBody className='bPlPanelBody' title={__('CTA Button', 'b-blocks')} initialOpen={false}>
		{!hasCta && <Notice status='info' isIcon={true}>
			{__('No column has a CTA yet — add a button label under Columns (Plans) to see these styles.', 'b-blocks')}
		</Notice>}

		<Label className='mb5'>{__('Position', 'b-blocks')}</Label>
		<ToggleGroupControl
			className='flex1'
			size='small'
			style={{ padding: '2px' }}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			value={cta.position || 'top'}
			onChange={(val) => updateObj('cta', val || 'top', 'position')}
		>
			<ToggleGroupControlOption label={__('In header', 'b-blocks')} value='top' />
			<ToggleGroupControlOption label={__('Column bottom', 'b-blocks')} value='bottom' />
		</ToggleGroupControl>

		<Flex className='mt10'>
			<Label className='flex1'><Flex justify='flex-start' gap={0}>{__('Alignment', 'b-blocks')} <Device /></Flex></Label>
			<ToggleGroupControl
				className='flex1'
				style={{ padding: '2px' }} __next40pxDefaultSize __nextHasNoMarginBottom isBlock isDeselectable
				value={cta?.[device]?.alignment}
				onChange={(val) => updateObj('cta', val, device, 'alignment')}
			>
				<ToggleGroupControlOptionIcon label={__('Left', 'b-blocks')} value='left' icon={<AlignStartIcon style={{ rotate: '-90deg' }} />} />
				<ToggleGroupControlOptionIcon label={__('Center', 'b-blocks')} value='center' icon={<AlignCenterIcon style={{ rotate: '-90deg' }} />} />
				<ToggleGroupControlOptionIcon label={__('Right', 'b-blocks')} value='right' icon={<AlignEndIcon style={{ rotate: '-90deg' }} />} />
			</ToggleGroupControl>
		</Flex>

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={cta.typo || {}} onChange={(val) => updateObj('cta', val, 'typo')} />

		<ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={state} onChange={setState}>
			<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
			<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
		</ToggleGroupControl>

		<Background className='mt10' label={__('Background', 'b-blocks')} value={cta?.[state]?.bg || {}} onChange={(val) => updateObj('cta', val, state, 'bg')} />

		<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={cta?.[state]?.color} onChange={(val) => updateObj('cta', val, state, 'color')} />

		<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={cta.border || {}} onChange={(val) => updateObj('cta', val, 'border')} />

		<BoxControl
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			values={cta?.[device]?.margin}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('cta', val, device, 'margin')}
		/>

		<BoxControl label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={cta?.[device]?.padding} resetValues={EMPTY_BOX} onChange={(val) => updateObj('cta', val, device, 'padding')} />

		<BoxControl label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={cta?.[device]?.radius} resetValues={EMPTY_BOX} onChange={(val) => updateObj('cta', val, device, 'radius')} />

		{'hover' === state && <RangeControl
			className='mt10'
			label={__('Transition', 'b-blocks')}
			value={cta.transition ?? 0.2}
			min={0}
			max={2}
			step={0.05}
			onChange={(val) => updateObj('cta', val, 'transition')}
			__next40pxDefaultSize
			__nextHasNoMarginBottom
		/>}
	</PanelBody>;
};
export default CtaStyle;
