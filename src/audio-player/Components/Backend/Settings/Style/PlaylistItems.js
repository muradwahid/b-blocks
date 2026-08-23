import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex } from '@wordpress/components';
import { Background, ColorControl, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const PlaylistItems = ({ playlistStyle = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Playlist Items', 'b-blocks')} initialOpen={false}>

		<Background label={__('Item Background:', 'b-blocks')} value={playlistStyle.bg} onChange={(val) => updateObj('playlistStyle', val, 'bg')} />

		<ColorControl label={__('Item Color:', 'b-blocks')} value={playlistStyle.color} onChange={(val) => updateObj('playlistStyle', val, 'color')} />

		<Background label={__('Active Background:', 'b-blocks')} value={playlistStyle.activeBg} onChange={(val) => updateObj('playlistStyle', val, 'activeBg')} />

		<ColorControl label={__('Active Color:', 'b-blocks')} value={playlistStyle.activeColor} onChange={(val) => updateObj('playlistStyle', val, 'activeColor')} />

		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Item Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={playlistStyle.itemPadding?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('playlistStyle', val, 'itemPadding', device)} />

		<BorderControl label={__('Item Border', 'b-blocks')} value={playlistStyle.border} onChange={(val) => updateObj('playlistStyle', val, 'border')} withSlider __next40pxDefaultSize />

		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Item Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={playlistStyle.borderRadius?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('playlistStyle', val, 'borderRadius', device)} />

	</PanelBody>
);

export default PlaylistItems;
