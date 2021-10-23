import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, ToggleControl, RangeControl, __experimentalUnitControl as UnitControl, TextControl, TabPanel } from '@wordpress/components';

// Variables
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BtnGroup from '../../../../Components/BtnGroup';
import options from '../../Const/options';
const { generalStyleTabs, pxUnit, perUnit, emUnit } = options;

const modes = [
    { label: __('Normal', 'b-blocks'), value: 'normal', icon: __('Normal', 'b-blocks') },
    { label: __('Bounce', 'b-blocks'), value: 'bounce', icon: __('Bounce', 'b-blocks') }
];

const Settings = ({ settings }) => {
    const { attributes: { playerAlign, file, isControls, isAutoplay, isLoop, isHover, mode, count, speed, intermission, width, background, controlsHeight, controlsBG, controlsIconColor, controlsIconHoverColor, controlsIconActiveColor, controlsTrackColor, controlsThumbColor }, setAttributes } = settings;

    return <>
        <InspectorControls>
            <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
                {'general' == tab.name && <>
                    <PanelBody className='bPlPanelBody' title={__('Player Settings', 'b-blocks')}>
                        <Title mt='0'>{__('Lottie Json file url:', 'b-blocks')}</Title>
                        <TextControl value={file} onChange={val => setAttributes({ file: val })} />

                        <ToggleControl className='mt20' label={__('Show Controls', 'b-blocks')} checked={isControls} onChange={val => setAttributes({ isControls: val })} />

                        <ToggleControl label={__('Enable Autoplay', 'b-blocks')} checked={isAutoplay} onChange={val => setAttributes({ isAutoplay: val })} />

                        <ToggleControl label={__('Enable Loop', 'b-blocks')} checked={isLoop} onChange={val => setAttributes({ isLoop: val })} />

                        <ToggleControl label={__('Enable Hover', 'b-blocks')} checked={isHover} onChange={val => setAttributes({ isHover: val })} />

                        <PanelRow className='mt20'>
                            <Title mt='0' mb='0'>{__('Mode:', 'b-blocks')}</Title>
                            <BtnGroup options={modes} myValue={mode} setState={val => setAttributes({ mode: val })} />
                        </PanelRow>

                        <Title>{__('Count (Set 0 to infinite):', 'b-blocks')}</Title>
                        <RangeControl value={count} onChange={val => setAttributes({ count: val })} min={0} max={50} step={1} />

                        <Title>{__('Speed:', 'b-blocks')}</Title>
                        <RangeControl value={speed} onChange={val => setAttributes({ speed: val })} min={0.01} max={20} step={.01} />

                        <Title>{__('Intermission (s):', 'b-blocks')}</Title>
                        <RangeControl value={intermission} onChange={val => setAttributes({ intermission: val })} min={0} max={20} step={.01} />
                    </PanelBody>
                </>}

                {'style' == tab.name && <>
                    <PanelBody className='bPlPanelBody' title={__('Player Styles', 'b-blocks')}>
                        <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit, perUnit, emUnit]} />

                        <BColor label={__('Background Color:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaultColor='#0000' />
                    </PanelBody>

                    <PanelBody className='bPlPanelBody' title={__('Controls Styles', 'b-blocks')} initialOpen={false}>
                        <UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={controlsHeight} onChange={val => setAttributes({ controlsHeight: val })} units={[pxUnit, perUnit, emUnit]} />

                        <BColor label={__('Background Color:', 'b-blocks')} value={controlsBG} onChange={val => setAttributes({ controlsBG: val })} defaultColor='#0000' />

                        <BColor label={__('Icons Color:', 'b-blocks')} value={controlsIconColor} onChange={val => setAttributes({ controlsIconColor: val })} defaultColor='#4527a4' />

                        <BColor label={__('Icons Hover Color:', 'b-blocks')} value={controlsIconHoverColor} onChange={val => setAttributes({ controlsIconHoverColor: val })} defaultColor='#8344c5' />

                        <BColor label={__('Icons Active Color:', 'b-blocks')} value={controlsIconActiveColor} onChange={val => setAttributes({ controlsIconActiveColor: val })} defaultColor='#8344c5' />

                        <BColor label={__('Track Color:', 'b-blocks')} value={controlsTrackColor} onChange={val => setAttributes({ controlsTrackColor: val })} defaultColor='#8344c5' />

                        <BColor label={__('Thumb Color:', 'b-blocks')} value={controlsThumbColor} onChange={val => setAttributes({ controlsThumbColor: val })} defaultColor='#4527a4' />
                    </PanelBody>
                </>}
            </>}</TabPanel>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={playerAlign} onChange={val => setAttributes({ playerAlign: val })} describedBy={__('Player Alignment')} alignmentControls={[
                { title: __('Player in left', 'b-blocks'), align: 'left', icon: 'align-left' },
                { title: __('Player in center', 'b-blocks'), align: 'center', icon: 'align-center' },
                { title: __('Player in right', 'b-blocks'), align: 'right', icon: 'align-right' }
            ]} />
        </BlockControls>
    </>;
};
export default Settings;