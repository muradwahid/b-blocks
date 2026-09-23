import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Typography } from '../../../../../../../bpl-tools/Components';

/** How the step's digits are set. Their colour is Style ▸ Item, per state. */
const NumberStyle = ({ attributes, updateObj }) => {
	const { number = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Number', 'b-blocks')} initialOpen={false}>
		<Typography label={__('Typography', 'b-blocks')} value={number.typo} onChange={(val) => updateObj('number', val, 'typo')} defaults={{ fontSize: { desktop: 15 } }} />
	</PanelBody>;
};

export default NumberStyle;
