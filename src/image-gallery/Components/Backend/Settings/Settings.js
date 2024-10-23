import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, PanelRow, ToggleControl } from '@wordpress/components';

import { Label, ColorControl, Device, BtnGroup, Typography, MediaEditControl, HelpPanel } from '../../../../../../bpl-tools/Components';
import { BorderControl, SpaceControl, ShadowControl } from '../../../../../../bpl-tools/Components/Deprecated';

import { pluginSlug } from '../../../../utils/data';
import { aligns } from '../../../../utils/options';

const Settings = ({ settings, filterImages, device }) => {
	const { attributes: { images, columns, imgPadding, imgBorder, imgShadow, isPreview, isCap, capAlign, capColor, capTitleTypo, capDescTypo }, setAttributes } = settings;

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />


			<PanelBody className='bPlPanelBody' title={__('Layouts Settings')}>
				<PanelRow>
					<Label className='mb5'>{__('Columns:', 'b-blocks')}</Label>
					<Device />
				</PanelRow>
				<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={9} step={1} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Image Settings', 'b-blocks')} initialOpen={false}>
				<SpaceControl label={__('Padding:', 'b-blocks')} value={imgPadding} onChange={val => setAttributes({ imgPadding: val })} />

				<BorderControl label={__('Border:', 'b-blocks')} value={imgBorder} onChange={val => setAttributes({ imgBorder: val })} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} value={imgShadow} onChange={val => setAttributes({ imgShadow: val })} defaults={{ type: 'text' }} type='text' />

				<ToggleControl className='mt20' label={__('Preview Image?', 'b-blocks')} checked={isPreview} onChange={val => setAttributes({ isPreview: val })} />
				<small>{__('Preview will only for frontend!', 'b-blocks')}</small>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Caption Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Caption', 'b-blocks')} checked={isCap} onChange={val => setAttributes({ isCap: val })} />

				<PanelRow className='mt20'>
					<Label className=''>{__('Text Align:', 'b-blocks')}</Label>
					<BtnGroup value={capAlign} onChange={val => setAttributes({ capAlign: val })} options={aligns} isIcon={true} />
				</PanelRow>

				<ColorControl label={__('Color:', 'b-blocks')} value={capColor} onChange={val => setAttributes({ capColor: val })} defaultColor='#333' />

				<Typography label={__('Title Typography:', 'b-blocks')} value={capTitleTypo} onChange={val => setAttributes({ capTitleTypo: val })} defaults={{ fontSize: { desktop: 18, tablet: 17, mobile: 16 } }} />

				<Typography label={__('Description Typography:', 'b-blocks')} value={capDescTypo} onChange={val => setAttributes({ capDescTypo: val })} defaults={{ fontSize: { desktop: 18, tablet: 17, mobile: 16 } }} />
			</PanelBody>
		</InspectorControls>


		{0 < images.length && <BlockControls>
			<MediaEditControl label={__('Edit Gallery', 'b-blocks')} icon='format-gallery' value={images} onChange={val => setAttributes({ images: filterImages(val) })} isMultiple={true} />
		</BlockControls>}
	</>;
};
export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	}
})(Settings);