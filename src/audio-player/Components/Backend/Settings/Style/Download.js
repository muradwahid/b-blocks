import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Label, Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Download = ({ downloadStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Download Link', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Icon / Text Color:', 'b-blocks')} value={downloadStyle.color || ''} onChange={(val) => updateObj('downloadStyle', val, 'color')} />
		<Background label={__('Background:', 'b-blocks')} value={downloadStyle.bg} onChange={(val) => updateObj('downloadStyle', val, 'bg')} />
		<ColorControl label={__('Hover Color:', 'b-blocks')} value={downloadStyle.hoverColor || ''} onChange={(val) => updateObj('downloadStyle', val, 'hoverColor')} />
		<Background label={__('Hover Background:', 'b-blocks')} value={downloadStyle.hoverBg} onChange={(val) => updateObj('downloadStyle', val, 'hoverBg')} />
		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={downloadStyle.iconSize?.[device]} units={UNITS} onChange={(val) => updateObj('downloadStyle', val, 'iconSize', device)} __next40pxDefaultSize />
		</Flex>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={downloadStyle.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('downloadStyle', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={downloadStyle.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('downloadStyle', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={downloadStyle.border} onChange={(val) => updateObj('downloadStyle', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={downloadStyle.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('downloadStyle', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default Download;
