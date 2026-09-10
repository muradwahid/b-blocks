import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const Text = ({ attributes, updateObj }) => {
	const { text = {} } = attributes.content || {};

	return <PanelBody className='bPlPanelBody' title={__('Text', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Color', 'b-blocks')} value={text.color} onChange={(val) => updateObj('content', val, 'text', 'color')} defaultColor='#4B5563' />

		<Typography className='mt10' label={__('Typography', 'b-blocks')} value={text.typo} onChange={(val) => updateObj('content', val, 'text', 'typo')} defaults={{ fontSize: { desktop: 14, tablet: 13, mobile: 12 } }} />
	</PanelBody>;
};

export default Text;
