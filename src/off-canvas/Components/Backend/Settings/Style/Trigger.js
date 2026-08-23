import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, RangeControl, Flex, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Background, ColorControl, Typography, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Trigger = ({ trigger = {}, updateObj, device = 'desktop' }) => {
	const [state, setState] = useState('normal');
	const hover = state === 'hover';
	const current = trigger[state] || {};

	return (
		<PanelBody className='bPlPanelBody' title={__('Trigger Button', 'b-blocks')} initialOpen={true}>

			<Typography label={__('Typography', 'b-blocks')} value={trigger.typo} onChange={(val) => updateObj('trigger', val, 'typo')} />

			<ToggleGroupControl className='mt10 flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={state} onChange={(val) => setState(val)}>
				<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
				<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
			</ToggleGroupControl>

			<Background className='mt10' label={__('Background', 'b-blocks')} value={current.bg} onChange={(val) => updateObj('trigger', val, state, 'bg')} />
			
			<ColorControl className='mt10' label={__('Text / Icon Color:', 'b-blocks')} value={current.color} onChange={(val) => updateObj('trigger', val, state, 'color')} defaultColor={hover ? '' : '#ffffff'} />

			<BorderControl label={__('Border', 'b-blocks')} value={current.border} onChange={(val) => updateObj('trigger', val, state, 'border')} withSlider __next40pxDefaultSize />
			
			<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={current.padding?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('trigger', val, state, 'padding', device)} />

			<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={current.borderRadius?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('trigger', val, state, 'borderRadius', device)} />

			{state === 'hover' && <RangeControl className='mt10' label={__('Transition (ms)', 'b-blocks')} value={trigger.transition} onChange={(val) => updateObj('trigger', val, 'transition')} min={0} max={2000} step={50} help={__('Hover animation speed.', 'b-blocks')} __nextHasNoMarginBottom />}

		</PanelBody>
	);
};
export default Trigger;