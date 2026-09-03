import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Background, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';


const RowLabelStyle = ({ attributes, updateObj }) => {
	const { rowLabel = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Row Labels', 'b-blocks')} initialOpen={false}>
		<Background label={__('Background', 'b-blocks')} value={rowLabel.bg || {}} onChange={(val) => updateObj('rowLabel', val, 'bg')} />

		<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={rowLabel.color} onChange={(val) => updateObj('rowLabel', val, 'color')} />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={rowLabel.typo || {}} onChange={(val) => updateObj('rowLabel', val, 'typo')} />
	</PanelBody>;
};
export default RowLabelStyle;
