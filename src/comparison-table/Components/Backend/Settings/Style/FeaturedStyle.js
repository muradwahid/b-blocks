import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Background, ColorControl } from '../../../../../../../bpl-tools/Components';

/** Everything that only applies to the highlighted column and its badge. */
const FeaturedStyle = ({ attributes, updateObj }) => {
	const { featured = {} } = attributes;

	return <PanelBody className='bPlPanelBody' title={__('Featured Column', 'b-blocks')} initialOpen={false}>
		<Background label={__('Header Background', 'b-blocks')} value={featured.bg || {}} onChange={(val) => updateObj('featured', val, 'bg')} />

		<ColorControl className='mt10' label={__('Header Text:', 'b-blocks')} value={featured.color} onChange={(val) => updateObj('featured', val, 'color')} />

		<Background className='mt10' label={__('Column Background', 'b-blocks')} value={featured.columnBg || {}} onChange={(val) => updateObj('featured', val, 'columnBg')} />

		<hr />

		<Background label={__('Badge Background', 'b-blocks')} value={featured.labelBg || {}} onChange={(val) => updateObj('featured', val, 'labelBg')} />

		<ColorControl className='mt10' label={__('Badge Text:', 'b-blocks')} value={featured.labelColor} onChange={(val) => updateObj('featured', val, 'labelColor')} />
	</PanelBody>;
};
export default FeaturedStyle;
