import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Background, ColorControl } from '../../../../../../../bpl-tools/Components';

/** The table body surface — mirrors data-table's own "Body" panel. */
const BodyStyle = ({ attributes, updateObj }) => {
	const { body = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Body', 'b-blocks')} initialOpen={false}>
		<Background label={__('Background', 'b-blocks')} value={body.bg || {}} onChange={(val) => updateObj('body', val, 'bg')} />

		<ColorControl className='mt10' label={__('Text Color:', 'b-blocks')} value={body.color} onChange={(val) => updateObj('body', val, 'color')} />
	</PanelBody>;
};
export default BodyStyle;
