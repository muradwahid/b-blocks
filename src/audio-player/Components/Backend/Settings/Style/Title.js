import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex } from '@wordpress/components';
import { Background, ColorControl, Typography, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Title = ({ title = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Track Title', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Color:', 'b-blocks')} value={title.color || '#ffffff'} onChange={(val) => updateObj('title', val, 'color')} defaultColor='#ffffff' />
		<Background className='mt10' label={__('Background:', 'b-blocks')} value={title.bg} onChange={(val) => updateObj('title', val, 'bg')} />
		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={title.typo} onChange={(val) => updateObj('title', val, 'typo')} />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={title.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('title', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={title.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('title', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={title.border} onChange={(val) => updateObj('title', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={title.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('title', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default Title;
