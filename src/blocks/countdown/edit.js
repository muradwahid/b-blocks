import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, DateTimePicker, RangeControl, SelectControl, PanelRow, ToggleControl, TextControl, FontSizePicker } from '@wordpress/components';

import Box from './box';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import options from '../../Const/options';
const { aligns, fontSizes, borderStyles, sizeTypes } = options;
const flexPos = [
    { label: 'Start', value: 'flex-start' },
    { label: 'End', value: 'flex-end' },
    { label: 'Center', value: 'center' },
    { label: 'Space Around', value: 'space-around' },
    { label: 'Space Between', value: 'space-between' },
    { label: 'Space Evenly', value: 'space-evenly' },
]

const Edit = props => {
    const { className, attributes: { cId, destDate, isDays, daysLabel, isHours, hoursLabel, isMinutes, minutesLabel, isSeconds, secondsLabel, digitFontSize, digitColor, isLabels, labelFontSize, labelColor, itemInline, itemPos, itemTextAlign, itemWidth, itemHeight, itemPTB, itemPLR, itemSpace, itemBGColor, borderWidth, borderStyle, borderColor, borderRadius, radiusType, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpreed }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const dest = new Date(destDate).getTime(); // Convert Destination Date in time (milliseconds)
    useEffect(() => {
        const now = new Date().getTime(); // Convert Current Date in time (milliseconds)
        const diff = dest > now ? (dest - now) / 1000 : 0; // Different time in seconds

        const days = Math.floor(diff / (24 * 60 * 60));
        const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diff % (60 * 60)) / 60);
        const seconds = Math.floor(diff % 60);


        const countdownDays = document.querySelector(`#bBlocksCountdown-${cId} .countdownDays .holder`);
        countdownDays ? countdownDays.innerHTML = days : null;

        const countdownHours = document.querySelector(`#bBlocksCountdown-${cId} .countdownHours .holder`);
        countdownHours ? countdownHours.innerHTML = hours : null;

        const countdownMinutes = document.querySelector(`#bBlocksCountdown-${cId} .countdownMinutes .holder`);
        countdownMinutes ? countdownMinutes.innerHTML = minutes : null;

        const countdownSeconds = document.querySelector(`#bBlocksCountdown-${cId} .countdownSeconds .holder`);
        countdownSeconds ? countdownSeconds.innerHTML = seconds : null;
    }, [dest, seconds]);


    // Styles
    const boxStyles = { width: `${itemWidth}px`, height: `${itemHeight}px`, backgroundColor: itemBGColor, border: `${borderWidth}px ${borderStyle} ${borderColor}`, boxShadow: `${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px ${shadowSpreed}px` };

    const boxClasses = `countdownItem ${itemInline ? 'inline' : ''} text-${itemTextAlign} ptb-${itemPTB} plr-${itemPLR} mx-${Math.floor(itemSpace / 2)} mmy-${Math.floor(itemSpace / 2)} radius-${borderRadius}-${'%' === radiusType ? 'per' : radiusType}`;

    const digitStyles = { color: digitColor };
    const digitClasses = `holder fontSize-${digitFontSize}`;

    const labelStyles = { color: labelColor };
    const labelClasses = `label fontSize-${labelFontSize}`;

    return <>
        <InspectorControls>
            <PanelBody title={__('Timer Settings', 'b-blocks')}>
                <Title mt='0'>{__('Destination Date:', 'b-blocks')}</Title>
                <DateTimePicker currentDate={destDate} onChange={val => setAttributes({ destDate: val })} is12Hour={true} />
            </PanelBody>

            <PanelBody title={__('Elements Settings', 'b-blocks')} initialOpen={false}>
                {/* Labels */}
                <ToggleControl label={isLabels ? 'Hide Labels' : 'Show Labels'} checked={isLabels} onChange={val => setAttributes({ isLabels: val })} />

                {/* Days */}
                <ToggleControl className='mt-20p' label={isDays ? 'Hide Days' : 'Show Days'} checked={isDays} onChange={val => setAttributes({ isDays: val })} />

                {isLabels && isDays && <>
                    <Title mt='0'>{__('Days Label:', 'b-blocks')}</Title>
                    <TextControl value={daysLabel} onChange={val => setAttributes({ daysLabel: val })} />
                </>}

                {/* Hours */}
                <ToggleControl className='mt-20p' label={isHours ? 'Hide Hours' : 'Show Hours'} checked={isHours} onChange={val => setAttributes({ isHours: val })} />

                {isLabels && isHours && <>
                    <Title mt='0'>{__('Hours Label:', 'b-blocks')}</Title>
                    <TextControl value={hoursLabel} onChange={val => setAttributes({ hoursLabel: val })} />
                </>}

                {/* Minutes */}
                <ToggleControl className='mt-20p' label={isMinutes ? 'Hide Minutes' : 'Show Minutes'} checked={isMinutes} onChange={val => setAttributes({ isMinutes: val })} />

                {isLabels && isMinutes && <>
                    <Title mt='0'>{__('Minutes Label:', 'b-blocks')}</Title>
                    <TextControl value={minutesLabel} onChange={val => setAttributes({ minutesLabel: val })} />
                </>}

                {/* Seconds */}
                <ToggleControl className='mt-20p' label={isSeconds ? 'Hide Seconds' : 'Show Seconds'} checked={isSeconds} onChange={val => setAttributes({ isSeconds: val })} />

                {isLabels && isSeconds && <>
                    <Title mt='0'>{__('Seconds Label:', 'b-blocks')}</Title>
                    <TextControl value={secondsLabel} onChange={val => setAttributes({ secondsLabel: val })} />
                </>}
            </PanelBody>

            {isDays || isHours || isMinutes || isSeconds ? <PanelBody title={__('Elements Styles', 'b-blocks')} initialOpen={false}>
                {/* Digit Font Size */}
                <Title mt='0'>{__('Digit Font Size:', 'b-blocks')}</Title>
                <FontSizePicker fontSizes={fontSizes} fallbackFontSize={48} value={digitFontSize} onChange={val => setAttributes({ digitFontSize: 'undefined' === typeof val ? 48 : val })} />

                {/* Digit Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Digit Color:', 'b-blocks')}</Title>
                    <BColor value={digitColor} onChange={val => setAttributes({ digitColor: val })} defaultColor='#fff' />
                </PanelRow>

                {isLabels && <>
                    {/* Label Font Size */}
                    <Title>{__('Label Font Size:', 'b-blocks')}</Title>
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={14} value={labelFontSize} onChange={val => setAttributes({ labelFontSize: 'undefined' === typeof val ? 14 : val })} />

                    {/* Label Color */}
                    <PanelRow className='mt-20p mb-5p'>
                        <Title mt='5px'>{__('Label Color:', 'b-blocks')}</Title>
                        <BColor value={labelColor} onChange={val => setAttributes({ labelColor: val })} defaultColor='#fff' />
                    </PanelRow>
                </>}
            </PanelBody> : null}

            <PanelBody title={__('Box Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label='Box Inline' checked={itemInline} onChange={val => setAttributes({ itemInline: val })} />

                {/* Position */}
                <Title>{__('Position:', 'b-blocks')}</Title>
                <SelectControl value={itemPos} onChange={cng => setAttributes({ itemPos: cng })} options={flexPos} />

                {/* Text Align */}
                <Title>{__('Text Align:', 'b-blocks')}</Title>
                <BtnGroup options={aligns} myValue={itemTextAlign} setState={cng => setAttributes({ itemTextAlign: cng })} icon={true} />

                {/* Width */}
                <Title>{__('Width:', 'b-blocks')}</Title>
                <RangeControl value={itemWidth} onChange={val => setAttributes({ itemWidth: val })} min={0} max={500} step={1} />

                {/* Height */}
                <Title>{__('Height:', 'b-blocks')}</Title>
                <RangeControl value={itemHeight} onChange={val => setAttributes({ itemHeight: val })} min={0} max={500} step={1} />

                {/* Padding Top Bottom */}
                <Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
                <RangeControl value={itemPTB} onChange={val => setAttributes({ itemPTB: val })} min={0} max={100} step={1} />

                {/* Padding Left Right */}
                <Title>{__('Padding Left Right:', 'b-blocks')}</Title>
                <RangeControl value={itemPLR} onChange={val => setAttributes({ itemPLR: val })} min={0} max={100} step={1} />

                {/* Space Between Boxes */}
                <Title>{__('Space Between Boxes:', 'b-blocks')}</Title>
                <RangeControl value={itemSpace} onChange={val => setAttributes({ itemSpace: val })} min={0} max={100} step={1} />

                {/* Box Background Color */}
                <PanelRow className='mt-20p mb-5p'>
                    <Title mt='5px'>{__('Box Background Color:', 'b-blocks')}</Title>
                    <BColor value={itemBGColor} onChange={val => setAttributes({ itemBGColor: val })} defaultColor='#4527a4' />
                </PanelRow>
            </PanelBody>

            <PanelBody title={__('Border Settings', 'b-blocks')} initialOpen={false}>
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
                <BtnGroup options={sizeTypes} myValue={radiusType} setState={val => setAttributes({ radiusType: val })} classes='b_blocks_size_type' size='small' />
                <RangeControl value={borderRadius} onChange={val => setAttributes({ borderRadius: val })} min={0} max={50} step={1} />
            </PanelBody>

            <PanelBody title={__('Shadow Settings', 'b-blocks')} initialOpen={false}>
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

                {/* Spreed */}
                <Title>{__('Spreed:', 'b-blocks')}</Title>
                <RangeControl value={shadowSpreed} onChange={val => setAttributes({ shadowSpreed: val })} min={0} max={50} step={1} />
            </PanelBody>
        </InspectorControls>


        <div className={className} id={`bBlocksCountdown-${cId}`}>
            <div className='countdownItems' style={{ justifyContent: itemPos, alignItems: itemPos }}>
                <Box is={isDays} boxClasses={`countdownDays ${boxClasses}`} boxStyles={boxStyles} digitClasses={digitClasses} digitStyles={digitStyles} isLabels={isLabels} label={daysLabel} labelClasses={labelClasses} labelStyles={labelStyles} />

                <Box is={isHours} boxClasses={`countdownHours ${boxClasses}`} boxStyles={boxStyles} digitClasses={digitClasses} digitStyles={digitStyles} isLabels={isLabels} label={hoursLabel} labelClasses={labelClasses} labelStyles={labelStyles} />

                <Box is={isMinutes} boxClasses={`countdownMinutes ${boxClasses}`} boxStyles={boxStyles} digitClasses={digitClasses} digitStyles={digitStyles} isLabels={isLabels} label={minutesLabel} labelClasses={labelClasses} labelStyles={labelStyles} />

                <Box is={isSeconds} boxClasses={`countdownSeconds ${boxClasses}`} boxStyles={boxStyles} digitClasses={digitClasses} digitStyles={digitStyles} isLabels={isLabels} label={secondsLabel} labelClasses={labelClasses} labelStyles={labelStyles} />
            </div>
        </div>
    </>;
};
export default Edit;