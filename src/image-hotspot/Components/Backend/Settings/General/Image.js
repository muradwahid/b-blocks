import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { BtnGroup, Device, Label, MediaArea } from '../../../../../../../bpl-tools/Components';
import { imageFit } from '../../../../utils/options';
import { placeholderImg } from '../../../../../utils/data';

const Image = ({ attributes, setAttributes, device, updateObj }) => {
	const { image } = attributes;

	return <PanelBody className='bPlPanelBody' initialOpen={true} title={__('Image', 'b-blocks')} >
		<MediaArea label={__('Choose Image', 'b-blocks')} height='100%' width='100%' value={image?.url ? { url: image.url } : { url: placeholderImg }} default={placeholderImg} onChange={(value) => setAttributes({ image: { ...image, url: value.url, }, })} />
		{/* <p className='mt20'>Image Size</p>
		<UnitControl
			label={<Flex>{__('Width', 'b-blocks')} < Device /></Flex>}
			labelPosition='edge'
			units={[{ label: '%', value: '%' }]}
			isUnitSelectTabbable
			value={image.width[device]}
			min={1}
			max={100}
			onChange={(value) =>
			setAttributes({
				image: updateData(image, value, 'width', device),
			})
		}
 	/> */}
		<Label>{__('Image Fit', 'b-blocks')}</Label>
		<BtnGroup options={imageFit} size='small' value={image.objectFit} onChange={value=>updateObj('image',value,'objectFit')} />

		<UnitControl className='mt10' label={<Flex>{__('Height', 'b-blocks')} < Device /></Flex>} labelPosition='edge' isUnitSelectTabbable value={image[device].height} min={1} max={1000} onChange={(value) => updateObj('image', value, device, 'height')} />
	</PanelBody>
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Image);
