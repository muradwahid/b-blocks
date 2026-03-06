import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, TextControl, ToggleControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, ItemsPanel, BtnGroup, Background } from '../../../../../../bpl-tools/Components';
import { BControlPro, BtnGroupPro, SelectControlPro } from '../../../../../../bpl-tools/ProControls';
import { layouts } from '../../../../utils/options';

const Style = props => {
	const { attributes, setAttributes, activeIndex, setActiveIndex, premiumProps } = props;
	const { items, columns, columnGap, rowGap, layout, alignment, textAlign, width, background, typography, color, colors, isIcon, icon, img, separator, padding, margin, border, shadow } = attributes;
	return <>
		<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')} initialOpen={false}>
			<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} />
		</PanelBody>
	</>
}
export default Style;