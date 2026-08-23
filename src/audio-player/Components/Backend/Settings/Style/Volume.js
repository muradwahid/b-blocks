import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex } from '@wordpress/components';
import { ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Volume = ({ volumeStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Volume Control', 'b-blocks')} initialOpen={false}>

		<ColorControl label={__('Track Color', 'b-blocks')} value={volumeStyle.trackColor} onChange={(val) => updateObj('volumeStyle', val, 'trackColor')} />

		<ColorControl label={__('Fill Color', 'b-blocks')} value={volumeStyle.fillColor} onChange={(val) => updateObj('volumeStyle', val, 'fillColor')} />

		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>} units={UNITS} values={volumeStyle.margin?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('volumeStyle', val, 'margin', device)} />

		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={volumeStyle.padding?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('volumeStyle', val, 'padding', device)} />

		<BorderControl label={__('Border', 'b-blocks')} value={volumeStyle.border} onChange={(val) => updateObj('volumeStyle', val, 'border')} withSlider __next40pxDefaultSize />

		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={volumeStyle.borderRadius?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('volumeStyle', val, 'borderRadius', device)} />

	</PanelBody>
);

export default Volume;