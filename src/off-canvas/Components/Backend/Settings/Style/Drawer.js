import { __ } from '@wordpress/i18n';
import { PanelBody, BorderControl, Flex } from '@wordpress/components';

import { Background, BoxControl, Device } from '../../../../../../../bpl-tools/Components';
import { UNITS, EMPTY_BOX } from '../../../../utils/options';

const Drawer = ({ drawer = {}, updateObj, device = 'desktop' }) => (
	<PanelBody className='bPlPanelBody' title={__('Drawer Panel', 'b-blocks')} initialOpen={false}>
		<Background label={__('Background', 'b-blocks')} value={drawer.bg} onChange={(val) => updateObj('drawer', val, 'bg')} />
		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={drawer.padding?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('drawer', val, 'padding', device)} />
		<BorderControl label={__('Border', 'b-blocks')} value={drawer.border} onChange={(val) => updateObj('drawer', val || {}, 'border')} withSlider __next40pxDefaultSize />
		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={drawer.borderRadius?.[device]} resetValues={EMPTY_BOX} onChange={(val) => updateObj('drawer', val, 'borderRadius', device)} />
	</PanelBody>
);
export default Drawer;
