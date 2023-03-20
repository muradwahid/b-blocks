import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { BlockControls, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToolbarGroup, ToolbarButton, PanelRow, ToggleControl, Dashicon } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BtnGroup from '../../../../Components/BtnGroup';
import BDevice from '../../../../Components/BDevice';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';

import { FilterImagesContext } from './edit';
import options from '../../utils/options';
const { aligns } = options;

const Settings = ({ settings }) => {
	const { attributes: { images, columns, imgPadding, imgBorder, imgShadow, isPreview, isCap, capAlign, capColor, capTitleTypo, capDescTypo }, setAttributes } = settings;

	const filterImages = useContext(FilterImagesContext);
	const [device, setDevice] = useState('desktop');

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				{/* <div className='helpItem'>
					<a href='https://bblockswp.com/docs/image-gallery-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div> */}

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Layouts Settings')}>
				<PanelRow>
					<Title className='mb5'>{__('Columns:', 'b-blocks')}</Title>
					<BDevice device={device} onChange={val => setDevice(val)} />
				</PanelRow>
				<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={9} step={1} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Image Settings', 'b-blocks')} initialOpen={false}>
				<SpaceControl label={__('Padding:', 'b-blocks')} value={imgPadding} onChange={val => setAttributes({ imgPadding: val })} />

				<BorderControl label={__('Border:', 'b-blocks')} value={imgBorder} onChange={val => setAttributes({ imgBorder: val })} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} value={imgShadow} onChange={val => setAttributes({ imgShadow: val })} defaults={{ type: 'text' }} />

				<ToggleControl className='mt20' label={__('Preview Image?', 'b-blocks')} checked={isPreview} onChange={val => setAttributes({ isPreview: val })} />
				<small>{__('Preview will only for frontend!', 'b-blocks')}</small>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Caption Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Caption', 'b-blocks')} checked={isCap} onChange={val => setAttributes({ isCap: val })} />

				<PanelRow className='mt20'>
					<Title className=''>{__('Text Align:', 'b-blocks')}</Title>
					<BtnGroup value={capAlign} onChange={val => setAttributes({ capAlign: val })} options={aligns} isIcon={true} />
				</PanelRow>

				<BColor label={__('Color:', 'b-blocks')} value={capColor} onChange={val => setAttributes({ capColor: val })} defaultColor='#333' />

				<Typography label={__('Title Typography:', 'b-blocks')} value={capTitleTypo} onChange={val => setAttributes({ capTitleTypo: val })} defaults={{ fontSize: { desktop: 18, tablet: 17, mobile: 16 } }} produce={produce} />

				<Typography label={__('Description Typography:', 'b-blocks')} value={capDescTypo} onChange={val => setAttributes({ capDescTypo: val })} defaults={{ fontSize: { desktop: 18, tablet: 17, mobile: 16 } }} produce={produce} />
			</PanelBody>
		</InspectorControls>


		{0 < images.length && <BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<MediaUploadCheck>
					<MediaUpload allowedTypes={['image']} value={images.map(img => img.id)} onSelect={val => setAttributes({ images: filterImages(val) })} multiple render={({ open }) => <ToolbarButton label={__('Edit Gallery', 'b-blocks')} icon='edit' onClick={open} />} />
				</MediaUploadCheck>
			</ToolbarGroup>
		</BlockControls>}
	</>;
};
export default Settings;