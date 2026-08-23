import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const CaptionStyle = ({ caption = {}, updateObj }) => <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
	<ColorControl label={__('Color:', 'b-blocks')} value={caption.color} onChange={(val) => updateObj('caption', val, 'color')} />

	<Typography className='mt10' label={__('Typography', 'b-blocks')} value={caption.typo} onChange={(val) => updateObj('caption', val, 'typo')} />
</PanelBody>;
export default CaptionStyle;
