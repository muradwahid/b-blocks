import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BorderBoxControl, Flex, PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { BoxControl, Background, ColorControl, Device, Typography } from '../../../../../../bpl-tools/Components';
import { at } from '../../../utils/functions';

const StatePanel = ({ group, value = {}, title, updateObj, device = 'desktop', defaultColors = {}, states, withMargin = false }) => {
	const options = states || [['normal', __('Normal', 'b-blocks')], ['hover', __('Hover', 'b-blocks')]];

	const [state, setState] = useState('normal');
	const current = value[state] || {};

	return <PanelBody className='bPlPanelBody' title={title} initialOpen={false}>
		<Typography
			label={__('Typography', 'b-blocks')}
			value={value.typo}
			onChange={(val) => updateObj(group, val, 'typo')}
		/>

		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={state} onChange={(val) => setState(val || 'normal')}>
			{options.map(([key, label]) => <ToggleGroupControlOption key={key} label={label} value={key} />)}
		</ToggleGroupControl>

		<ColorControl
			label={__('Text Color:', 'b-blocks')}
			value={current.color}
			defaultColor={defaultColors[state]}
			onChange={(val) => updateObj(group, val, state, 'color')}
		/>

		<Background
			label={__('Background:', 'b-blocks')}
			value={current.bg}
			isImage={false}
			onChange={(val) => updateObj(group, val, state, 'bg')}
		/>

		<BoxControl
			className='mt10'
			label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>}
			values={at(current, device, 'padding')}
			onChange={(val) => updateObj(group, val, state, device, 'padding')}
		/>

		{withMargin && <BoxControl
			className='mt10'
			label={<Flex>{__('Margin', 'b-blocks')} <Device /></Flex>}
			values={at(current, device, 'margin')}
			onChange={(val) => updateObj(group, val, state, device, 'margin')}
		/>}

		<BorderBoxControl
			className='mt10'
			__next40pxDefaultSize
			label={__('Border', 'b-blocks')}
			value={current.border}
			onChange={(val) => updateObj(group, val, state, 'border')}
		/>


		{'hover' === state && <RangeControl
			className='mt10'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Transition (s)', 'b-blocks')}
			help={__('How long the change from normal to hover takes.', 'b-blocks')}
			value={value.transition}
			onChange={(val) => updateObj(group, val ?? 0, 'transition')}
			min={0}
			max={2}
			step={0.05}
			allowReset
			resetFallbackValue={0.2}
		/>}

		<BoxControl
			className='mt10'
			label={<Flex>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			values={at(current, device, 'radius')}
			onChange={(val) => updateObj(group, val, state, device, 'radius')}
		/>
	</PanelBody>;
};

export default StatePanel;
