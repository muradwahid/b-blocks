import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { emUnit, pxUnit, remUnit } from '../../../../../../../bpl-tools/utils/options';

import { iconPositions, iconShapes, iconViews } from '../../../../utils/options';

const Icon = ({ attributes, updateObj, device = 'desktop' }) => {
	const { icon = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Icon', 'b-blocks')} initialOpen={false}>

		<Label className='mb0 flex1'>{__('View', 'b-blocks')}</Label>

		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={icon.view} onChange={(val) => updateObj('icon', val, 'view')}>
			{iconViews.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>

		<Label className='mt10 flex1'>{__('Shape', 'b-blocks')}</Label>

		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={icon.shape} onChange={(val) => updateObj('icon', val, 'shape')}>
			{iconShapes.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>



		<Label className='mt10 flex1'>{__('Position', 'b-blocks')}</Label>

		<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={icon.position || 'top'} onChange={(val) => updateObj('icon', val, 'position')}>
			{iconPositions.map(({ label, value }) => <ToggleGroupControlOption key={value} label={label} value={value} />)}
		</ToggleGroupControl>


		<Flex className='mt10'>
			<Label className='mb0 flex2'>{__('Size', 'b-blocks')} <Device /></Label>

			<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={icon?.[device]?.size || ''} onChange={(val) => updateObj('icon', val, device, 'size')} units={[pxUnit(), emUnit(), remUnit()]} />
		</Flex>
	</PanelBody>;
};

export default Icon;
