import { __ } from '@wordpress/i18n';
import { Flex, PanelBody } from '@wordpress/components';

import { BoxControl, Device, ShadowControl } from '../../../../../../../bpl-tools/Components';

import { EMPTY_BOX, UNITS } from '../../../../utils/options';

const MapStyle = ({ map = {}, updateObj, device = 'desktop' }) => <PanelBody className='bPlPanelBody' title={__('Map', 'b-blocks')} initialOpen={true}>
	<BoxControl label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={map.borderRadius?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('map', val, 'borderRadius', device)} />

	<ShadowControl className='mt10' label={__('Box Shadow', 'b-blocks')} value={map.shadow} onChange={(val) => updateObj('map', val, 'shadow')} />
</PanelBody>;
export default MapStyle;
