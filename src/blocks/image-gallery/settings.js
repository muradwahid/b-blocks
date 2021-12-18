import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { BlockControls, InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToolbarGroup, ToolbarButton, PanelRow, ToggleControl } from '@wordpress/components';

import { FilterImagesContext } from './edit';

// Variables
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BtnGroup from '../../../../Components/BtnGroup';
import BDevice from '../../../../Components/BDevice';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';
import options from '../../Const/options';
const { aligns } = options;

const Settings = ({ settings }) => {
    const { attributes: { images, columns, imgPadding, imgBorder, imgShadow, isPreview, isCap, capAlign, capColor, capTitleTypo, capDescTypo }, setAttributes } = settings;

    const filterImages = useContext(FilterImagesContext);
    const [device, setDevice] = useState('desktop');

    return <>
        <InspectorControls>
            <PanelBody className='bPlPanelBody' title={__('Layouts Settings')}>
                {/* Columns */}
                <PanelRow>
                    <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                    <BDevice device={device} onChange={val => setDevice(val)} />
                </PanelRow>
                <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={9} step={1} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                {/* Padding */}
                <SpaceControl label={__('Padding:', 'b-blocks')} space={imgPadding} onChange={val => setAttributes({ imgPadding: val })} />

                {/* Border */}
                <BorderControl label={__('Border:', 'b-blocks')} border={imgBorder} onChange={val => setAttributes({ imgBorder: val })} />

                {/* Shadow */}
                <ShadowControl label={__('Shadow:', 'b-blocks')} shadow={imgShadow} onChange={val => setAttributes({ imgShadow: val })} defaults={{ type: 'text' }} />

                {/* Preview */}
                <ToggleControl className='mt20' label={__('Preview Image?', 'b-blocks')} checked={isPreview} onChange={val => setAttributes({ isPreview: val })} />
                <small>{__('Preview will only for frontend!', 'b-blocks')}</small>
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Caption Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Caption', 'b-blocks')} checked={isCap} onChange={val => setAttributes({ isCap: val })} />

                {/* Text Align */}
                <PanelRow className='mt20'>
                    <Title mt='0' mb='0'>{__('Text Align:', 'b-blocks')}</Title>
                    <BtnGroup value={capAlign} onChange={val => setAttributes({ capAlign: val })} options={aligns} isIcon={true} />
                </PanelRow>

                {/* Color */}
                <BColor label={__('Color:', 'b-blocks')} value={capColor} onChange={val => setAttributes({ capColor: val })} defaultColor='#333' />

                {/* Title Typography */}
                <Typography label={__('Title Typography:', 'b-blocks')} typography={capTitleTypo} onChange={val => setAttributes({ capTitleTypo: val })} defaults={{ fontSize: 18 }} />

                {/* Description Typography */}
                <Typography label={__('Description Typography:', 'b-blocks')} typography={capDescTypo} onChange={val => setAttributes({ capDescTypo: val })} defaults={{ fontSize: 18 }} />
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