import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Label, Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const PlayBtn = ({ playBtnStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Play / Pause Button', 'b-blocks')} initialOpen={false}>

		<ColorControl label={__('Icon / Text Color:', 'b-blocks')} value={playBtnStyle.color} onChange={(val) => updateObj('playBtnStyle', val, 'color')} />

		<Background label={__('Background:', 'b-blocks')} value={playBtnStyle.bg} onChange={(val) => updateObj('playBtnStyle', val, 'bg')} />
		
		<ColorControl label={__('Hover Color:', 'b-blocks')} value={playBtnStyle.hoverColor} onChange={(val) => updateObj('playBtnStyle', val, 'hoverColor')} />

		<Background label={__('Hover Background:', 'b-blocks')} value={playBtnStyle.hoverBg} onChange={(val) => updateObj('playBtnStyle', val, 'hoverBg')} />
		
		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={playBtnStyle.iconSize?.[device]} units={UNITS} onChange={(val) => updateObj('playBtnStyle', val, 'iconSize', device)} __next40pxDefaultSize />
		</Flex>

		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={playBtnStyle.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('playBtnStyle', val, 'margin', device)}
		/>

		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={playBtnStyle.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('playBtnStyle', val, 'padding', device)}
		/>

		<BorderControl label={__('Border', 'b-blocks')} value={playBtnStyle.border} onChange={(val) => updateObj('playBtnStyle', val, 'border')} withSlider __next40pxDefaultSize />
		
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={playBtnStyle.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('playBtnStyle', val, 'borderRadius', device)}
		/>
		
	</PanelBody>
);

export default PlayBtn;
