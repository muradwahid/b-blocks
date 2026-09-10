import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Typography as TypographyControl } from '../../../../../../../bpl-tools/Components';

// The code text itself. Line height also drives the Max Lines cap, so the two
// stay in step.
const Typography = ({ attributes, updateObj }) => {
	const { codeTypo = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Code Text', 'b-blocks')} initialOpen={false}>
		<TypographyControl label={__('Typography', 'b-blocks')} value={codeTypo} onChange={(val) => updateObj('codeTypo', val)} defaults={{ fontSize: { desktop: 15, tablet: 14, mobile: 13 } }} />
	</PanelBody>;
};

export default Typography;
