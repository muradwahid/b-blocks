import { __ } from '@wordpress/i18n';
import { PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

import { bubbleIconPlacement, bubbleIconPositions, resolveDevice } from '../../../../utils/options';

const Bubble = ({ attributes, updateObj, device = 'desktop' }) => {
	const { bubble = {} } = attributes;

	const outside = 'center' !== bubbleIconPlacement(attributes, device);

	const offset = (label, key) => <>
		<Label className='mb0 mt10'>{label} <Device /></Label>

		<UnitControl
			value={resolveDevice(bubble, device, key, '')}
			onChange={(val) => updateObj('bubble', undefined === val ? '' : val, device, key)}
			__next40pxDefaultSize
		/>
	</>;

	return <PanelBody className='bPlPanelBody' title={__('Bubble', 'b-blocks')} initialOpen={false}>
		<Label className='mb0'>{__('Icon Position', 'b-blocks')} <Device /></Label>

		<ToggleGroupControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			isBlock
			value={resolveDevice(bubble, device, 'iconPosition', bubble.iconPosition || 'auto')}
			onChange={(val) => updateObj('bubble', val, device, 'iconPosition')}
		>
			{bubbleIconPositions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<small>{__('Center keeps the icon in the node. Auto lifts it out away from the edge the block sits on.', 'b-blocks')}</small>

		{outside && <>
			{offset(__('Icon Horizontal Offset', 'b-blocks'), 'x')}

			{offset(__('Icon Vertical Offset', 'b-blocks'), 'y')}
		</>}
	</PanelBody>;
};

export default Bubble;
