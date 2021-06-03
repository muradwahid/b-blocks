import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { BlockControls, FontSizePicker, InspectorControls, MediaPlaceholder, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { PanelBody, RangeControl, withNotices, Button, ToolbarGroup, SelectControl, PanelRow } from '@wordpress/components';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import options from '../../Const/options';
import BtnGroup from '../../GutenComp/BtnGroup';
import BDevice from '../../GutenComp/BDevice';
const { fontSizes, aligns, borderStyles, sizeTypes } = options;
const vAligns = [
    { label: 'Top', value: 'flex-start', icon: 'Top' },
    { label: 'Center', value: 'center', icon: 'Center' },
    { label: 'Bottom', value: 'flex-end', icon: 'Bottom' }
];
const hAligns = [
    { label: 'Left', value: 'flex-start', icon: 'Left' },
    { label: 'Center', value: 'center', icon: 'Center' },
    { label: 'Right', value: 'flex-end', icon: 'Right' }
];

const Edit = props => {
    const { className, attributes: { images, columns, imgPTB, imgPLR, borderWidth, borderStyle, borderColor, borderRadius, radiusType, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, isCap, capFontSize, capColor, capAlign, capVAlign, capHAlign }, setAttributes, isSelected, noticeOperations, noticeUI } = props;

    // Get only urls
    let urls = [];
    images.map((image) => urls.push(image.url));

    const [device, setDevice] = useState('desktop');

    return <>
        <InspectorControls>
            <PanelBody title={__('Layouts Settings')}>
                {/* Columns */}
                <PanelRow>
                    <Title mt='0'>Columns:</Title>
                    <BDevice device={device} onChange={val => setDevice(val)} />
                </PanelRow>
                <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={9} step={1} />
            </PanelBody>

            <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                {/* Padding Top Bottom */}
                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                <RangeControl value={imgPTB} onChange={val => setAttributes({ imgPTB: val })} min={0} max={100} step={1} />

                {/* Padding Left Right */}
                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                <RangeControl value={imgPLR} onChange={val => setAttributes({ imgPLR: val })} min={0} max={100} step={1} />
            </PanelBody>

            <PanelBody title={__('Image Border Settings', 'b-blocks')} initialOpen={false}>
                {/* Width */}
                <Title mt='0'>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={borderWidth} onChange={val => setAttributes({ borderWidth: val })} min={0} max={30} step={1} />

                {/* Style */}
                <Title>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={borderStyle} onChange={val => setAttributes({ borderStyle: val })} options={borderStyles} />

                {/* Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                    <BColor value={borderColor} onChange={val => setAttributes({ borderColor: val })} defaultColor='#00000000' />
                </PanelRow>

                {/* Radius */}
                <Title>{__('Radius:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={radiusType} setState={val => setAttributes({ radiusType: val })} classes='bBlocksSizeType' size='small' />

                <RangeControl value={borderRadius} onChange={val => setAttributes({ borderRadius: val })} min={0} max={50} step={1} />
            </PanelBody>

            <PanelBody title={__('Image Shadow Settings', 'b-blocks')} initialOpen={false}>
                {/* Color */}
                <PanelRow>
                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                    <BColor value={shadowColor} onChange={val => setAttributes({ shadowColor: val })} defaultColor='#000' />
                </PanelRow>

                {/* Horizontal Offset */}
                <Title>{__('Horizontal Offset:', 'b-blocks')}</Title>
                <RangeControl value={shadowHOffset} onChange={val => setAttributes({ shadowHOffset: val })} min={0} max={100} step={1} />

                {/* Vertical Offset */}
                <Title>{__('Vertical Offset:', 'b-blocks')}</Title>
                <RangeControl value={shadowVOffset} onChange={val => setAttributes({ shadowVOffset: val })} min={0} max={100} step={1} />

                {/* Blur */}
                <Title>{__('Blur:', 'b-blocks')}</Title>
                <RangeControl value={shadowBlur} onChange={val => setAttributes({ shadowBlur: val })} min={0} max={50} step={1} />
            </PanelBody>

            <PanelBody title={__('Caption Settings', 'b-blocks')} initialOpen={false}>
                {/* Font Size */}
                <Title mt='0'>{__('Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={capFontSize} onChange={val => setAttributes({ capFontSize: 'undefined' === typeof val ? 15 : val })} />

                {/* Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                    <BColor value={capColor} onChange={val => setAttributes({ capColor: val })} defaultColor='#333' />
                </PanelRow>

                {/* Text Align */}
                <Title>{__('Text Align:', 'b-blocks')}</Title>
                <BtnGroup icon={true} options={aligns} myValue={capAlign} setState={val => setAttributes({ capAlign: val })} />

                {/* Vertical Align */}
                <Title>{__('Vertical Align:', 'b-blocks')}</Title>
                <BtnGroup options={vAligns} myValue={capVAlign} setState={val => setAttributes({ capVAlign: val })} />

                {/* Horizontal Align */}
                <Title>{__('Horizontal Align:', 'b-blocks')}</Title>
                <BtnGroup options={hAligns} myValue={capHAlign} setState={val => setAttributes({ capHAlign: val })} />
            </PanelBody>
        </InspectorControls>

        {0 < images.length && <BlockControls>
            <ToolbarGroup>
                <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={images.map(img => img.id)} onSelect={val => setAttributes({ images: val })} multiple gallery render={({ open }) => <Button className='components-icon-button components-toolbar__control' label={__('Edit Gallery', 'b-blocks')} icon='edit' onClick={open} />} />
                </MediaUploadCheck>
            </ToolbarGroup>
        </BlockControls>}


        <div className={className}>
            {0 === images.length ?
                <MediaPlaceholder labels={{ title: __(' Gallery Images', 'b-blocks'), instructions: __('Drag media files, upload or select files from your library.', 'b-blocks') }} icon='format-gallery' allowedTypes={['image']} accept='image/*' multiple onSelect={val => setAttributes({ images: val })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} /> :

                <div className={`imgGalleryWrapper columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                    {images.map(img => (
                        <a key={img.id} className='imgGalleryImgLink'>
                            <img src={img.url} alt='' className={`imgGalleryImg ptb-${imgPTB} plr-${imgPLR} radius-${borderRadius}-${'%' === radiusType ? 'per' : radiusType}`} style={{ border: `${borderWidth}px ${borderStyle} ${borderColor}`, filter: `drop-shadow(${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px)` }} />

                            {isCap && <span className={`imgGalleryImgCaption  fontSize-${capFontSize} text-${capAlign} alignItems-${capVAlign} justifyContent-${capHAlign}`} style={{ color: capColor }}>{img.caption}</span>}
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