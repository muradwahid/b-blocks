import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Label, Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const RestartBtn = ({ restartBtnStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Restart Button', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Icon / Text Color:', 'b-blocks')} value={restartBtnStyle.color || ''} onChange={(val) => updateObj('restartBtnStyle', val, 'color')} />
		<Background label={__('Background:', 'b-blocks')} value={restartBtnStyle.bg} onChange={(val) => updateObj('restartBtnStyle', val, 'bg')} />
		<ColorControl label={__('Hover Color:', 'b-blocks')} value={restartBtnStyle.hoverColor || ''} onChange={(val) => updateObj('restartBtnStyle', val, 'hoverColor')} />
		<Background label={__('Hover Background:', 'b-blocks')} value={restartBtnStyle.hoverBg} onChange={(val) => updateObj('restartBtnStyle', val, 'hoverBg')} />
		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={restartBtnStyle.iconSize?.[device]} units={UNITS} onChange={(val) => updateObj('restartBtnStyle', val, 'iconSize', device)} __next40pxDefaultSize />
		</Flex>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={restartBtnStyle.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('restartBtnStyle', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={restartBtnStyle.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('restartBtnStyle', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={restartBtnStyle.border} onChange={(val) => updateObj('restartBtnStyle', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={restartBtnStyle.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('restartBtnStyle', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default RestartBtn;
