import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls, MediaUpload, RichText } from '@wordpress/block-editor';
import { Button, ButtonGroup, FontSizePicker, PanelBody, PanelRow, RangeControl, SelectControl, TabPanel, TextControl, ToggleControl, Tooltip } from '@wordpress/components';

// Variables
import Title from '../../GutenComp/Title';
import BtnGroup from '../../GutenComp/BtnGroup';
import BColor from '../../GutenComp/BColor';
import options from '../../Const/options';
const { fontSizes, sizeTypes, borderStyles } = options;

const Edit = props => {
    const { className, attributes: { isLabel, beforeLabel, afterLabel, labelFontSize, labelColor, labelBGColor, labelPTB, labelPLR, isCap, cap, capFontSize, capColor, capBGColor, capPTB, capPLR, borderWidth, borderStyle, borderColor, borderRadius, radiusType }, setAttributes } = props;

    (function ($) {
        $(document).ready(function () {
            // If the comparison slider is present on the page lets initialise it, this is good you will include this in the main js to prevent the code from running when not needed
            if ($('.comparison-slider')[0]) {
                let compSlider = $('.comparison-slider');

                //let's loop through the sliders and initialise each of them
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
            // This creates a variable that detects if the user is using touch input insted of the mouse.
            let touched = false;
            window.addEventListener('touchstart', function () {
                touched = true;
            });
            window.addEventListener('touchend', function () {
                touched = false;
            });

            // clicp the image and move the slider on interaction with the mouse or the touch input
            dragElement.on('mousedown touchstart', function (e) {
                //add classes to the emelents - good for css animations if you need it to
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

                //add event listner on the divider emelent
                dragElement.parents().on('mousemove touchmove', function (e) {
                    // if the user is not using touch input let do preventDefault to prevent the user from slecting the images as he moves the silder arround.
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
                // stop clicping the image and move the slider
                dragElement.removeClass('draggable');
                resizeElement.removeClass('resizable');

            });
        }
    })(jQuery);


    // Styles
    const sliderWrapperStyles = { border: `${borderWidth}px ${borderStyle} ${borderColor}`, borderRadius: `${borderRadius}${radiusType}` };

    const labelStyles = { color: labelColor, backgroundColor: labelBGColor };

    const captionStyles = { color: capColor, backgroundColor: capBGColor };

    return <>
        <InspectorControls>
            <PanelBody title={__('Labels Settings', 'b-blocks')}>
                <ToggleControl label={isLabel ? 'Hide Labels' : 'Show Labels'} checked={isLabel} onChange={val => setAttributes({ isLabel: val })} />

                {isLabel && <>
                    {/* Font Size */}
                    <Title>{__('Font Size:', 'b-blocks')}</Title>
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={labelFontSize} onChange={val => setAttributes({ labelFontSize: 'undefined' === typeof val ? 15 : val })} />

                    {/* Color */}
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                        <BColor value={labelColor} onChange={val => setAttributes({ labelColor: val })} defaultColor='#fff' />
                    </PanelRow>

                    {/* Background Color */}
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                        <BColor value={labelBGColor} onChange={val => setAttributes({ labelBGColor: val })} defaultColor='#00000080' />
                    </PanelRow>

                    {/* Padding Top Bottom */}
                    <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                    <RangeControl value={labelPTB} onChange={val => setAttributes({ labelPTB: val })} min={0} max={100} step={1} />

                    {/* Padding Left Right */}
                    <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                    <RangeControl value={labelPLR} onChange={val => setAttributes({ labelPLR: val })} min={0} max={100} step={1} />
                </>}
            </PanelBody>

            <PanelBody title={__('Caption Settings', 'b-blocks')}>
                <ToggleControl label={isCap ? 'Hide Caption' : 'Show Caption'} checked={isCap} onChange={val => setAttributes({ isCap: val })} />

                {isCap && <>
                    {/* Font Size */}
                    <Title>{__('Font Size:', 'b-blocks')}</Title>
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={14} value={capFontSize} onChange={val => setAttributes({ capFontSize: 'undefined' === typeof val ? 14 : val })} />

                    {/* Color */}
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('Color:', 'b-blocks')}</Title>
                        <BColor value={capColor} onChange={val => setAttributes({ capColor: val })} defaultColor='#333' />
                    </PanelRow>

                    {/* Background Color */}
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('Background Color:', 'b-blocks')}</Title>
                        <BColor value={capBGColor} onChange={val => setAttributes({ capBGColor: val })} defaultColor='#f4f4f4' />
                    </PanelRow>

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
                <RangeControl value={borderWidth} onChange={val => setAttributes({ borderWidth: val })} min={0} max={20} step={.1} />

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
                <BtnGroup options={sizeTypes} myValue={radiusType} setState={val => setAttributes({ radiusType: val })} classes='b_blocks_size_type' size='small' />
                <RangeControl value={borderRadius} onChange={val => setAttributes({ borderRadius: val })} min={0} max={50} step={1} />
            </PanelBody>
        </InspectorControls>


        <div className={className}>
            <div className='comparison-slider-wrapper' style={sliderWrapperStyles}>

                <div className='comparison-slider'>
                    {isLabel && <RichText className={`overlay afterLabel fontSize-${labelFontSize} ptb-${labelPTB} plr-${labelPLR}`} tagName='div' value={afterLabel} style={labelStyles} onChange={val => setAttributes({ afterLabel: val })} placeholder={__('After image label', 'b-blocks')} />}

                    <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/751678/marioPhoto-2.jpg' alt='marioPhoto 2' />

                    <div className='resize'>
                        {isLabel && <RichText className={`overlay beforeLabel fontSize-${labelFontSize} ptb-${labelPTB} plr-${labelPLR}`} tagName='div' value={beforeLabel} style={labelStyles} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__('Before image label', 'b-blocks')} />}

                        <img src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/751678/marioPhoto-1.jpg' alt='marioPhoto 1' />
                    </div>

                    <div className='divider'></div>
                </div>

                {isCap && <RichText className={`caption fontSize-${capFontSize} ptb-${capPTB} plr-${capPLR}`} tagName='div' value={cap} style={captionStyles} onChange={val => setAttributes({ cap: val })} placeholder={__('Caption of the image comparison', 'b-blocks')} />}
            </div>
        </div>
    </>;
};
export default Edit;