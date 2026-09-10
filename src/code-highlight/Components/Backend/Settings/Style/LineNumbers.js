import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Background, ColorControl } from '../../../../../../../bpl-tools/Components';

const LineNumbers = ({ attributes, updateObj }) => {
	const { lineNumber = {}, options = {} } = attributes;

	if (!options.lineNumbers) return null;

	return <PanelBody className='bPlPanelBody' title={__('Line Numbers', 'b-blocks')} initialOpen={false}>
		<ColorControl label={__('Number Color', 'b-blocks')} value={lineNumber.color} onChange={(val) => updateObj('lineNumber', val, 'color')} />

		<Background className='mt10' label={__('Gutter Background', 'b-blocks')} value={lineNumber.background} onChange={(val) => updateObj('lineNumber', val, 'background')} />

		<ColorControl className='mt10' label={__('Divider Color', 'b-blocks')} value={lineNumber.borderColor} onChange={(val) => updateObj('lineNumber', val, 'borderColor')} />
	</PanelBody>;
};

export default LineNumbers;
