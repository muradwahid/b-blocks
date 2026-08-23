import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Label, Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const RepeatBtn = ({ repeatBtnStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Repeat Button', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Icon / Text Color:', 'b-blocks')} value={repeatBtnStyle.color || ''} onChange={(val) => updateObj('repeatBtnStyle', val, 'color')} />
		<Background label={__('Background:', 'b-blocks')} value={repeatBtnStyle.bg} onChange={(val) => updateObj('repeatBtnStyle', val, 'bg')} />
		<ColorControl label={__('Hover Color:', 'b-blocks')} value={repeatBtnStyle.hoverColor || ''} onChange={(val) => updateObj('repeatBtnStyle', val, 'hoverColor')} />
		<Background label={__('Hover Background:', 'b-blocks')} value={repeatBtnStyle.hoverBg} onChange={(val) => updateObj('repeatBtnStyle', val, 'hoverBg')} />
		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={repeatBtnStyle.iconSize?.[device]} units={UNITS} onChange={(val) => updateObj('repeatBtnStyle', val, 'iconSize', device)} __next40pxDefaultSize />
		</Flex>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={repeatBtnStyle.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('repeatBtnStyle', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={repeatBtnStyle.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('repeatBtnStyle', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={repeatBtnStyle.border} onChange={(val) => updateObj('repeatBtnStyle', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={repeatBtnStyle.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('repeatBtnStyle', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default RepeatBtn;
