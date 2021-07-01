import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl, TabPanel, PanelRow, __experimentalUnitControl as UnitControl, TextControl } from '@wordpress/components';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import options from '../../Const/options';
const { pxEmUnits, allUnits } = options;

const modes = [
    { label: __('Normal', 'b-blocks'), value: 'normal', icon: __('Normal', 'b-blocks') },
    { label: __('Bounce', 'b-blocks'), value: 'bounce', icon: __('Bounce', 'b-blocks') }
]

const Edit = props => {
    const { className, attributes: { cId, contentAlign, file, isControls, isAutoplay, isLoop, isHover, mode, count, speed, direction, intermission, width, bgColor, controlsHeight, controlsBGColor, controlsIconColor, controlsIconHoverColor, controlsIconActiveColor, controlsTrackColor, controlsThumbColor }, setAttributes, clientId } = props;

    // useEffect
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    // Set or Remove attributes
    const lottieWrapper = document.querySelector(`#bBlocksLottiePlayer-${cId}`);
    const toggleAttr = (selector, condition, attribute, value) => {
        condition && selector?.setAttribute(attribute, value);
        !condition && selector?.removeAttribute(attribute, value);
    }

    useEffect(() => {
        lottieWrapper ? lottieWrapper.innerHTML = '' : '';

        const reInitPlayer = document.createElement('lottie-player');
        toggleAttr(reInitPlayer, file, 'src', file);
        toggleAttr(reInitPlayer, isControls, 'controls', '');
        toggleAttr(reInitPlayer, isAutoplay, 'autoplay', '');
        toggleAttr(reInitPlayer, isLoop, 'loop', '');
        toggleAttr(reInitPlayer, isHover, 'hover', '');
        toggleAttr(reInitPlayer, mode, 'mode', mode);
        toggleAttr(reInitPlayer, count, 'count', count);
        toggleAttr(reInitPlayer, speed, 'speed', speed);
        toggleAttr(reInitPlayer, direction, 'direction', direction);
        toggleAttr(reInitPlayer, intermission, 'intermission', intermission * 1000);
        toggleAttr(reInitPlayer, bgColor, 'background', bgColor);

        lottieWrapper ? lottieWrapper.appendChild(reInitPlayer) : '';
    }, [file, isControls, isAutoplay, isLoop, isHover, mode, count, speed, direction, intermission, bgColor]);

    return <>
        <InspectorControls>
            <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={[{ name: 'settings', title: __('Settings', 'b-blocks'), className: 'settings-tab' }, { name: 'style', title: __('Style', 'b-blocks'), className: 'styleTab' }]}>{tab => <>
                {'settings' == tab.name && <>
                    <PanelBody title={__('Player Settings', 'b-blocks')}>
                        {/* Lottie Json file url */}
                        <Title mt='0'>{__('Lottie Json file url:', 'b-blocks')}</Title>
                        <TextControl value={file} onChange={val => setAttributes({ file: val })} />

                        {/* Controls */}
                        <ToggleControl className='mt-20p' label={isControls ? 'Hide Controls' : 'Show Controls'} checked={isControls} onChange={val => setAttributes({ isControls: val })} />

                        {/* Autoplay */}
                        <ToggleControl label={isAutoplay ? 'Disable Autoplay' : 'Enable Autoplay'} checked={isAutoplay} onChange={val => setAttributes({ isAutoplay: val })} />

                        {/* Loop */}
                        <ToggleControl label={isLoop ? 'Disable Loop' : 'Enable Loop'} checked={isLoop} onChange={val => setAttributes({ isLoop: val })} />

                        {/* Hover */}
                        <ToggleControl label={isHover ? 'Disable Hover' : 'Enable Hover'} checked={isHover} onChange={val => setAttributes({ isHover: val })} />

                        {/* Mode */}
                        <PanelRow className='mt-20p mb-5p'>
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
                    <PanelBody title={__('Player Styles', 'b-blocks')}>
                        {/* Width */}
                        <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={allUnits} />

                        {/* Background Color */}
                        <BColor label={__('Background Color:', 'b-blocks')} value={bgColor} onChange={val => setAttributes({ bgColor: val })} defaultColor='#0000' />
                    </PanelBody>

                    <PanelBody title={__('Controls Styles', 'b-blocks')}>
                        {/* Height */}
                        <UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={controlsHeight} onChange={val => setAttributes({ controlsHeight: val })} units={pxEmUnits} />

                        {/* Background Color */}
                        <BColor label={__('Background Color:', 'b-blocks')} value={controlsBGColor} onChange={val => setAttributes({ controlsBGColor: val })} defaultColor='#0000' />

                        {/* Icons Color */}
                        <BColor label={__('Icons Color:', 'b-blocks')} value={controlsIconColor} onChange={val => setAttributes({ controlsIconColor: val })} defaultColor='#4527a4' />

                        {/* Icons Hover Color */}
                        <BColor label={__('Icons Hover Color:', 'b-blocks')} value={controlsIconHoverColor} onChange={val => setAttributes({ controlsIconHoverColor: val })} defaultColor='#8344c5' />

                        {/* Icons Active Color */}
                        <BColor label={__('Icons Active Color:', 'b-blocks')} value={controlsIconActiveColor} onChange={val => setAttributes({ controlsIconActiveColor: val })} defaultColor='#8344c5' />

                        {/* Track Color */}
                        <BColor label={__('Track Color:', 'b-blocks')} value={controlsTrackColor} onChange={val => setAttributes({ controlsTrackColor: val })} defaultColor='#8344c5' />

                        {/* Thumb Color */}
                        <BColor label={__('Thumb Color:', 'b-blocks')} value={controlsThumbColor} onChange={val => setAttributes({ controlsThumbColor: val })} defaultColor='#4527a4' />
                    </PanelBody>
                </>}
            </> // Return of Layout TabPanel
            }</TabPanel>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={contentAlign} onChange={val => setAttributes({ contentAlign: val })} />
        </BlockControls>

        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                #bBlocksLottiePlayer-${cId} lottie-player{
                    width: ${width};
                    --lottie-player-toolbar-height: ${controlsHeight};
                    --lottie-player-toolbar-background-color: ${controlsBGColor};
                    --lottie-player-toolbar-icon-color: ${controlsIconColor};
                    --lottie-player-toolbar-icon-hover-color: ${controlsIconHoverColor};
                    --lottie-player-toolbar-icon-active-color: ${controlsIconActiveColor};
                    --lottie-player-seeker-track-color: ${controlsTrackColor};
                    --lottie-player-seeker-thumb-color: ${controlsThumbColor};
                }
            `}} />

            <div id={`bBlocksLottiePlayer-${cId}`} className={`${className} text-${contentAlign}`}>
                <lottie-player
                    src={file}
                    controls
                    autoplay
                    loop
                    mode={mode}
                    count={count}
                    speed={speed}
                    direction={direction}
                    intermission={intermission * 1000}
                    background={bgColor}
                ></lottie-player>
            </div>
        </>
    </>;
};
export default Edit;