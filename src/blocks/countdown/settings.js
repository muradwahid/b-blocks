import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, __experimentalUnitControl as UnitControl, DateTimePicker, SelectControl, PanelRow, TabPanel, RangeControl } from '@wordpress/components';

// Variables
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import Background from '../../../../Components/Background';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';
import Typography from '../../../../Components/Typography';
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

const Settings = ({ settings }) => {
    const { attributes: { destDate, layout, boxIsInline, boxPosition, isLabels, isDays, isHours, isMinutes, isSeconds, width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, isSep, sepType, sepSize, sepColor }, setAttributes } = settings;

    return <>
        <InspectorControls>
            <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
                {'general' == tab.name && <>
                    <PanelBody className='bPlPanelBody' title={__('Countdown Settings', 'b-blocks')}>
                        <Title mt='0'>{__('Destination Date:', 'b-blocks')}</Title>
                        <DateTimePicker currentDate={destDate} onChange={val => setAttributes({ destDate: val })} is12Hour={true} />
                    </PanelBody>


                    <PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
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
                        <ToggleControl className='mt20' label='Box Inline?' checked={boxIsInline} onChange={val => setAttributes({ boxIsInline: val })} />

                        {/* Labels */}
                        <ToggleControl label={__('Show Labels', 'b-blocks')} checked={isLabels} onChange={val => setAttributes({ isLabels: val })} />

                        {/* Days */}
                        <ToggleControl label={__('Show Days', 'b-blocks')} checked={isDays} onChange={val => setAttributes({ isDays: val })} />

                        {/* Hours */}
                        <ToggleControl label={__('Show Hours', 'b-blocks')} checked={isHours} onChange={val => setAttributes({ isHours: val })} />

                        {/* Minutes */}
                        <ToggleControl label={__('Show Minutes', 'b-blocks')} checked={isMinutes} onChange={val => setAttributes({ isMinutes: val })} />

                        {/* Seconds */}
                        <ToggleControl label={__('Show Seconds', 'b-blocks')} checked={isSeconds} onChange={val => setAttributes({ isSeconds: val })} />
                    </PanelBody>
                </>}

                {'style' == tab.name && <>
                    <PanelBody className='bPlPanelBody' title={__('Countdown Style', 'b-blocks')}>
                        <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit, perUnit, emUnit]} />
                        <small>{__('Keep width 0, to auto width.', 'b-blocks')}</small>

                        <Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

                        <SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ side: 2, vertical: '10px', horizontal: '15px' }} />

                        <ShadowControl label={__('Shadow:', 'b-blocks')} shadow={shadow} onChange={val => setAttributes({ shadow: val })} />
                    </PanelBody>

                    <PanelBody className='bPlPanelBody' title={__('Boxes Style', 'b-blocks')} initialOpen={false}>
                        {'0px' === width || '0%' === width || '0em' === width ? '' : <PanelRow>
                            <Title mt='0' mb='0'>{__('Box Position:', 'b-blocks')}</Title>
                            <SelectControl value={boxPosition} onChange={val => setAttributes({ boxPosition: val })} options={flexPos} />
                        </PanelRow>}

                        {/* Background */}
                        <Background label={__('Background:', 'b-blocks')} background={boxBG} onChange={val => setAttributes({ boxBG: val })} defaults={{ type: 'gradient', color: '#4527a4', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }} />

                        {/* Width */}
                        <UnitControl className='mt20' label={__('Width:', 'b-blocks')} labelPosition='left' value={boxWidth} onChange={val => setAttributes({ boxWidth: val })} units={[pxUnit, emUnit, remUnit]} />

                        {/* Height */}
                        <UnitControl className='mt20' label={__('Height:', 'b-blocks')} labelPosition='left' value={boxHeight} onChange={val => setAttributes({ boxHeight: val })} units={[pxUnit, emUnit, remUnit]} />

                        {/* Space Between Boxes */}
                        <UnitControl className='mt20' label={__('Space Between Boxes:', 'b-blocks')} labelPosition='left' value={boxSpace} onChange={val => setAttributes({ boxSpace: val })} units={[pxUnit, emUnit, remUnit]} />

                        <BorderControl label={__('Border', 'b-blocks')} border={boxBorder} onChange={val => setAttributes({ boxBorder: val })} defaults={{ radius: '5%' }} />

                        <ShadowControl label={__('Shadow:', 'b-blocks')} shadow={boxShadow} onChange={val => setAttributes({ boxShadow: val })} />
                    </PanelBody>


                    {isDays || isHours || isMinutes || isSeconds ? <PanelBody className='bPlPanelBody' title={__('Content Style', 'b-blocks')} initialOpen={false}>
                        {/* Digit Typography */}
                        <Typography label={__('Digit Typography:', 'b-blocks')} typography={digitTypo} onChange={val => setAttributes({ digitTypo: val })} defaults={{ fontSize: 48 }} />

                        {/* Digit Color */}
                        <BColor label={__('Digit Color:', 'b-blocks')} value={digitColor} onChange={val => setAttributes({ digitColor: val })} defaultColor='#fff' />

                        {isLabels && <>
                            {/* Label Typography */}
                            <Typography label={__('Label Typography:', 'b-blocks')} typography={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: 18 }} />

                            {/* Label Color */}
                            <BColor label={__('Label Color:', 'b-blocks')} value={labelColor} onChange={val => setAttributes({ labelColor: val })} defaultColor='#fff' />
                        </>}
                    </PanelBody> : null}


                    <PanelBody className='bPlPanelBody' title={__('Separator', 'b-blocks')} initialOpen={false}>
                        <ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                        {isSep && <>
                            <PanelRow>
                                <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                                <SelectControl value={sepType} onChange={val => setAttributes({ sepType: val })} options={sepTypes} />
                            </PanelRow>

                            <Title>{__('Size:', 'b-blocks')}</Title>
                            <RangeControl value={sepSize} onChange={val => setAttributes({ sepSize: val })} min={0} max={160} step={1} allowReset={true} resetFallbackValue={48} initialPosition={48} />

                            <BColor label={__('Color:', 'b-blocks')} value={sepColor} onChange={val => setAttributes({ sepColor: val })} defaultColor='#4527a4' />
                        </>}
                    </PanelBody>
                </>}
            </>}</TabPanel>
        </InspectorControls>

        <BlockControls>
            <AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Countdown Alignment')} alignmentControls={[
                { title: __('Countdown in left', 'b-blocks'), align: 'flex-start', icon: 'align-left' },
                { title: __('Countdown in center', 'b-blocks'), align: 'center', icon: 'align-center' },
                { title: __('Countdown in right', 'b-blocks'), align: 'flex-end', icon: 'align-right' }
            ]} />
        </BlockControls>
    </>;
};
export default Settings;