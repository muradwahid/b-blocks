import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Background, ColorControl } from '../../../../../../../bpl-tools/Components';

import { getHighlightMarks } from '../../../../utils/options';

/** Only worth showing once there is something highlighted to colour. */
const Highlight = ({ attributes, updateObj }) => {
	const { highlight = {} } = attributes;

	if (!getHighlightMarks(attributes).length) return null;

	return <PanelBody className='bPlPanelBody' title={__('Highlighted Lines', 'b-blocks')} initialOpen={false}>
		<Background label={__('Background', 'b-blocks')} value={highlight.background} onChange={(val) => updateObj('highlight', val, 'background')} />

		<ColorControl className='mt10' label={__('Edge Color', 'b-blocks')} value={highlight.borderColor} onChange={(val) => updateObj('highlight', val, 'borderColor')} help={__('The bar down the left of each highlighted line.', 'b-blocks')} />
	</PanelBody>;
};

export default Highlight;
