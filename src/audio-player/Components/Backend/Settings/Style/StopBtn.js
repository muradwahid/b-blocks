import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Label, Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const StopBtn = ({ stopBtnStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Stop Button', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Icon / Text Color:', 'b-blocks')} value={stopBtnStyle.color || ''} onChange={(val) => updateObj('stopBtnStyle', val, 'color')} />
		<Background label={__('Background:', 'b-blocks')} value={stopBtnStyle.bg} onChange={(val) => updateObj('stopBtnStyle', val, 'bg')} />
		<ColorControl label={__('Hover Color:', 'b-blocks')} value={stopBtnStyle.hoverColor || ''} onChange={(val) => updateObj('stopBtnStyle', val, 'hoverColor')} />
		<Background label={__('Hover Background:', 'b-blocks')} value={stopBtnStyle.hoverBg} onChange={(val) => updateObj('stopBtnStyle', val, 'hoverBg')} />
		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={stopBtnStyle.iconSize?.[device]} units={UNITS} onChange={(val) => updateObj('stopBtnStyle', val, 'iconSize', device)} __next40pxDefaultSize />
		</Flex>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={stopBtnStyle.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('stopBtnStyle', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={stopBtnStyle.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('stopBtnStyle', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={stopBtnStyle.border} onChange={(val) => updateObj('stopBtnStyle', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={stopBtnStyle.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('stopBtnStyle', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default StopBtn;
