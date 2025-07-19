import { Flex, PanelBody, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { BtnGroup, Device } from '../../../../../../../bpl-tools/Components';
import { alignmentOptions } from '../../../../utils/options';
import ContentStyle from './ContentStyle';
import HeaderStyle from './HeaderStyle';
const Style = ({ attributes, device, updateObj }) => {
	const { table } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' title={__('General Style', 'b-blocks')} initialOpen={true}>
			<UnitControl label={<Flex>{__('Width', 'b-blocks')} <Device /></Flex>} labelPosition='edge' onChange={(value) => updateObj('table', value, 'width', device)} isUnitSelectTabbable value={table.width[device]} min={0} max={table.width[device].includes('%') ? 100 : 1200} />

			<BtnGroup label={__('Alignment', 'b-blocks')} options={alignmentOptions} value={table.alignment} onChange={(val) => updateObj('table', val, 'alignment')} isIcon={true} />

			<ToggleControl className='mt10' label={__('Separate Border', 'b-blocks')} checked={table.borderSeparator} onChange={(value) => updateObj('table', value, 'borderSeparator')} />

		</PanelBody>
		<HeaderStyle {...{ attributes, updateObj }} />
		<ContentStyle {...{ attributes, updateObj }} />
	</>
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Style);
