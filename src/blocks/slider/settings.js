import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { __experimentalAlignmentMatrixControl as AlignmentMatrixControl, PanelBody, PanelRow, RangeControl, Button, ToolbarGroup, ToolbarButton, Dashicon, TextControl, TextareaControl, ToggleControl, TabPanel, __experimentalUnitControl as UnitControl, SelectControl } from '@wordpress/components';

import { IndexContext } from './edit';

// Variables
import BDevice from '../../Components/BDevice';
import Background from '../../Components/Background';
import Title from '../../Components/Title';
import BColor from '../../Components/BColor';
import BorderControl from '../../Components/BorderControl';
import SpaceControl from '../../Components/SpaceControl';
import ColorsControl from '../../Components/ColorsControl';
import Typography from '../../Components/Typography';
import options from '../../Const/options';
const { generalStyleTabs, effects, pxUnit, perUnit, emUnit, vhUnit } = options;

const Settings = ({ settings }) => {
    const { attributes: { slides = [], columns, columnGap, sliderWidth, sliderHeight, isLoop, isAutoplay, speed, effect, isTouchMove, isPage, isPageClickable, isPageDynamic, pageColor, pageWidth, pageHeight, pageBorder, isPrevNext, prevNextColor, sliderAlign, isTitle, titleTypo, titleColor, titleMargin, isDesc, descTypo, descColor, descMargin, isBtn, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder }, setAttributes } = settings;

    const setActiveIndex = useContext(IndexContext);
    const [device, setDevice] = useState('desktop');

    const addSlide = () => {
        setAttributes({
            slides: [...slides, {
                background: { color: '#00000080' },
                position: 'center center',
                title: `Slide Title ${slides.length + 1}`,
                description: `This content area describes slider ${slides.length + 1} descriptions/details.`,
                btnText: `Button ${slides.length + 1}`,
                btnLink: '#'
            }]
        });
        setActiveIndex(slides.length);
    }

    const updateSlide = (index, type, val) => {
        const newSlides = [...slides];
        newSlides[index][type] = val;
        setAttributes({ slides: newSlides });
        setActiveIndex(index);
    }

    return <>
        <InspectorControls>
            <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
                {'general' === tab.name && <>
                    <PanelBody className='bBlocksPanelBody addRemoveItems' title={__('Add or Remove Slides', 'b-blocks')}>
                        {slides.map((item, index) => {
                            const { background, position, title, description, btnText, btnLink } = item;

                            return <PanelBody key={index} className='bBlocksPanelBody editItem' title={__(`Slide No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
                                <Background label={__('Background', 'b-blocks')} background={background} onChange={val => updateSlide(index, 'background', val)} defaults={{ color: '#00000080' }} />

                                <PanelRow>
                                    <Title mt='0' mb='0'>{__('Content Position', 'b-blocks')}</Title>
                                    <AlignmentMatrixControl value={position} onChange={val => updateSlide(index, 'position', val)} />
                                </PanelRow>

                                <PanelRow>
                                    <Title mt='0' mb='0'>{__('Title:', 'b-blocks')}</Title>
                                    <TextControl value={title} onChange={val => updateSlide(index, 'title', val)} placeholder={__('Slide title', 'b-blocks')} />
                                </PanelRow>

                                <Title mt='0'>{__('Description:', 'b-blocks')}</Title>
                                <TextareaControl value={description} onChange={val => updateSlide(index, 'description', val)} placeholder={__('Description of the slide', 'b-blocks')} />

                                <PanelRow>
                                    <Title mt='0' mb='0'>{__('Button Text:', 'b-blocks')}</Title>
                                    <TextControl value={btnText} onChange={val => updateSlide(index, 'btnText', val)} placeholder={__('Click Me', 'b-blocks')} />
                                </PanelRow>

                                <PanelRow>
                                    <Title mt='0' mb='0'>{__('Button Link:', 'b-blocks')}</Title>
                                    <TextControl value={btnLink} onChange={val => updateSlide(index, 'btnLink', val)} placeholder={__('Button link', 'b-blocks')} />
                                </PanelRow>

                                <Button className='mt-20p removeItem' label={__('Remove this slide', 'b-blocks')} onClick={e => {
                                    e.preventDefault();
                                    setAttributes({ slides: [...slides.slice(0, index), ...slides.slice(index + 1)] });
                                }} ><Dashicon icon='no' size={23} />{__('Remove this slide', 'b-blocks')}</Button>
                            </PanelBody>
                        })}

                        <div className='addItem'>
                            <Button label={__('Add New Slide', 'b-blocks')} onClick={addSlide} ><Dashicon icon='plus' size={23} />{__('Add New Slide', 'b-blocks')}</Button>
                        </div>
                    </PanelBody>

                    <PanelBody className='bBlocksPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
                        {/* Columns */}
                        <PanelRow>
                            <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                            <BDevice device={device} onChange={val => setDevice(val)} />
                        </PanelRow>
                        <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                        {/* Column Gap */}
                        <Title>{__('Column Gap:', 'b-blocks')}</Title>
                        <RangeControl value={columnGap} onChange={val => setAttributes({ columnGap: val })} min={0} max={250} step={1} beforeIcon='arrow-right-alt' />

                        {/* Width */}
                        <UnitControl className='mt-20p' label={__('Width:', 'b-blocks')} labelPosition='left' value={sliderWidth} onChange={val => setAttributes({ sliderWidth: val })} units={[pxUnit, perUnit, emUnit]} />

                        {/* Height */}
                        <UnitControl className='mt-20p' label={__('Height:', 'b-blocks')} labelPosition='left' value={sliderHeight} onChange={val => setAttributes({ sliderHeight: val })} units={[pxUnit, emUnit, vhUnit]} />
                    </PanelBody>

                    <PanelBody className='bBlocksPanelBody' title={__('Slider Options', 'b-blocks')} initialOpen={false}>
                        {/* Loop */}
                        <ToggleControl label={__('Enable Loop', 'b-blocks')} checked={isLoop} onChange={val => setAttributes({ isLoop: val })} />

                        {/* Touch Move */}
                        <ToggleControl label={__('Enable Touch Move', 'b-blocks')} checked={isTouchMove} onChange={val => setAttributes({ isTouchMove: val })} />

                        {/* Autoplay */}
                        <ToggleControl label={__('Enable Autoplay', 'b-blocks')} checked={isAutoplay} onChange={val => setAttributes({ isAutoplay: val })} />

                        {/* Speed & Delay */}
                        <Title>{__('Speed & Delay (s):', 'b-blocks')}</Title>
                        <RangeControl value={speed} onChange={val => setAttributes({ speed: val })} min={0} max={10} step={.05} />
                        <small>{__('Smaller speed & delay value will be slide faster', 'b-blocks')}</small>

                        {/* Effect */}
                        <PanelRow className='mt-20p'>
                            <Title mt='0' mb='0'>{__('Effect:', 'b-blocks')}</Title>
                            <SelectControl value={effect} onChange={cng => setAttributes({ effect: cng })} options={effects} />
                        </PanelRow>
                        <small>{__('To work fade & creative effects properly, set single column per view', 'b-blocks')}</small>

                        {/* Pagination */}
                        <Title>{__('Pagination:', 'b-blocks')}</Title>
                        <ToggleControl label={__('Show Pagination', 'b-blocks')} checked={isPage} onChange={val => setAttributes({ isPage: val })} />

                        {isPage && <>
                            <ToggleControl label={__('Enable Pagination Clickable', 'b-blocks')} checked={isPageClickable} onChange={val => setAttributes({ isPageClickable: val })} />

                            <ToggleControl label={__('Enable Pagination Dynamic Bullets', 'b-blocks')} checked={isPageDynamic} onChange={val => setAttributes({ isPageDynamic: val })} />
                        </>}

                        {/* Preview Next Button */}
                        <Title>{__('Preview Next Button:', 'b-blocks')}</Title>
                        <ToggleControl label={__('Show Preview Next Button', 'b-blocks')} checked={isPrevNext} onChange={val => setAttributes({ isPrevNext: val })} />
                    </PanelBody>
                </>}

                {'style' === tab.name && <>
                    {isPage || isPrevNext ? <PanelBody className='bBlocksPanelBody' title={__('Options Style', 'b-blocks')}>
                        {isPage && <>
                            <BColor label={__('Pagination Bullets Color:', 'b-blocks')} value={pageColor} onChange={val => setAttributes({ pageColor: val })} defaultColor='#fff' />

                            <UnitControl className='mt-20p' label={__('Pagination Width:', 'b-blocks')} labelPosition='left' value={pageWidth} onChange={val => setAttributes({ pageWidth: val })} units={[pxUnit, emUnit]} />

                            <UnitControl className='mt-20p' label={__('Pagination Height:', 'b-blocks')} labelPosition='left' value={pageHeight} onChange={val => setAttributes({ pageHeight: val })} units={[pxUnit, emUnit]} />

                            <BorderControl label={__('Pagination Border:', 'b-blocks')} border={pageBorder} onChange={val => setAttributes({ pageBorder: val })} defaults={{ radius: '50%' }} />
                        </>}

                        {isPrevNext && <BColor className='mt-20p' label={__('Preview Next Button Color:', 'b-blocks')} value={prevNextColor} onChange={val => setAttributes({ prevNextColor: val })} defaultColor='#fff' />}
                    </PanelBody> : ''}

                    <PanelBody className='bBlocksPanelBody' title={__('Slide Title', 'b-blocks')} initialOpen={false}>
                        <ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

                        {/* Typography */}
                        <Typography className='mt-20p' typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 25 }} />

                        {/* Color */}
                        <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#fff' />

                        {/* Margin */}
                        <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
                    </PanelBody>

                    <PanelBody className='bBlocksPanelBody' title={__('Slide Description', 'b-blocks')} initialOpen={false}>
                        <ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                        {/* Typography */}
                        <Typography className='mt-20p' typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />

                        {/* Color */}
                        <BColor className='mt-20p' label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#fff' />

                        {/* Margin */}
                        <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={descMargin} onChange={val => setAttributes({ descMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
                    </PanelBody>

                    <PanelBody className='bBlocksPanelBody' title={__('Slide Button', 'b-blocks')} initialOpen={false}>
                        <ToggleControl label={__('Show Button', 'b-blocks')} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

                        {/* Typography */}
                        <Typography className='mt-20p' typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 16 }} />

                        {/* Padding */}
                        <SpaceControl className='mt-20p' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '35px' }} />

                        {/* Border */}
                        <BorderControl label={__('Border:', 'b-blocks')} border={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '3px' }} />

                        {/* Colors */}
                        <ColorsControl colors={btnColors} onChange={val => setAttributes({ btnColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

                        <ColorsControl label={__('Hover Colors:', 'b-blocks')} colors={btnHovColors} onChange={val => setAttributes({ btnHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />
                    </PanelBody>
                </>}
            </>}</TabPanel>
        </InspectorControls>

        <BlockControls>
            <ToolbarGroup className='bBlocksToolbar'>
                <ToolbarButton label={__('Add New Slide', 'b-blocks')} onClick={addSlide} ><Dashicon icon='plus' size={23} /></ToolbarButton>
            </ToolbarGroup>

            <AlignmentToolbar value={sliderAlign} onChange={val => setAttributes({ sliderAlign: val })} describedBy={__('Slider Alignment')} alignmentControls={[
                { title: __('Slider in left', 'b-blocks'), align: 'left', icon: 'align-left' },
                { title: __('Slider in center', 'b-blocks'), align: 'center', icon: 'align-center' },
                { title: __('Slider in right', 'b-blocks'), align: 'right', icon: 'align-right' }
            ]} />
        </BlockControls>
    </>;
};

export default Settings;