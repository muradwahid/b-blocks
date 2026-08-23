import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ColorControl } from '../../../../../../../bpl-tools/Components';

const Overlay = ({ overlay = {}, updateObj }) => (
	overlay.show === false ? null : (
		<PanelBody className='bPlPanelBody' title={__('Overlay', 'b-blocks')} initialOpen={false}>
			<ColorControl label={__('Overlay Color:', 'b-blocks')} value={overlay.color} onChange={(val) => updateObj('overlay', val, 'color')} defaultColor='rgba(0,0,0,0.5)' />
		</PanelBody>
	)
);
export default Overlay;
