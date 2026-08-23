import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { Label, Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const AllButtons = ({ buttonStyle = {}, updateObj, device = 'desktop' }) => {
	return <PanelBody className='bPlPanelBody' title={__('All Buttons (Global)', 'b-blocks')} initialOpen={false}>

		<ColorControl label={__('Icon / Text Color', 'b-blocks')} value={buttonStyle.color} onChange={(val) => updateObj('buttonStyle', val, 'color')} />

		<Background label={__('Background', 'b-blocks')} value={buttonStyle.bg} onChange={(val) => updateObj('buttonStyle', val, 'bg')} />

		<ColorControl label={__('Hover Color', 'b-blocks')} value={buttonStyle.hoverColor} onChange={(val) => updateObj('buttonStyle', val, 'hoverColor')} />

		<Background label={__('Hover Background', 'b-blocks')} value={buttonStyle.hoverBg} onChange={(val) => updateObj('buttonStyle', val, 'hoverBg')} />
		<Flex className='mt10'>
			<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Icon Size', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={buttonStyle.iconSize?.[device]} units={UNITS} onChange={(val) => updateObj('buttonStyle', val, 'iconSize', device)} __next40pxDefaultSize />
		</Flex>
		
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={buttonStyle.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('buttonStyle', val, 'margin', device)}
		/>

		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={buttonStyle.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('buttonStyle', val, 'padding', device)}
		/>

		<BorderControl label={__('Border', 'b-blocks')} value={buttonStyle.border} onChange={(val) => updateObj('buttonStyle', val, 'border')} withSlider __next40pxDefaultSize />
		
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={buttonStyle.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('buttonStyle', val, 'borderRadius', device)}
		/>
	</PanelBody>
}

export default AllButtons;
