import { Flex, ToggleControl, PanelBody, RangeControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Device, Label } from '../../../../../../../bpl-tools/Components';

const General = (props) => {
	const { attributes, updateObj, device = 'desktop' } = props;
	const { styles, options } = attributes;
	const { stickyTop } = styles;
	const { responsive } = options;
	return <>
		<PanelBody className='bPlPanelBody'>
			<RangeControl label={__('Sticky Top Value', 'b-blocks')} value={stickyTop} onChange={(value) => updateObj('styles', value, 'stickyTop')} min={0} max={1000}
				// help={__('This value will show in frontend.', 'b-blocks')}
			/>
			{/* <RangeControl label={__('Card Gaps', 'b-blocks')} value={cardGaps} onChange={(value) => updateObj('styles', value, 'cardGaps')} min={0} max={1000} /> */}
			<Flex>
				<Label className='mb0 flex3'>{__('Card Height', 'b-blocks')}<Device /></Label>
				<UnitControl className='flex1' value={styles[device].height} onChange={(value) => updateObj('styles', value, device, 'height')}
				// help={__('This height will show in frontend.', 'b-blocks')}
				/>
			</Flex>

		</PanelBody>

		<PanelBody className='bPlPanelBody'>
			<ToggleControl label={__('Disable On Desktop', 'b-blocks')} checked={responsive.desktop} value={responsive.desktop} onChange={(value) => updateObj('options', value, 'responsive', 'desktop')} />
			<ToggleControl className='mt10' label={__('Disable On Tablet', 'b-blocks')} checked={responsive.tablet} value={responsive.tablet} onChange={(value) => updateObj('options', value, 'responsive', 'tablet')} />
			<ToggleControl className='mt10' label={__('Disable On Mobile', 'b-blocks')} checked={responsive.mobile} value={responsive.mobile} onChange={(value) => updateObj('options', value, 'responsive', 'mobile')} />
		</PanelBody>
	</>
}
export default General;