import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Label, Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const SkipBtn = ({ skipBtnStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Skip Buttons (Next / Prev)', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Icon / Text Color:', 'b-blocks')} value={skipBtnStyle.color || ''} onChange={(val) => updateObj('skipBtnStyle', val, 'color')} />
		<Background label={__('Background:', 'b-blocks')} value={skipBtnStyle.bg} onChange={(val) => updateObj('skipBtnStyle', val, 'bg')} />
		<ColorControl label={__('Hover Color:', 'b-blocks')} value={skipBtnStyle.hoverColor || ''} onChange={(val) => updateObj('skipBtnStyle', val, 'hoverColor')} />
		<Background label={__('Hover Background:', 'b-blocks')} value={skipBtnStyle.hoverBg} onChange={(val) => updateObj('skipBtnStyle', val, 'hoverBg')} />
		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={skipBtnStyle.iconSize?.[device]} units={UNITS} onChange={(val) => updateObj('skipBtnStyle', val, 'iconSize', device)} __next40pxDefaultSize />
		</Flex>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={skipBtnStyle.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('skipBtnStyle', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={skipBtnStyle.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('skipBtnStyle', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={skipBtnStyle.border} onChange={(val) => updateObj('skipBtnStyle', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={skipBtnStyle.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('skipBtnStyle', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default SkipBtn;
