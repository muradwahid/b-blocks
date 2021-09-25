import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { BlockControls, InspectorControls, MediaPlaceholder, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, withNotices, Button, ToolbarItem, PanelRow, ToggleControl } from '@wordpress/components';

// Variables
import Title from '../../Components/Title';
import BColor from '../../Components/BColor';
import BtnGroup from '../../Components/BtnGroup';
import BDevice from '../../Components/BDevice';
import Typography from '../../Components/Typography';
import SpaceControl from '../../Components/SpaceControl';
import BorderControl from '../../Components/BorderControl';
import ShadowControl from '../../Components/ShadowControl';
import options from '../../Const/options';
const { aligns } = options;

const Edit = props => {
    const { className, attributes: { images, columns, imgPadding, imgBorder, imgShadow, isCap, capAlign, capColor, capTitleTypo, capDescTypo }, setAttributes, clientId, isSelected, noticeOperations, noticeUI } = props;

    // useEffect
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    // Get only urls
    let urls = [];
    images.map((image) => urls.push(image.url));

    const [device, setDevice] = useState('desktop');

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('Layouts Settings')}>
                {/* Columns */}
                <PanelRow>
                    <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                    <BDevice device={device} onChange={val => setDevice(val)} />
                </PanelRow>
                <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={9} step={1} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                {/* Padding */}
                <SpaceControl label={__('Padding:', 'b-blocks')} space={imgPadding} onChange={val => setAttributes({ imgPadding: val })} />

                {/* Border */}
                <BorderControl label={__('Border:', 'b-blocks')} border={imgBorder} onChange={val => setAttributes({ imgBorder: val })} />

                {/* Shadow */}
                <ShadowControl label={__('Shadow:', 'b-blocks')} shadow={imgShadow} onChange={val => setAttributes({ imgShadow: val })} defaults={{ type: 'text' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Caption Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Caption', 'b-blocks')} checked={isCap} onChange={val => setAttributes({ isCap: val })} />

                {/* Text Align */}
                <PanelRow className='mt-20p'>
                    <Title mt='0' mb='0'>{__('Text Align:', 'b-blocks')}</Title>
                    <BtnGroup icon={true} options={aligns} myValue={capAlign} setState={val => setAttributes({ capAlign: val })} />
                </PanelRow>

                {/* Color */}
                <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={capColor} onChange={val => setAttributes({ capColor: val })} defaultColor='#333' />

                {/* Title Typography */}
                <Typography className='mt-20p' label={__('Title Typography:', 'b-blocks')} typography={capTitleTypo} onChange={val => setAttributes({ capTitleTypo: val })} defaults={{ fontSize: 18 }} />

                {/* Description Typography */}
                <Typography className='mt-20p' label={__('Description Typography:', 'b-blocks')} typography={capDescTypo} onChange={val => setAttributes({ capDescTypo: val })} defaults={{ fontSize: 18 }} />
            </PanelBody>
        </InspectorControls>

        {0 < images.length && <BlockControls>
            <ToolbarItem>
                <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={images.map(img => img.id)} onSelect={val => setAttributes({ images: val })} multiple gallery render={({ open }) => <Button className='components-icon-button components-toolbar__control' label={__('Edit Gallery', 'b-blocks')} icon='edit' onClick={open} />} />
                </MediaUploadCheck>
            </ToolbarItem>
        </BlockControls>}


        <div id={`bBlocksImageGallery-${clientId}`} className={className}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${capTitleTypo?.googleFontLink});
                @import url(${capDescTypo?.googleFontLink});

                #bBlocksImageGallery-${clientId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImg{
                    padding: ${imgPadding?.styles || '0 0'};
                    ${imgBorder?.styles}
                    filter: drop-shadow(${imgShadow?.styles})
                }
                #bBlocksImageGallery-${clientId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption{
                    color: ${capColor};
                    margin: ${imgPadding?.styles || '0 0'};
                    width: calc((100% - 10px) - (${imgPadding?.horizontal || '0px'} * 2));
                    height: calc((100% - 10px) - (${imgPadding?.vertical || '0px'} * 2));
                    border-radius: ${imgBorder?.radius || '0px'};
                }
                #bBlocksImageGallery-${clientId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption h4{
                    ${capTitleTypo?.styles || 'font-size: 18px;'}
                }
                #bBlocksImageGallery-${clientId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption p{
                    ${capDescTypo?.styles || 'font-size: 15px;'}
                }
            `}} />

            {0 === images.length ?
                <MediaPlaceholder labels={{ title: __(' Gallery Images', 'b-blocks'), instructions: __('Drag media files, upload or select files from your library.', 'b-blocks') }} icon='format-gallery' allowedTypes={['image']} accept='image/*' multiple onSelect={val => setAttributes({ images: val })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} /> :

                <div className={`imgGalleryWrapper columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                    {images.map(img => (
                        <a key={img.id} className='imgGalleryImgLink'>
                            <img src={img.url} alt='' className='imgGalleryImg' />

                            {(isCap && img.caption) && <div className={`imgGalleryImgCaption text-${capAlign}`}>
                                <div className='captionContent'>
                                    <h4>{img.caption}</h4>
                                    <p>{img.description}</p>
                                </div>
                            </div>}
                        </a>
                    ))}
                </div>
            }

            {isSelected && 0 < images.length && <MediaUpload allowedTypes={['image']} accept='image/*' multiple value={images[images.length - 1].id} onSelect={newImgs => {
                let updatedImages = [...images, ...newImgs];
                setAttributes({ images: updatedImages });
            }} render={({ open }) => <Button className='imgGalleryUploadButton' label={__('Add Images', 'b-blocks')} icon='plus-alt' onClick={open}> Add Images</Button>}
            />}
        </div>
    </>;
};
export default withNotices(Edit);