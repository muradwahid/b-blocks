import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BoxControl, ColorControl, Device, Label, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';

import { EMPTY_BOX, infoTriggers, UNITS } from '../../../../utils/options';

const InfoWindowStyle = ({ infoWindow = {}, updateObj, device = 'desktop' }) => <PanelBody className='bPlPanelBody' title={__('Info Window', 'b-blocks')} initialOpen={false}>
	<SelectControl label={__('Open On', 'b-blocks')} value={infoWindow.trigger || 'click'} options={infoTriggers} onChange={(val) => updateObj('infoWindow', val, 'trigger')} __nextHasNoMarginBottom />

	<ToggleControl
		className='mt10'
		label={__('Only one open at a time', 'b-blocks')}
		checked={false !== infoWindow.singleOpen}
		onChange={(val) => updateObj('infoWindow', !!val, 'singleOpen')}
		__nextHasNoMarginBottom
	/>

	<ColorControl className='mt10' label={__('Background:', 'b-blocks')} value={infoWindow.bgColor} onChange={(val) => updateObj('infoWindow', val, 'bgColor')} />

	<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={infoWindow.textColor} onChange={(val) => updateObj('infoWindow', val, 'textColor')} />

	<Typography className='mt10' label={__('Typography', 'b-blocks')} value={infoWindow.typo} onChange={(val) => updateObj('infoWindow', val, 'typo')} />

	<Flex className='mt10'>
		<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Max Width', 'b-blocks')} <Device /></Flex></Label>
		<UnitControl className='flex1' units={UNITS} value={infoWindow?.[device]?.maxWidth} onChange={(val) => updateObj('infoWindow', val, device, 'maxWidth')} __next40pxDefaultSize />
	</Flex>

	<BoxControl label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={infoWindow?.[device]?.padding} resetValues={EMPTY_BOX} onChange={(val) => updateObj('infoWindow', val, device, 'padding')} />

	<BoxControl label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={infoWindow?.[device]?.radius} resetValues={EMPTY_BOX} onChange={(val) => updateObj('infoWindow', val, device, 'radius')} />

	<ShadowControl className='mt10' label={__('Box Shadow', 'b-blocks')} value={infoWindow.shadow} onChange={(val) => updateObj('infoWindow', val, 'shadow')} />
</PanelBody>;
export default InfoWindowStyle;
