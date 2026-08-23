import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex } from '@wordpress/components';
import { Background, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Player = ({ player = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Player Container', 'b-blocks')} initialOpen={true}>
		<Background label={__('Background', 'b-blocks')} value={player.bg} onChange={(val) => updateObj('player', val, 'bg')} />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={player.margin?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('player', val, 'margin', device)}
		/>
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={player.padding?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('player', val, 'padding', device)}
		/>
		<BorderControl label={__('Border', 'b-blocks')} value={player.border} onChange={(val) => updateObj('player', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl
			className='mt10'
			label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>}
			units={UNITS}
			values={player.borderRadius?.[device]}
			resetValues={EMPTY_BOX}
			onChange={(val) => updateObj('player', val, 'borderRadius', device)}
		/>
	</PanelBody>
);

export default Player;
