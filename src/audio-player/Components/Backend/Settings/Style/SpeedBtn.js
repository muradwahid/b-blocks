import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex } from '@wordpress/components';
import { Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const SpeedBtn = ({ speedBtnStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Speed Button', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Icon / Text Color:', 'b-blocks')} value={speedBtnStyle.color || ''} onChange={(val) => updateObj('speedBtnStyle', val, 'color')} />
		<Background label={__('Background:', 'b-blocks')} value={speedBtnStyle.bg} onChange={(val) => updateObj('speedBtnStyle', val, 'bg')} />
		<ColorControl label={__('Hover Color:', 'b-blocks')} value={speedBtnStyle.hoverColor || ''} onChange={(val) => updateObj('speedBtnStyle', val, 'hoverColor')} />
		<Background label={__('Hover Background:', 'b-blocks')} value={speedBtnStyle.hoverBg} onChange={(val) => updateObj('speedBtnStyle', val, 'hoverBg')} />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={speedBtnStyle.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('speedBtnStyle', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={speedBtnStyle.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('speedBtnStyle', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={speedBtnStyle.border} onChange={(val) => updateObj('speedBtnStyle', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={speedBtnStyle.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('speedBtnStyle', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default SpeedBtn;
