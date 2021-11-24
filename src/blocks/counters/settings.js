import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, TextControl, RangeControl, ToggleControl, SelectControl, ToolbarGroup, ToolbarButton, __experimentalUnitControl as UnitControl, Button, Dashicon, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { IndexContext } from './edit';
import spaceOffice from '../../img/open-space-office.jpg';

// Variables
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import Background from '../../../../Components/Background';
import IconControl from '../../../../Components/IconControl';
import BDevice from '../../../../Components/BDevice';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import options from '../../Const/options';
const { generalStyleTabs, pxUnit, perUnit, emUnit } = options;
const themes = [
    { label: __('Default', 'counters-block'), value: 'default' },
    { label: __('Theme 1', 'counters-block'), value: 'theme1' },
    { label: __('Theme 2', 'counters-block'), value: 'theme2' },
    { label: __('Theme 3', 'counters-block'), value: 'theme3' }
];
const iconPositions = [
    { label: __('Top', 'counters-block'), value: 'top' },
    { label: __('Label', 'counters-block'), value: 'label' }
];

import icons from '../../Const/icons';

const Settings = props => {
    const { attributes: { counters = [], theme, columns, columnGap, rowGap, duration, background, padding, counterWidth, counterHeight, textAlign, isIcon, iconSize, iconPosition, numberTypo, isLabel, labelTypo, counterPadding, counterBorder, counterShadow }, setAttributes } = props;

    const setActiveIndex = useContext(IndexContext);
    const [device, setDevice] = useState('desktop');

    const addCounter = () => {
        setAttributes({
            counters: [...counters, {
                background: { color: '#4527a4' },
                icon: { class: 'fa fa-award', fontSize: 50, color: '#fff' },
                number: { start: 0, end: 300, prefix: '', suffix: '', color: '#fff' },
                label: { text: 'Awards', color: '#fff' }
            }]
        });
        setActiveIndex(counters.length);
    }

    const updateCounter = (index, type, val, otherType = false) => {
        const newCounters = [...counters];

        if (otherType) {
            newCounters[index][type][otherType] = val;
            setAttributes({ counters: newCounters });
        } else {
            newCounters[index][type] = val;
            setAttributes({ counters: newCounters });
        }
        setActiveIndex(index);
    }

    const updateAllCounter = (type, val, otherType = false) => {
        const newCounters = [...counters];

        newCounters.map((counter, index) => {
            if (otherType) {
                newCounters[index][type][otherType] = val;
            } else {
                newCounters[index][type] = val;
            }
        });
        setAttributes({ counters: newCounters });
    }


    return <>
        <InspectorControls>
            <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
                {'general' === tab.name && <>
                    <PanelBody className='bPlPanelBody help' title={__('Help', 'counters-block')}>
                        <div className='helpItem'>
                            <a href='https://bblockswp.com/docs/counters-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' size={23} />{__('Read Documentation', 'counters-block')}</a>
                        </div>
                    </PanelBody>


                    <PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove counters', 'counters-block')}>
                        {counters.map((item, index) => {
                            const { background, icon, number, label } = item;

                            return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Counter No ${index + 1}:`, 'counters-block')} initialOpen={0 !== index ? false : true}>
                                <Background label={__('Background:', 'counters-block')} background={background} onChange={val => updateCounter(index, 'background', val)} defaults={{ color: '#0000' }} />

                                <IconControl label={__('Icon:', 'counters-block')} icon={icon} onChange={val => updateCounter(index, 'icon', val)} defaults={{ class: 'fa fa-award', fontSize: 50, color: '#fff' }} disableSize={true} />

                                <NumberControl label={__('Start Number:', 'counters-block')} labelPosition='left' className='mt20' value={number.start} onChange={val => updateCounter(index, 'number', val, 'start')} />

                                <NumberControl label={__('End Number:', 'counters-block')} labelPosition='left' className='mt20' value={number.end} onChange={val => updateCounter(index, 'number', val, 'end')} />

                                <PanelRow>
                                    <Title mt='0' mb='0'>{__('Prefix:', 'counters-block')}</Title>
                                    <TextControl value={number.prefix} onChange={val => updateCounter(index, 'number', val, 'prefix')} />
                                </PanelRow>

                                <PanelRow>
                                    <Title mt='0' mb='0'>{__('Suffix:', 'counters-block')}</Title>
                                    <TextControl value={number.suffix} onChange={val => updateCounter(index, 'number', val, 'suffix')} />
                                </PanelRow>

                                <BColor label={__('Number Color:', 'counters-block')} value={number.color} onChange={val => updateCounter(index, 'number', val, 'color')} defaultColor='#fff' />

                                <BColor label={__('Label Color:', 'counters-block')} value={label.color} onChange={val => updateCounter(index, 'label', val, 'color')} defaultColor='#fff' />

                                <PanelRow className='itemAction mt20'>
                                    <Button className='removeItem' label={__('Remove', 'counters-block')} onClick={e => {
                                        e.preventDefault();
                                        setAttributes({ counters: [...counters.slice(0, index), ...counters.slice(index + 1)] });
                                    }}><Dashicon icon='no' size={18} />{__('Remove', 'counters-block')}</Button>

                                    <Button className='duplicateItem' label={__('Duplicate', 'counters-block')} onClick={e => {
                                        e.preventDefault();
                                        setAttributes({ counters: [...counters, counters[index]] });
                                    }}>{icons.gearSettings}{__('Duplicate', 'counters-block')}</Button>
                                </PanelRow>
                            </PanelBody>
                        })}

                        <div className='addItem'>
                            <Button label={__('Add New Counter', 'counters-block')} onClick={addCounter}><Dashicon icon='plus' size={23} />{__('Add New Counter', 'counters-block')}</Button>
                        </div>
                    </PanelBody>


                    <PanelBody className='bPlPanelBody' title={__('Layout Settings', 'counters-block')} initialOpen={false}>
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Theme:', 'counters-block')}</Title>
                            <SelectControl value={theme} onChange={val => {
                                setAttributes({ theme: val });
                                'default' === val && (
                                    setAttributes({
                                        background: { ...background, type: 'solid', color: '#0000', styles: `background-color: #0000;` },
                                        padding: { ...padding, vertical: '20px', horizontal: '0px', styles: '20px 0px' },
                                        counterHeight: '250px',
                                        counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '50%', styles: `border: none; border-radius: 50%;` },
                                        iconPosition: 'top',
                                        iconSize: 50
                                    }),
                                    updateAllCounter('background', '#4527a4', 'color'),
                                    updateAllCounter('background', 'background-color: #4527a4;', 'styles'),
                                    updateAllCounter('icon', '#fff', 'color'),
                                    updateAllCounter('icon', 'color: #fff;', 'styles'),
                                    updateAllCounter('number', '#fff', 'color'),
                                    updateAllCounter('label', '#fff', 'color')
                                );
                                'theme1' === val && (
                                    setAttributes({
                                        background: { ...background, type: 'solid', color: '#0000', styles: `background-color: #0000;` },
                                        padding: { ...padding, vertical: '20px', horizontal: '0px', styles: '20px 0px' },
                                        counterHeight: '175px',
                                        counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '5px', styles: `border: none; border-radius: 5px;` },
                                        iconPosition: 'label',
                                        iconSize: labelTypo?.fontSize
                                    }),
                                    updateAllCounter('background', '#4527a4', 'color'),
                                    updateAllCounter('background', 'background-color: #4527a4;', 'styles'),
                                    updateAllCounter('icon', '#fff', 'color'),
                                    updateAllCounter('icon', 'color: #fff;', 'styles'),
                                    updateAllCounter('number', '#fff', 'color'),
                                    updateAllCounter('label', '#fff', 'color')
                                );
                                'theme2' === val && (
                                    setAttributes({
                                        background: { ...background, type: 'solid', color: '#0000', styles: `background-color: #0000;` },
                                        padding: { ...padding, vertical: '20px', horizontal: '0px', styles: '20px 0px' },
                                        counterHeight: '175px',
                                        counterBorder: { ...counterBorder, width: '2px', color: '#4527a4', radius: '5px', styles: `border: 2px solid #4507a4; border-radius: 5px;` },
                                        iconPosition: 'label',
                                        iconSize: labelTypo?.fontSize
                                    }),
                                    updateAllCounter('background', '#0000', 'color'),
                                    updateAllCounter('background', 'background-color: #0000;', 'styles'),
                                    updateAllCounter('icon', '#4527a4', 'color'),
                                    updateAllCounter('icon', 'color: #4527a4;', 'styles'),
                                    updateAllCounter('number', '#4527a4', 'color'),
                                    updateAllCounter('label', '#4527a4', 'color')
                                );
                                'theme3' === val && (
                                    setAttributes({
                                        background: { ...background, type: 'image', image: { url: spaceOffice }, overlayColor: '#000000b3', styles: `background-image: url(${spaceOffice}); background-position: center center; background-size: cover; background-repeat: no-repeat; background-color: #000000b3; background-blend-mode: overlay;` },
                                        padding: { ...padding, vertical: '140px', horizontal: '0px', styles: '140px 0px' },
                                        counterHeight: '250px',
                                        counterBorder: { ...counterBorder, width: '0px', color: '#0000', radius: '50%', styles: `border: none; border-radius: 50%;` },
                                        iconPosition: 'top',
                                        iconSize: 50
                                    }),
                                    updateAllCounter('background', '#0000', 'color'),
                                    updateAllCounter('background', 'background-color: #0000;', 'styles'),
                                    updateAllCounter('icon', '#fff', 'color'),
                                    updateAllCounter('icon', 'color: #fff;', 'styles'),
                                    updateAllCounter('number', '#fff', 'color'),
                                    updateAllCounter('label', '#fff', 'color')
                                );
                            }} options={themes} />
                        </PanelRow>

                        {/* Columns */}
                        <PanelRow className='mt20'>
                            <Title mt='0'>{__('Columns:', 'counters-block')}</Title>
                            <BDevice device={device} onChange={val => setDevice(val)} />
                        </PanelRow>
                        <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                        <UnitControl className='mt20' label={__('Column Gap:', 'counters-block')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

                        <UnitControl className='mt20' label={__('Row Gap:', 'counters-block')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />
                    </PanelBody>


                    <PanelBody className='bPlPanelBody' title={__('Counters Settings', 'counters-block')} initialOpen={false}>
                        <NumberControl label={__('Duration:', 'counters-block')} labelPosition='left' value={duration} onChange={val => setAttributes({ duration: val })} />
                        <small>{__('Duration in milliseconds:', 'counters-block')}</small>
                    </PanelBody>


                    <PanelBody className='bPlPanelBody' title={__('Counter Elements', 'counters-block')} initialOpen={false}>
                        <ToggleControl label={__('Show Icon', 'counters-block')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

                        <Title>{__('Icon Size:', 'counters-block')}</Title>
                        <RangeControl value={iconSize} onChange={val => setAttributes({ iconSize: val })} min={0} max={400} step={1} allowReset={true} resetFallbackValue={50} initialPosition={50} />

                        <PanelRow className='mt10'>
                            <Title mt='0' mb='0'>{__('Icon Position:', 'counters-block')}</Title>
                            <SelectControl value={iconPosition} onChange={val => {
                                setAttributes({ iconPosition: val });
                                'top' === val && setAttributes({ iconSize: 50 });
                                'label' === val && setAttributes({ iconSize: labelTypo?.fontSize });
                            }} options={iconPositions} />
                        </PanelRow>

                        <Typography className='mt20' label={__('Number Typography:', 'counters-block')} typography={numberTypo} onChange={val => setAttributes({ numberTypo: val })} defaults={{ fontSize: 48 }} />

                        <ToggleControl className='mt20' label={__('Show Label', 'counters-block')} checked={isLabel} onChange={val => setAttributes({ isLabel: val })} />

                        {isLabel && <Typography label={__('Label Typography:', 'counters-block')} typography={labelTypo} onChange={val => setAttributes({ labelTypo: val })} defaults={{ fontSize: 22 }} />}
                    </PanelBody>
                </>}

                {'style' === tab.name && <>
                    <PanelBody className='bPlPanelBody' title={__('Counters Style', 'counters-block')}>
                        <Background label={__('Background:', 'counters-block')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

                        <SpaceControl className='mt20' label={__('Padding:', 'counters-block')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '20px', horizontal: '0px' }} />
                    </PanelBody>


                    <PanelBody className='bPlPanelBody' title={__('Single Counter Style', 'counters-block')} initialOpen={false}>
                        <UnitControl label={__('Width:', 'counters-block')} labelPosition='left' value={counterWidth} onChange={val => setAttributes({ counterWidth: val })} units={[pxUnit, perUnit, emUnit]} />

                        <UnitControl className='mt20' label={__('Height:', 'counters-block')} labelPosition='left' value={counterHeight} onChange={val => setAttributes({ counterHeight: val })} units={[pxUnit, perUnit, emUnit]} />

                        <SpaceControl className='mt20' label={__('Padding:', 'counters-block')} space={counterPadding} onChange={val => setAttributes({ counterPadding: val })} defaults={{ vertical: '20px', horizontal: '20px' }} />

                        <BorderControl label={__('Border:', 'counters-block')} border={counterBorder} onChange={val => setAttributes({ counterBorder: val })} defaults={{ radius: '50%' }} />

                        <ShadowControl label={__('Shadow:', 'counters-block')} shadow={counterShadow} onChange={val => setAttributes({ counterShadow: val })} />
                    </PanelBody>
                </>}
            </>}</TabPanel>
        </InspectorControls>


        <BlockControls>
            <ToolbarGroup className='bPlToolbar'>
                <ToolbarButton label={__('Add New Counter', 'counters-block')} onClick={addCounter}><Dashicon icon='plus' size={23} /></ToolbarButton>
            </ToolbarGroup>

            <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
        </BlockControls>
    </>;
};
export default Settings;