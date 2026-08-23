import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex } from '@wordpress/components';
import { Background, ColorControl, Typography, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Artist = ({ artist = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Artist', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Color:', 'b-blocks')} value={artist.color || '#ffffff'} onChange={(val) => updateObj('artist', val, 'color')} defaultColor='#ffffff' />
		<Background className='mt10' label={__('Background:', 'b-blocks')} value={artist.bg} onChange={(val) => updateObj('artist', val, 'bg')} />
		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={artist.typo} onChange={(val) => updateObj('artist', val, 'typo')} />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={artist.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('artist', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={artist.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('artist', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={artist.border} onChange={(val) => updateObj('artist', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={artist.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('artist', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default Artist;
