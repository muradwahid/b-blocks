import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const TotalStyle = ({ attributes, updateObj }) => {
	const { total = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Total Results Text', 'b-blocks')} initialOpen={false}>
		<Typography label={__('Typography', 'b-blocks')} value={total.typo} onChange={(val) => updateObj('total', val, 'typo')} />
		<ColorControl className='mt10' label={__('Color:', 'b-blocks')} value={total.color} onChange={(val) => updateObj('total', val, 'color')} />
	</PanelBody>;
};
export default TotalStyle;
