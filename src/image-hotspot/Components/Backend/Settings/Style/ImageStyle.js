import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Device } from '../../../../../../../bpl-tools/Components';

const ImageStyle = ({ attributes, device, updateObj }) => {
	const { image } = attributes;
	return <PanelBody className='bPlPanelBody' initialOpen={true} title={__('Image', 'b-blocks')}>

		<UnitControl label={<Flex>{__('Width', 'b-blocks')} < Device /></Flex>} labelPosition='edge' isUnitSelectTabbable value={image[device].width} min={1} max={100} onChange={(value) => updateObj('image', value, device, 'width')} />

		<UnitControl className='mt10' label={<Flex>{__('Height', 'b-blocks')} < Device /></Flex>} labelPosition='edge' isUnitSelectTabbable value={image[device].height} min={1} max={1000} onChange={(value) => updateObj('image', value, device, 'height')}
		/>
	</PanelBody>
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(ImageStyle);
