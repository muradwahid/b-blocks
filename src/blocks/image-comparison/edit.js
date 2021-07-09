import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { AlignmentToolbar, BlockControls, InspectorControls, MediaUpload, MediaPlaceholder, RichText, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, FontSizePicker, PanelBody, RangeControl, SelectControl, ToggleControl, ToolbarGroup, withNotices, Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

// Variables
import Title from '../../GutenComp/Title';
import BtnGroup from '../../GutenComp/BtnGroup';
import BColor from '../../GutenComp/BColor';
import options from '../../Const/options';
const { fontSizes, sizeTypes, borderStyles } = options;

const Edit = props => {
    const { className, attributes: { contentAlign, beforeImgId, beforeImgUrl, beforeImgAlt, afterImgId, afterImgUrl, afterImgAlt, isSwap, imgWidth, imgWidthType, isLabel, beforeLabel, afterLabel, labelFontSize, labelColor, labelBGColor, labelPTB, labelPLR, isCap, cap, capFontSize, capColor, capBGColor, capPTB, capPLR, borderWidth, borderStyle, borderColor }, setAttributes, clientId, noticeOperations, noticeUI } = props;


    // useEffect
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    // useEffect(() => {
    //     const comparisonSlider = document.querySelector(`#bBlocksImageComparison-${clientId} .comparison-slider`);
    //     const beforeImg = document.querySelector(`#bBlocksImageComparison-${clientId} .comparison-slider .beforeImg`);

    //     if (beforeImg && comparisonSlider) {
    //         beforeImg.style.width = comparisonSlider.clientWidth;
    //         beforeImg.style.minWidth = comparisonSlider.clientWidth;
    //     }
    // }, [imgWidth, imgWidthType]);


    // Functions
    const onSelectBeforeImg = ({ id, url, alt }) => setAttributes({ beforeImgId: id, beforeImgUrl: url, beforeImgAlt: alt });
    const onSelectAfterImg = ({ id, url, alt }) => setAttributes({ afterImgId: id, afterImgUrl: url, afterImgAlt: alt });

    // const getImageSizes = () => {
    //     if (!image) return [];
    //     let options = [];
    //     const sizes = image.media_details.sizes;

    //     for (const key in sizes) {
    //         const imageSize = imageSizes.find(s => s.slug === key);
    //         if (imageSize) {
    //             options.push({ label: imageSize.name, value: sizes[key].source_url });
    //         }
    //     }
    //     return options;
    // }


    // Image Slider Scripts
    (function ($) {
        $(document).ready(function () {
            // If the comparison slider is present on the page lets initialize it, this is good you will include this in the main js to prevent the code from running when not needed
            if ($('.comparison-slider')[0]) {
                let compSlider = $('.comparison-slider');

                //let's loop through the sliders and initialize each of them
                compSlider.each(function () {
                    let compSliderWidth = $(this).width() + 'px';
                    $(this).find('.resize img').css({ width: compSliderWidth, minWidth: compSliderWidth });
                    drags($(this).find('.divider'), $(this).find('.resize'), $(this));
                });

                //if the user resizes the windows lets update our variables and resize our images
                $(window).on('resize', function () {
                    let compSliderWidth = compSlider.width() + 'px';
                    compSlider.find('.resize img').css({ width: compSliderWidth, minWidth: compSliderWidth });
                });
            }
        });

        // This is where all the magic happens
        function drags(dragElement, resizeElement, container) {
            // This creates a variable that detects if the user is using touch input instead of the mouse.
            let touched = false;
            window.addEventListener('touchstart', function () {
                touched = true;
            });
            window.addEventListener('touchend', function () {
                touched = false;
            });

            // click the image and move the slider on interaction with the mouse or the touch input
            dragElement.on('mousedown touchstart', function (e) {
                //add classes to the elements - good for css animations if you need it to
                dragElement.addClass('draggable');
                resizeElement.addClass('resizable');
                //create vars
                let startX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
                let dragWidth = dragElement.outerWidth();
                let posX = dragElement.offset().left + dragWidth - startX;
                let containerOffset = container.offset().left;
                let containerWidth = container.outerWidth();
                let minLeft = containerOffset + 10;
                let maxLeft = containerOffset + containerWidth - dragWidth - 10;

                //add event listener on the divider element
                dragElement.parents().on('mousemove touchmove', function (e) {
                    // if the user is not using touch input let do preventDefault to prevent the user from selecting the images as he moves the slider around.
                    if (touched === false) {
                        e.preventDefault();
                    }

                    let moveX = e.pageX ? e.pageX : e.originalEvent.touches[0].pageX;
                    let leftValue = moveX + posX - dragWidth;

                    // stop the divider from going over the limits of the container
                    if (leftValue < minLeft) {
                        leftValue = minLeft;
                    } else if (leftValue > maxLeft) {
                        leftValue = maxLeft;
                    }

                    let widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';

                    $('.draggable').css('left', widthValue).on('mouseup touchend touchcancel', function () {
                        $(this).removeClass('draggable');
                        resizeElement.removeClass('resizable');
                    });

                    $('.resizable').css('width', widthValue);

                }).on('mouseup touchend touchcancel', function () {
                    dragElement.removeClass('draggable');
                    resizeElement.removeClass('resizable');
                });
            }).on('mouseup touchend touchcancel', function () {
                // stop clicking the image and move the slider
                dragElement.removeClass('draggable');
                resizeElement.removeClass('resizable');
            });
        }
    })(jQuery);


    // Styles
    const sliderWrapperStyles = { border: `${borderWidth}px ${borderStyle} ${borderColor}` };

    const labelStyles = { color: labelColor, backgroundColor: labelBGColor };

    const captionStyles = { color: capColor, backgroundColor: capBGColor };

    return <>
        <InspectorControls>
            <PanelBody title={__('Image Settings', 'b-blocks')}>
                {/* Before Image */}
                <Title mt='0'>{__('Before Image:', 'b-blocks')}</Title>
                <div className='editImageHolder'>
                    <div className='mediaControl'>
                        <MediaUpload allowedTypes={['image']} value={beforeImgId} onSelect={onSelectBeforeImg} render={({ open }) => beforeImgId ? <div className='btnControl'>
                            <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
                            <Button icon='exit' onClick={() => setAttributes({ beforeImgId: null, beforeImgUrl: null, beforeImgAlt: '' })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
                        </div> : <div className='btnControl'>
                            <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
                        </div>} />
                    </div>

                    <img src={beforeImgUrl} alt={beforeImgAlt} />
                </div>

                {/* {beforeImgUrl && !isBlobURL(beforeImgUrl) && <>
                    <Title>{__('Before Image Alt Text:', 'b-blocks')}</Title>
                    <TextControl value={beforeImgAlt} onChange={val => setAttributes({ beforeImgAlt: val })} />
                </>}

                {beforeImgId && getImageSizes().length !== 0 && <>
                    <Title>{__('Select Before Image Size:', 'b-blocks')}</Title>
                    <SelectControl value={beforeImgUrl} onChange={val => setAttributes({ beforeImgUrl: val })} options={getImageSizes()} />
                </>} */}

                {/* After Image */}
                <Title>{__('After Image:', 'b-blocks')}</Title>
                <div className='editImageHolder'>
                    <div className='mediaControl'>
                        <MediaUpload allowedTypes={['image']} value={afterImgId} onSelect={onSelectAfterImg} render={({ open }) => afterImgId ? <div className='btnControl'>
                            <Button icon='controls-repeat' onClick={open}>{__('Replace', 'b-blocks')}</Button>
                            <Button icon='exit' onClick={() => setAttributes({ afterImgId: null, afterImgUrl: null, afterImgAlt: '' })} className='btnRed'>{__('Remove', 'b-blocks')}</Button>
                        </div> : <div className='btnControl'>
                            <Button icon='upload' onClick={open}>{__('Upload', 'b-blocks')}</Button>
                        </div>} />
                    </div>

                    <img src={afterImgUrl} alt={afterImgAlt} />
                </div>

                {/* {afterImgUrl && !isBlobURL(afterImgUrl) && <>
                    <Title>{__('After Image Alt Text:', 'b-blocks')}</Title>
                    <TextControl value={afterImgAlt} onChange={val => setAttributes({ afterImgAlt: val })} />
                </>}

                {afterImgId && getImageSizes().length !== 0 && <>
                    <Title>{__('Select After Image Size:', 'b-blocks')}</Title>
                    <SelectControl value={afterImgUrl} onChange={val => setAttributes({ afterImgUrl: val })} options={getImageSizes()} />
                </>} */}

                <Title mt='25px'></Title>
                <ToggleControl label={__('Swap Image', 'b-blocks')} checked={isSwap} onChange={val => setAttributes({ isSwap: val, beforeImgId: afterImgId, beforeImgUrl: afterImgUrl, beforeImgAlt: afterImgAlt, afterImgId: beforeImgId, afterImgUrl: beforeImgUrl, afterImgAlt: beforeImgAlt })} />

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <BtnGroup options={sizeTypes} myValue={imgWidthType} setState={(cng, def) => setAttributes({ imgWidthType: cng, imgWidth: def })} classes="bBlocksSizeType" size="small" />
                <RangeControl value={imgWidth} onChange={cng => setAttributes({ imgWidth: cng })} min={0} max={("%" == imgWidthType) ? 100 : 1920} step={1} />
            </PanelBody>

            <PanelBody title={__('Labels Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isLabel ? 'Hide Labels' : 'Show Labels'} checked={isLabel} onChange={val => setAttributes({ isLabel: val })} />

                {isLabel && <>
                    {/* Font Size */}
                    <Title>{__('Font Size:', 'b-blocks')}</Title>
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={labelFontSize} onChange={val => setAttributes({ labelFontSize: 'undefined' === typeof val ? 15 : val })} />

                    {/* Color */}
                    <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={labelColor} onChange={val => setAttributes({ labelColor: val })} defaultColor='#fff' />

                    {/* Background Color */}
                    <BColor className='mt-20p mb-5p' label={__('Background Color:', 'b-blocks')} value={labelBGColor} onChange={val => setAttributes({ labelBGColor: val })} defaultColor='#00000080' />

                    {/* Padding Top Bottom */}
                    <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                    <RangeControl value={labelPTB} onChange={val => setAttributes({ labelPTB: val })} min={0} max={100} step={1} />

                    {/* Padding Left Right */}
                    <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                    <RangeControl value={labelPLR} onChange={val => setAttributes({ labelPLR: val })} min={0} max={100} step={1} />
                </>}
            </PanelBody>

            <PanelBody title={__('Caption Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isCap ? 'Hide Caption' : 'Show Caption'} checked={isCap} onChange={val => setAttributes({ isCap: val })} />

                {isCap && <>
                    {/* Font Size */}
                    <Title>{__('Font Size:', 'b-blocks')}</Title>
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={14} value={capFontSize} onChange={val => setAttributes({ capFontSize: 'undefined' === typeof val ? 14 : val })} />

                    {/* Color */}
                    <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={capColor} onChange={val => setAttributes({ capColor: val })} defaultColor='#333' />

                    {/* Background Color */}
                    <BColor className='mt-20p mb-5p' label={__('Background Color:', 'b-blocks')} value={capBGColor} onChange={val => setAttributes({ capBGColor: val })} defaultColor='#f4f4f4' />

                    {/* Padding Top Bottom */}
                    <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                    <RangeControl value={capPTB} onChange={val => setAttributes({ capPTB: val })} min={0} max={100} step={1} />

                    {/* Padding Left Right */}
                    <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                    <RangeControl value={capPLR} onChange={val => setAttributes({ capPLR: val })} min={0} max={100} step={1} />
                </>}
            </PanelBody>

            <PanelBody title={__('Border Settings', 'b-blocks')} initialOpen={false}>
                {/* Width */}
                <Title mt='0'>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={borderWidth} onChange={val => setAttributes({ borderWidth: val })} min={0} max={30} step={1} />

                {/* Style */}
                <Title>{__('Style:', 'b-blocks')}</Title>
                <SelectControl value={borderStyle} onChange={val => setAttributes({ borderStyle: val })} options={borderStyles} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={borderColor} onChange={val => setAttributes({ borderColor: val })} defaultColor='#00000000' />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            {beforeImgUrl && <ToolbarGroup>
                {beforeImgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={beforeImgId} onSelect={onSelectBeforeImg} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit Before Image', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </ToolbarGroup>}

            {afterImgUrl && <ToolbarGroup>
                {afterImgId && <MediaUploadCheck>
                    <MediaUpload allowedTypes={['image']} value={afterImgId} onSelect={onSelectAfterImg} render={({ open }) => {
                        return <Button className='components-icon-button components-toolbar__control' label={__('Edit After Image', 'b-blocks')} icon='edit' onClick={open} />
                    }} />
                </MediaUploadCheck>}
            </ToolbarGroup>}

            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>


        <div className={`${className} text-${contentAlign}`} id={`bBlocksImageComparison-${clientId}`}>
            <div className={`comparison-slider-wrapper ${'%' === imgWidthType ? `w-${imgWidth}-per` : `w-${imgWidth}-px`}`} style={sliderWrapperStyles}>

                {beforeImgUrl && afterImgUrl ? <div className='comparison-slider'>
                    {isLabel && <RichText className={`overlay afterLabel fontSize-${labelFontSize} ptb-${labelPTB} plr-${labelPLR}`} tagName='div' value={afterLabel} style={labelStyles} onChange={val => setAttributes({ afterLabel: val })} placeholder={__('After image label', 'b-blocks')} />}

                    <img className='afterImg' src={afterImgUrl} alt={afterImgAlt} />

                    <div className='resize'>
                        {isLabel && <RichText className={`overlay beforeLabel fontSize-${labelFontSize} ptb-${labelPTB} plr-${labelPLR}`} tagName='div' value={beforeLabel} style={labelStyles} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__('Before image label', 'b-blocks')} />}

                        <img className='beforeImg' src={beforeImgUrl} alt={beforeImgAlt} />
                    </div>

                    <div className='divider'></div>
                </div> :

                    <div className='imgPlaceholder'>
                        <div className='beforeImg'>
                            {beforeImgUrl ? <>
                                <img src={beforeImgUrl} alt={beforeImgAlt} />
                                {isBlobURL(beforeImgUrl) && <Spinner />}
                            </> :
                                <MediaPlaceholder labels={{ title: __(' Before Image', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectBeforeImg} onSelectURL={val => setAttributes({ beforeImgId: null, beforeImgUrl: val, beforeImgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
                            }
                        </div>

                        <div className='afterImg'>
                            {afterImgUrl ? <>
                                <img src={afterImgUrl} alt={afterImgAlt} />
                                {isBlobURL(afterImgUrl) && <Spinner />}
                            </> :
                                <MediaPlaceholder labels={{ title: __(' After Image', 'b-blocks') }} icon='format-image' allowedTypes={['image']} accept='image/*' onSelect={onSelectAfterImg} onSelectURL={val => setAttributes({ afterImgId: null, afterImgUrl: val, afterImgAlt: '' })} onError={val => noticeOperations.createErrorNotice(val)} notices={noticeUI} />
                            }
                        </div>
                    </div>}

                {isCap && <RichText className={`caption fontSize-${capFontSize} ptb-${capPTB} plr-${capPLR}`} tagName='div' value={cap} style={captionStyles} onChange={val => setAttributes({ cap: val })} placeholder={__('Caption of the image comparison', 'b-blocks')} />}
            </div>
        </div>
    </>;
};
export default withSelect((select, props) => {
    const { imgId } = props.attributes;

    return {
        image: imgId ? select('core').getMedia(imgId) : null,
        imageSizes: select('core/block-editor').getSettings().imageSizes
    }
})(withNotices(Edit));