
import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, TabPanel, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button } from '@wordpress/components';

import { IndexContext } from './edit';

// Variables
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import ShadowControl from '../../../../Components/ShadowControl';
import BorderControl from '../../../../Components/BorderControl';
import ColorsControl from '../../../../Components/ColorsControl';
import IconControl from '../../../../Components/IconControl';
import Background from '../../../../Components/Background';
import BDevice from '../../../../Components/BDevice';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;
const frontBackTab = [
    { name: 'front', title: __('Front', 'b-blocks') },
    { name: 'back', title: __('Back', 'b-blocks') }
];

// Icons
import icons from '../../Const/icons';

const Settings = ({ settings }) => {
    const { attributes: { boxes = [], columns, columnGap, rowGap, boxHeight, textAlign, boxPadding, isIcon, iconMargin, titleTypo, titleMargin, isDesc, descTypo, isBtn, btnTypo, btnPadding }, setAttributes } = settings;

    const setActiveIndex = useContext(IndexContext);
    const [device, setDevice] = useState('desktop');

    const addFlipBox = () => {
        setAttributes({
            boxes: [...boxes, {
                background: {
                    front: {},
                    back: {}
                },
                border: {},
                shadow: {},

                icon: {
                    front: { class: 'fa fa-sync-alt', fontSize: 70, color: '#fff' },
                    back: { class: 'fa fa-wordpress', fontSize: 70, color: '#fff' }
                },

                title: {
                    front: `Front Title ${boxes.length + 1}`,
                    back: `Back Title ${boxes.length + 1}`,
                    color: '#fff'
                },

                description: {
                    text: `This content area describes flip box ${boxes.length + 1} descriptions/details.`,
                    color: '#fff'
                },

                button: {
                    text: `Button ${boxes.length + 1}`,
                    link: '#',
                    colors: { color: '#fff', bg: '#ff4500' },
                    hovColors: { color: '#fff', bg: '#ff7500' },
                    border: { radius: '3px' }
                }
            }]
        });
        setActiveIndex(boxes.length);
    }

    const updateFlipBox = (index, type, val) => {
        const newBoxes = [...boxes];
        newBoxes[index][type] = val;
        setAttributes({ boxes: newBoxes });
        setActiveIndex(index);
    }

    return <>
        <InspectorControls>
            <PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Boxes', 'b-blocks')}>
                {boxes.map((item, index) => {
                    const { frontBG, backBG, border, shadow, frontIcon, backIcon, frontTitle, backTitle, frontTitleColor, backTitleColor, desc, descColor, btn, btnLink, btnBorder, btnColors, btnHovColors } = item;

                    return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Flip Box No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
                        <PanelBody className='bPlPanelBody' title={__('Box Settings', 'b-blocks')}>
                            <BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => updateFlipBox(index, 'border', val)} />

                            <ShadowControl label={__('Shadow:', 'b-blocks')} shadow={shadow} onChange={val => updateFlipBox(index, 'shadow', val)} />
                        </PanelBody>

                        <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={frontBackTab}>{tab => <>
                            {'front' == tab.name && <>
                                <PanelBody className='bPlPanelBody' title={__('Front Box', 'b-blocks')}>
                                    <Background label={__('Background:', 'b-blocks')} background={frontBG} onChange={val => updateFlipBox(index, 'frontBG', val)} />
                                </PanelBody>

                                {isIcon && <PanelBody className='bPlPanelBody' title={__('Front Icon', 'b-blocks')} initialOpen={false}>
                                    <IconControl icon={frontIcon} onChange={val => updateFlipBox(index, 'frontIcon', val)} defaults={{ class: 'fa fa-sync-alt', fontSize: 70, color: '#fff' }} />
                                </PanelBody>}

                                <PanelBody className='bPlPanelBody' title={__('Front Title', 'b-blocks')} initialOpen={false}>
                                    <Title mt='0'>{__('Text:', 'b-blocks')}</Title>
                                    <TextControl value={frontTitle} onChange={val => updateFlipBox(index, 'frontTitle', val)} />

                                    <BColor label={__('Color:', 'b-blocks')} value={frontTitleColor} onChange={val => updateFlipBox(index, 'frontTitleColor', val)} defaultColor='#fff' />
                                </PanelBody>

                                <PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>
                                    <Title mt='0'>{__('Text:', 'b-blocks')}</Title>
                                    <TextareaControl value={desc} onChange={val => updateFlipBox(index, 'desc', val)} />

                                    <BColor label={__('Color:', 'b-blocks')} value={descColor} onChange={val => updateFlipBox(index, 'descColor', val)} defaultColor='#fff' />
                                </PanelBody>
                            </>}

                            {'back' == tab.name && <>
                                <PanelBody className='bPlPanelBody' title={__('Back Box', 'b-blocks')}>
                                    <Background label={__('Background:', 'b-blocks')} background={backBG} onChange={val => updateFlipBox(index, 'backBG', val)} />
                                </PanelBody>

                                {isIcon && <PanelBody className='bPlPanelBody' title={__('Back Icon', 'b-blocks')} initialOpen={false}>
                                    <IconControl icon={backIcon} onChange={val => updateFlipBox(index, 'backIcon', val)} defaults={{ class: 'fa fa-wordpress', fontSize: 70, color: '#fff' }} />
                                </PanelBody>}

                                <PanelBody className='bPlPanelBody' title={__('Back Title', 'b-blocks')} initialOpen={false}>
                                    <Title mt='0'>{__('Text:', 'b-blocks')}</Title>
                                    <TextControl value={backTitle} onChange={val => updateFlipBox(index, 'backTitle', val)} />

                                    <BColor label={__('Color:', 'b-blocks')} value={backTitleColor} onChange={val => updateFlipBox(index, 'backTitleColor', val)} defaultColor='#fff' />
                                </PanelBody>

                                <PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
                                    <Title mt='0'>{__('Text:', 'b-blocks')}</Title>
                                    <TextControl value={btn} onChange={val => updateFlipBox(index, 'btn', val)} />

                                    <Title>{__('Link:', 'b-blocks')}</Title>
                                    <TextControl value={btnLink} onChange={val => updateFlipBox(index, 'btnLink', val)} />

                                    <BorderControl label={__('Border:', 'b-blocks')} border={btnBorder} onChange={val => updateFlipBox(index, 'btnBorder', val)} defaults={{ radius: '3px' }} />

                                    <ColorsControl colors={btnColors} onChange={val => updateFlipBox(index, 'btnColors', val)} defaults={{ color: '#fff', bg: '#ff4500' }} />

                                    <ColorsControl label={__('Hover Colors:', 'b-blocks')} colors={btnHovColors} onChange={val => updateFlipBox(index, 'btnHovColors', val)} defaults={{ color: '#fff', bg: '#ff7500' }} />
                                </PanelBody>
                            </>}
                        </>}</TabPanel>

                        <PanelRow className='itemAction mt20'>
                            <Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
                                e.preventDefault();
                                setAttributes({ boxes: [...boxes.slice(0, index), ...boxes.slice(index + 1)] });
                            }}><Dashicon icon='no' size={18} />{__('Remove', 'b-blocks')}</Button>

                            <Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
                                e.preventDefault();
                                setAttributes({ boxes: [...boxes, { ...boxes[index] }] });
                            }}>{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
                        </PanelRow>
                    </PanelBody>
                })}

                <div className='addItem'>
                    <Button label={__('Add New Flip Box', 'b-blocks')} onClick={addFlipBox}><Dashicon icon='plus' size={23} />{__('Add New Flip Box', 'b-blocks')}</Button>
                </div>
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={false}>
                {/* Columns */}
                <PanelRow>
                    <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                    <BDevice device={device} onChange={val => setDevice(val)} />
                </PanelRow>
                <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                <UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

                <UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Box Settings', 'b-blocks')} initialOpen={false}>
                {/* Height */}
                <UnitControl label={__('Height:', 'b-blocks')} labelPosition='left' value={boxHeight} onChange={val => setAttributes({ boxHeight: val })} units={[pxUnit, emUnit]} />

                {/* Padding */}
                <SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={boxPadding} onChange={val => setAttributes({ boxPadding: val })} defaults={{ vertical: '30px', horizontal: '25px' }} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

                {/* Margin */}
                <SpaceControl label={__('Margin:', 'b-blocks')} space={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                {/* Typography */}
                <Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 25 }} />

                {/* Margin */}
                <SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                {/* Typography */}
                <Typography typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 16 }} />
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Button Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Button', 'b-blocks')} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

                {/* Typography */}
                <Typography typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 20 }} />

                {/* Padding */}
                <SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '15px', horizontal: '25px' }} />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <ToolbarGroup className='bPlToolbar'>
                <ToolbarButton label={__('Add New Box', 'b-blocks')} onClick={addFlipBox}><Dashicon icon='plus' size={23} /></ToolbarButton>
            </ToolbarGroup>

            <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
        </BlockControls>
    </>;
};
export default Settings;