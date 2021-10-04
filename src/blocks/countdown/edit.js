import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl, __experimentalUnitControl as UnitControl, DateTimePicker, SelectControl, PanelRow, TabPanel, RangeControl } from '@wordpress/components';

// Variables
import Title from '../../Components/Title';
import BColor from '../../Components/BColor';
import Background from '../../Components/Background';
import SpaceControl from '../../Components/SpaceControl';
import BorderControl from '../../Components/BorderControl';
import ShadowControl from '../../Components/ShadowControl';
import Typography from '../../Components/Typography';
import options from '../../Const/options';
const { generalStyleTabs, flexPos, pxUnit, perUnit, emUnit, remUnit } = options;
const layouts = [
    { label: 'Default', value: 'default' },
    { label: 'Layout 1', value: 'layout1' },
    { label: 'Layout 2', value: 'layout2' },
    { label: 'Layout 3', value: 'layout3' },
];
const sepTypes = [
    { label: 'Dotted', value: ':' },
    { label: 'Dashed', value: '-' },
    { label: 'Solid', value: '|' },
];

const Edit = props => {
    const { className, attributes: { destDate, layout, boxIsInline, boxPosition, isLabels, isDays, daysLabel, isHours, hoursLabel, isMinutes, minutesLabel, isSeconds, secondsLabel, width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, isSep, sepType, sepSize, sepColor }, setAttributes, clientId } = props;

    // Functions
    const parseEmtStr = (val, def) => undefined === val ? def : val;

    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

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


        const countdownDays = document.querySelector(`#bBlocksCountdown-${clientId} .countdownDays .digit`);
        countdownDays ? countdownDays.innerHTML = (1 === days.toString().length ? ('0' + days).slice(-2) : days) : null;

        const countdownHours = document.querySelector(`#bBlocksCountdown-${clientId} .countdownHours .digit`);
        countdownHours ? countdownHours.innerHTML = ('0' + hours).slice(-2) : null;

        const countdownMinutes = document.querySelector(`#bBlocksCountdown-${clientId} .countdownMinutes .digit`);
        countdownMinutes ? countdownMinutes.innerHTML = ('0' + minutes).slice(-2) : null;

        const countdownSeconds = document.querySelector(`#bBlocksCountdown-${clientId} .countdownSeconds .digit`);
        countdownSeconds ? countdownSeconds.innerHTML = ('0' + seconds).slice(-2) : null;
    }, [dest, seconds]);


    // Classes
    const boxClass = `${boxIsInline ? 'inline' : ''}`;
    const sepClass = `${isSep ? 'separator' : ''}`;

    return <>
        <InspectorControls>
            <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
                {'general' == tab.name && <>
                    <PanelBody className='bBlocksPanelBody' title={__('Countdown Settings', 'b-blocks')}>
                        <Title mt='0'>{__('Destination Date:', 'b-blocks')}</Title>
                        <DateTimePicker currentDate={destDate} onChange={val => setAttributes({ destDate: val })} is12Hour={true} />
                    </PanelBody>


                    <PanelBody className='bBlocksPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Layout:', 'b-blocks')}</Title>
                            <SelectControl value={layout} onChange={val => {
                                setAttributes({ layout: val });
                                'default' === val && setAttributes({
                                    boxIsInline: false,
                                    background: { type: 'solid', color: '#0000', styles: '' },
                                    shadow: { hOffset: '0px', vOffset: '0px', color: '#0000', styles: 'none' },
                                    boxBG: { type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)', styles: 'background-image: linear-gradient(135deg, #4527a4, #8344c5);' },
                                    boxSpace: '30px',
                                    boxBorder: { width: '0px', type: 'solid', color: '#0000', radius: '5%', styles: 'border-radius: 5%;' },
                                    digitColor: '#fff',
                                    labelColor: '#fff',
                                    isSep: false,
                                    sepColor: '#4527a4'
                                });
                                'layout1' === val && setAttributes({
                                    boxIsInline: false,
                                    background: { type: 'gradient', gradient: 'linear-gradient(180deg, #4527a4, #8344c5)', styles: 'background-image: linear-gradient(180deg, #4527a4, #8344c5);' },
                                    shadow: { hOffset: '5px', vOffset: '5px', color: '#4527a4', styles: '5px 5px 0px 0px #4527a4' },
                                    boxBG: { type: 'solid', color: '#0000', styles: 'background-color: #0000;' },
                                    boxSpace: '0px',
                                    boxBorder: { width: '0px', type: 'solid', color: '#0000', radius: '5%', styles: 'border-radius: 5%;' },
                                    digitColor: '#fff',
                                    labelColor: '#fff',
                                    isSep: true,
                                    sepColor: '#fff'
                                });
                                'layout2' === val && setAttributes({
                                    boxIsInline: false,
                                    background: { type: 'solid', color: '#0000', styles: '' },
                                    shadow: { hOffset: '0px', vOffset: '0px', color: '#0000', styles: 'none' },
                                    boxBG: { type: 'solid', color: '#0000', styles: 'background-color: #0000;' },
                                    boxSpace: '30px',
                                    boxBorder: { width: '2px', type: 'solid', color: '#4527a4', radius: '5%', styles: 'border-top: 2px solid #4527a4; border-right: 2px solid #4527a4; border-bottom: 2px solid #4527a4; border-left: 2px solid #4527a4; border-radius: 5%;' },
                                    digitColor: '#4527a4',
                                    labelColor: '#4527a4',
                                    isSep: true,
                                    sepColor: '#4527a4'
                                });
                                'layout3' === val && setAttributes({
                                    boxIsInline: true,
                                    background: { type: 'solid', color: '#0000', styles: '' },
                                    shadow: { hOffset: '0px', vOffset: '8px', blur: '15px', color: '#4527a4', styles: '0px 8px 15px 0px #4527a4' },
                                    boxBG: { type: 'solid', color: '#0000', styles: 'background-color: #0000;' },
                                    boxSpace: '30px',
                                    boxBorder: { width: '0px', type: 'solid', color: '#0000', radius: '5%', styles: 'border-radius: 5%;' },
                                    digitColor: '#4527a4',
                                    labelColor: '#4527a4',
                                    isSep: true,
                                    sepColor: '#4527a4'
                                });
                            }} options={layouts} />
                        </PanelRow>

                        {/* Box */}
                        <ToggleControl className='mt-20p' label='Box Inline?' checked={boxIsInline} onChange={val => setAttributes({ boxIsInline: val })} />

                        {/* Labels */}
                        <ToggleControl className='mt-20p' label={__('Show Labels', 'b-blocks')} checked={isLabels} onChange={val => setAttributes({ isLabels: val })} />

                        {/* Days */}
                        <ToggleControl className='mt-20p' label={__('Show Days', 'b-blocks')} checked={isDays} onChange={val => setAttributes({ isDays: val })} />

                        {isLabels && isDays && <PanelRow>
                            <Title mt='0' mb='0'>{__('Days Label:', 'b-blocks')}</Title>
                            <TextControl value={daysLabel} onChange={val => setAttributes({ daysLabel: val })} />
                        </PanelRow>}

                        {/* Hours */}
                        <ToggleControl className='mt-20p' label={__('Show Hours', 'b-blocks')} checked={isHours} onChange={val => setAttributes({ isHours: val })} />

                        {isLabels && isHours && <PanelRow>
                            <Title mt='0' mb='0'>{__('Hours Label:', 'b-blocks')}</Title>
                            <TextControl value={hoursLabel} onChange={val => setAttributes({ hoursLabel: val })} />
                        </PanelRow>}

                        {/* Minutes */}
                        <ToggleControl className='mt-20p' label={__('Show Minutes', 'b-blocks')} checked={isMinutes} onChange={val => setAttributes({ isMinutes: val })} />

                        {isLabels && isMinutes && <PanelRow>
                            <Title mt='0' mb='0'>{__('Minutes Label:', 'b-blocks')}</Title>
                            <TextControl value={minutesLabel} onChange={val => setAttributes({ minutesLabel: val })} />
                        </PanelRow>}

                        {/* Seconds */}
                        <ToggleControl className='mt-20p' label={__('Show Seconds', 'b-blocks')} checked={isSeconds} onChange={val => setAttributes({ isSeconds: val })} />

                        {isLabels && isSeconds && <PanelRow>
                            <Title mt='0' mb='0'>{__('Seconds Label:', 'b-blocks')}</Title>
                            <TextControl value={secondsLabel} onChange={val => setAttributes({ secondsLabel: val })} />
                        </PanelRow>}
                    </PanelBody>
                </>}

                {'style' == tab.name && <>
                    <PanelBody className='bBlocksPanelBody' title={__('Countdown Style', 'b-blocks')}>
                        <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit, perUnit, emUnit]} />
                        <small>{__('Keep width 0, to auto width.', 'b-blocks')}</small>

                        <Background className='mt-20p' label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} />

                        <SpaceControl className='mt-20p' label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ side: 2, vertical: '10px', horizontal: '15px' }} />

                        <ShadowControl label={__('Shadow:', 'b-blocks')} shadow={shadow} onChange={val => setAttributes({ shadow: val })} />
                    </PanelBody>

                    <PanelBody className='bBlocksPanelBody' title={__('Boxes Style', 'b-blocks')} initialOpen={false}>
                        {'0px' === width || '0%' === width || '0em' === width ? '' : <PanelRow>
                            <Title mt='0' mb='0'>{__('Box Position:', 'b-blocks')}</Title>
                            <SelectControl value={boxPosition} onChange={val => setAttributes({ boxPosition: val })} options={flexPos} />
                        </PanelRow>}

                        {/* Background */}
                        <Background className='mt-20p' label={__('Background:', 'b-blocks')} background={boxBG} onChange={val => setAttributes({ boxBG: val })} defaults={{ type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }} />

                        {/* Width */}
                        <UnitControl className='mt-20p' label={__('Width:', 'b-blocks')} labelPosition='left' value={boxWidth} onChange={val => setAttributes({ boxWidth: val })} units={[pxUnit, emUnit, remUnit]} />

                        {/* Height */}
                        <UnitControl className='mt-20p' label={__('Height:', 'b-blocks')} labelPosition='left' value={boxHeight} onChange={val => setAttributes({ boxHeight: val })} units={[pxUnit, emUnit, remUnit]} />

                        {/* Space Between Boxes */}
                        <UnitControl className='mt-20p' label={__('Space Between Boxes:', 'b-blocks')} labelPosition='left' value={boxSpace} onChange={val => setAttributes({ boxSpace: val })} units={[pxUnit, emUnit, remUnit]} />

                        <BorderControl label={__('Border', 'b-blocks')} border={boxBorder} onChange={val => setAttributes({ boxBorder: val })} defaults={{ radius: '5%' }} />

                        <ShadowControl label={__('Shadow:', 'b-blocks')} shadow={boxShadow} onChange={val => setAttributes({ boxShadow: val })} />
                    </PanelBody>


                    {isDays || isHours || isMinutes || isSeconds ? <PanelBody className='bBlocksPanelBody' title={__('Content Style', 'b-blocks')} initialOpen={false}>
                        {/* Digit Typography */}
                        <Typography label={__('Digit Typography:', 'b-blocks')} typography={digitTypo} onChange={val => setAttributes({ digitTypo: val })} defaults={{ fontSize: 48 }} />

                        {/* Digit Color */}
                        <BColor className='mt-20p' label={__('Digit Color:', 'b-blocks')} value={digitColor} onChange={val => setAttributes({ digitColor: val })} defaultColor='#fff' />

                        {isLabels && <>
                            {/* Label Typography */}
                            <Typography className='mt-20p' label={__('Label Typography:', 'b-blocks')} typography={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: 18 }} />

                            {/* Label Color */}
                            <BColor className='mt-20p' label={__('Label Color:', 'b-blocks')} value={labelColor} onChange={val => setAttributes({ labelColor: val })} defaultColor='#fff' />
                        </>}
                    </PanelBody> : null}


                    <PanelBody className='bBlocksPanelBody' title={__('Separator', 'b-blocks')} initialOpen={false}>
                        <ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                        {isSep && <>
                            <PanelRow className='mt-20p'>
                                <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                                <SelectControl value={sepType} onChange={val => setAttributes({ sepType: val })} options={sepTypes} />
                            </PanelRow>

                            <Title>{__('Size:', 'b-blocks')}</Title>
                            <RangeControl value={sepSize} onChange={val => setAttributes({ sepSize: val })} min={0} max={160} step={1} allowReset={true} resetFallbackValue={48} initialPosition={48} />

                            <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={sepColor} onChange={val => setAttributes({ sepColor: val })} defaultColor='#4527a4' />
                        </>}
                    </PanelBody>
                </>}
            </>}</TabPanel>
        </InspectorControls>

        <BlockControls>
            <AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} alignmentControls={[
                { title: __('Align left', 'b-blocks'), align: 'flex-start', icon: 'editor-alignleft' },
                { title: __('Align center', 'b-blocks'), align: 'center', icon: 'editor-aligncenter' },
                { title: __('Align right', 'b-blocks'), align: 'flex-end', icon: 'editor-alignright' }
            ]} />
        </BlockControls>


        <div className={className} id={`bBlocksCountdown-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${digitTypo?.googleFontLink || ''});
                @import url(${labelTypo?.googleFontLink || ''});

                #bBlocksCountdown-${clientId}{
                    align-items: ${alignment};
                    justify-content: ${alignment};
                }
                #bBlocksCountdown-${clientId} .countdownItems{
                    width: ${'0px' === width || '0%' === width || '0em' === width ? 'auto' : width};
                    ${background?.styles || ''}
                    padding: ${padding?.styles || '10px 15px'};
                    box-shadow: ${shadow?.styles || 'none'};
                    justify-content: ${boxPosition};
                }
                #bBlocksCountdown-${clientId} .countdownItems .countdownItem{
                    ${boxBG?.styles || `background-image: linear-gradient(135deg, #4527a4, #8344c5);`}
                    width: ${boxWidth};
                    height: ${boxHeight};
                    margin-left: calc(${boxSpace} / 2);
                    margin-right: calc(${boxSpace} / 2);
                    ${parseEmtStr(boxBorder?.styles, 'border-radius: 5%;')}
                    box-shadow: ${boxShadow?.styles || 'none'};
                }
                #bBlocksCountdown-${clientId} .countdownItems .countdownItem.separator::before{
                    content: '${sepType}';
                    font-size: ${sepSize}px;
                    color: ${sepColor};
                    left: calc(-${boxSpace} / 2);
                }
                #bBlocksCountdown-${clientId} .countdownItems .countdownItem .digit{
                    color: ${digitColor};
                    ${parseEmtStr(digitTypo?.styles, 'font-size: 48px;')}
                }
                #bBlocksCountdown-${clientId} .countdownItems .countdownItem .label{
                    color: ${labelColor};
                    ${parseEmtStr(labelTypo?.styles, 'font-size: 18px;')}
                }
            `}} />

            <div className='countdownItems'>
                <Box is={isDays} boxClass={`countdownDays ${boxClass}`} isLabels={isLabels} label={daysLabel} />

                <Box is={isHours} boxClass={`countdownHours ${boxClass} ${sepClass}`} isLabels={isLabels} label={hoursLabel} />

                <Box is={isMinutes} boxClass={`countdownMinutes ${boxClass} ${sepClass}`} isLabels={isLabels} label={minutesLabel} />

                <Box is={isSeconds} boxClass={`countdownSeconds ${boxClass} ${sepClass}`} isLabels={isLabels} label={secondsLabel} />
            </div>
        </div>
    </>;
};
export default Edit;

// Box Component
const Box = props => {
    const { is, boxClass, isLabels, label } = props

    return is && <div className={`countdownItem ${boxClass}`}>
        <span className='digit'>00</span>
        {isLabels && <span className='label'>{label}</span>}
    </div>;
};

// Fixing need
// use useRef
// separator position