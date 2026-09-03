import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RangeControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Typography } from '../../../../../../../bpl-tools/Components';

import { EMPTY_BOX } from '../../../../utils/options';

const CellsStyle = ({ attributes, updateObj, device = 'desktop' }) => {
	const { body = {}, rowColors = {} } = attributes;

	const [state, setState] = useState('normal');

	const isHover = 'hover' === state;

	return <PanelBody className='bPlPanelBody' title={__('Cells', 'b-blocks')} initialOpen={false}>
		<BoxControl label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={body?.[device]?.padding} resetValues={EMPTY_BOX} onChange={(val) => updateObj('body', val, device, 'padding')} />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={body.typo || {}} onChange={(val) => updateObj('body', val, 'typo')} />

		<ToggleGroupControl className='flex1 mt10' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={state} onChange={setState}>
			<ToggleGroupControlOption label={__('Normal', 'b-blocks')} value='normal' />
			<ToggleGroupControlOption label={__('Hover', 'b-blocks')} value='hover' />
		</ToggleGroupControl>

		{isHover ? <>
			<ColorControl className='mt10' label={__('Row Text Color:', 'b-blocks')} value={rowColors.hover?.color} onChange={(val) => updateObj('rowColors', val, 'hover', 'color')} />

			<Background className='mt10' label={__('Row Background', 'b-blocks')} value={rowColors.hover?.bg} onChange={(val) => updateObj('rowColors', val, 'hover', 'bg')} />

			<RangeControl className='mt10' label={__('Transition', 'b-blocks')} value={rowColors.transition ?? 0.2} min={0} max={5} step={0.05} onChange={(val) => updateObj('rowColors', val, 'transition')} __next40pxDefaultSize __nextHasNoMarginBottom />
		</> : <>
			<ColorControl className='mt10' label={__('Odd Row Text:', 'b-blocks')} value={rowColors.odd?.color} onChange={(val) => updateObj('rowColors', val, 'odd', 'color')} />

			<Background className='mt10' label={__('Odd Row Background', 'b-blocks')} value={rowColors.odd?.bg} onChange={(val) => updateObj('rowColors', val, 'odd', 'bg')} />

			<Background className='mt10' label={__('Stripe Background', 'b-blocks')} value={rowColors.stripe || {}} onChange={(val) => updateObj('rowColors', val, 'stripe')} />

			<ColorControl className='mt10' label={__('Even Row Text:', 'b-blocks')} value={rowColors.even?.color} onChange={(val) => updateObj('rowColors', val, 'even', 'color')} />

			<Background className='mt10' label={__('Even Row Background', 'b-blocks')} value={rowColors.even?.bg} onChange={(val) => updateObj('rowColors', val, 'even', 'bg')} />
		</>}
	</PanelBody>;
};
export default CellsStyle;
