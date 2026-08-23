import { __ } from '@wordpress/i18n';
import { PanelBody, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Label, ColorControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS } from '../../../../utils/options';

const Icon = ({ trigger = {}, updateObj, device = 'desktop' }) => {
	const iconStyle = trigger.iconStyle || {};

	return (
		<PanelBody className='bPlPanelBody' title={__('Trigger Icon', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Icon Color:', 'b-blocks')} value={iconStyle.color} onChange={(val) => updateObj('trigger', val, 'iconStyle', 'color')} />

			<Flex className='mt10'>
				<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
				<UnitControl className='flex1' value={iconStyle.size?.[device]} units={UNITS} onChange={(val) => updateObj('trigger', val, 'iconStyle', 'size', device)} __next40pxDefaultSize />
			</Flex>

			<Flex className='mt10'>
				<Label className='flex2'>{__('Icon / Label Gap', 'b-blocks')}</Label>
				<UnitControl className='flex1' value={iconStyle.gap} units={UNITS} onChange={(val) => updateObj('trigger', val, 'iconStyle', 'gap')} __next40pxDefaultSize />
			</Flex>
		</PanelBody>
	);
};
export default Icon;
