import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { Spinner } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

import Settings from './settings';

// Variables
import { ImagePlaceholder } from '../../../../Components/ImageControl';

const Edit = props => {
    const { className, attributes: { alignment, width, border, beforeImg, afterImg, isLabel, beforeLabel, afterLabel, labelTypo, labelColors, labelPadding, isCap, cap, capTypo, capColors, capPadding }, setAttributes, clientId } = props;

    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

    // useEffect(() => {
    //     const comparisonSlider = document.querySelector(`#bBlocksImageComparison-${clientId} .comparison-slider`);
    //     const beforeImg = document.querySelector(`#bBlocksImageComparison-${clientId} .comparison-slider .beforeImg`);

    //     if (beforeImg && comparisonSlider) {
    //         beforeImg.style.width = comparisonSlider.clientWidth;
    //         beforeImg.style.minWidth = comparisonSlider.clientWidth;
    //     }
    // }, [width]);

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

    return <>
        <Settings settings={props} />

        <div className={className} id={`bBlocksImageComparison-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${labelTypo?.googleFontLink});
                @import url(${capTypo?.googleFontLink});

                #bBlocksImageComparison-${clientId}{
                    text-align: ${alignment};
                }
                #bBlocksImageComparison-${clientId} .bBlocksImageComparison{
                    width: ${width};
                    ${border?.styles};
                }

                #bBlocksImageComparison-${clientId} .bBlocksImageComparison .overlay{
                    ${labelTypo?.styles || 'font-size: 15px;'}
                    ${labelColors?.styles || 'color: #fff; background: #00000080;'}
                    padding: ${labelPadding?.styles || '10px 15px'};
                }
                #bBlocksImageComparison-${clientId} .bBlocksImageComparison .caption{
                    ${capTypo?.styles || 'font-size: 14px;'}
                    ${capColors?.styles || 'color: #333; background: #f4f4f4;'}
                    padding: ${capPadding?.styles || '10px 15px'};
                }
            `}} />

            <div className='bBlocksImageComparison'>
                {beforeImg?.url && afterImg?.url ? <div className='comparison-slider'>
                    {isLabel && <RichText className={`overlay afterLabel`} tagName='div' value={afterLabel} onChange={val => setAttributes({ afterLabel: val })} placeholder={__('After image label', 'b-blocks')} inlineToolbar />}

                    <img className='afterImg' src={afterImg?.url} alt={afterImg?.alt} />

                    <div className='resize'>
                        {isLabel && <RichText className={`overlay beforeLabel`} tagName='div' value={beforeLabel} onChange={val => setAttributes({ beforeLabel: val })} placeholder={__('Before image label', 'b-blocks')} inlineToolbar />}

                        <img className='beforeImg' src={beforeImg?.url} alt={beforeImg?.alt} />
                    </div>

                    <div className='divider'></div>
                </div> :

                    <div className='imgPlaceholder'>
                        <div className='beforeImg'>
                            {beforeImg?.url ? <>
                                <img src={beforeImg?.url} alt={beforeImg?.alt} />
                                {isBlobURL(beforeImg?.url) && <Spinner />}
                            </> :
                                <ImagePlaceholder label={__(' Before Image:', 'b-blocks')} img={beforeImg} onChange={val => setAttributes({ beforeImg: val })} />
                            }
                        </div>

                        <div className='afterImg'>
                            {afterImg?.url ? <>
                                <img src={afterImg?.url} alt={afterImg?.alt} />
                                {isBlobURL(afterImg?.url) && <Spinner />}
                            </> :
                                <ImagePlaceholder label={__(' After Image:', 'b-blocks')} img={afterImg} onChange={val => setAttributes({ afterImg: val })} />
                            }
                        </div>
                    </div>}

                {isCap && <RichText className='caption' tagName='div' value={cap} onChange={val => setAttributes({ cap: val })} placeholder={__('Caption of the image comparison', 'b-blocks')} inlineToolbar />}
            </div>
        </div>
    </>;
};
export default Edit;