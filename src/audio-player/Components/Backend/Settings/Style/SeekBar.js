import { __ } from '@wordpress/i18n';
import { PanelBody, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Label, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const SeekBar = ({ seekStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Seek Bar / Progress', 'b-blocks')} initialOpen={false}>

		<ColorControl label={__('Track Color', 'b-blocks')} value={seekStyle.trackColor} onChange={(val) => updateObj('seekStyle', val, 'trackColor')} />

		<ColorControl label={__('Progress Fill Color', 'b-blocks')} value={seekStyle.fillColor} onChange={(val) => updateObj('seekStyle', val, 'fillColor')} />

		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Track Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={seekStyle.trackSize?.[device]} units={UNITS} onChange={(val) => updateObj('seekStyle', val, 'trackSize', device)} __next40pxDefaultSize />
		</Flex>

		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Progress Fill Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={seekStyle.fillSize?.[device]} units={UNITS} onChange={(val) => updateObj('seekStyle', val, 'fillSize', device)} __next40pxDefaultSize />
		</Flex>

		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>} units={UNITS} values={seekStyle.margin?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('seekStyle', val, 'margin', device)}/>

		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={seekStyle.borderRadius?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('seekStyle', val, 'borderRadius', device)}/>

	</PanelBody>
);

export default SeekBar;
