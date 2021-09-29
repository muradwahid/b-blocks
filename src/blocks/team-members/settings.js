import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button, ButtonGroup, Tooltip, SelectControl } from '@wordpress/components';

import { IndexContext } from './edit';

// Variables
import Title from '../../Components/Title';
import BColor from '../../Components/BColor';
import Background from '../../Components/Background';
import ColorsControl from '../../Components/ColorsControl';
import { ImageHolderControl, ChangeImageData } from '../../Components/ImageControl';
import BDevice from '../../Components/BDevice';
import BorderControl from '../../Components/BorderControl';
import ShadowControl from '../../Components/ShadowControl';
import Typography from '../../Components/Typography';
import SeparatorControl from '../../Components/SeparatorControl';
import SpaceControl from '../../Components/SpaceControl';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;
const memberStyles = [
    { label: 'Default', value: 'default' },
    { label: 'Style 1', value: 'style1' },
    { label: 'Style 2', value: 'style2' },
    { label: 'Style 3', value: 'style3' },
];

// Icons
import icons from '../../Const/icons';

const Settings = ({ settings }) => {
    const { attributes: { members = [], columns, columnGap, rowGap, layout, style, textAlign, padding, photoWidth, photoMargin, nameTypo, nameMargin, isTitle, titleTypo, titleMargin, isSep, sepMargin, isBio, bioTypo, bioMargin, isSocial, socialIconMargin }, setAttributes } = settings;

    const setActiveIndex = useContext(IndexContext);
    const [device, setDevice] = useState('desktop');

    const addMember = () => {
        setAttributes({
            members: [...members, {
                background: { color: '#0000' },
                border: { radius: '3px' },
                shadow: {},
                photo: { id: null, url: '', alt: '', title: '' },
                photoBorder: { radius: '50%' },
                name: 'John Smith',
                nameColor: '#333',
                title: 'Manager',
                titleColor: '#333',
                separator: { width: '20%', height: '3px', style: 'solid', color: '#777' },
                bio: 'I am a self-motivated and self-taught professional who likes to solve problems.',
                bioColor: '#333',
                social: [
                    { link: '#', icon: { class: 'fa fa-facebook', fontSize: 22, color: '#fff' } },
                    { link: '#', icon: { class: 'fa fa-twitter', fontSize: 22, color: '#fff' } },
                    { link: '#', icon: { class: 'fa fa-linkedin', fontSize: 22, color: '#fff' } }
                ],
                socialIconColors: { color: '#fff', bg: '#4527a4' }
            }]
        });
        setActiveIndex(members.length);
    }

    const updateMember = (index, type, val) => {
        const newMember = [...members];
        newMember[index][type] = val;
        setAttributes({ members: newMember });
        setActiveIndex(index);
    }

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody addRemoveItems' title={__('Add or Remove Members', 'b-blocks')}>
                {members.map((item, index) => {
                    const { background, border, shadow, photo, photoBorder, nameColor, titleColor, separator, bioColor, socialIconColors } = item;

                    return <PanelBody key={index} className='bBlocksPanelBody editItem' title={__(`Member No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
                        <Background label={__('Background:', 'b-blocks')} background={background} onChange={val => updateMember(index, 'background', val)} />

                        <BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => updateMember(index, 'border', val)} defaults={{ radius: '3px' }} />

                        <ShadowControl label={__('Shadow:', 'countdown-time')} shadow={shadow} onChange={val => updateMember(index, 'shadow', val)} />

                        <ImageHolderControl className='mt-20p' label={__('Photo:', 'b-blocks')} img={photo} onChange={val => updateMember(index, 'photo', val)} />
                        <ChangeImageData className='mt-20p' img={photo} onChange={val => updateMember(index, 'photo', val)} />

                        <BorderControl label={__('Photo Border:', 'b-blocks')} border={photoBorder} onChange={val => updateMember(index, 'photoBorder', val)} defaults={{ radius: '50%' }} />

                        <BColor label={__('Name Color:', 'b-blocks')} value={nameColor} onChange={val => updateMember(index, 'nameColor', val)} defaultColor='#333' />

                        <BColor label={__('Designation/Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateMember(index, 'titleColor', val)} defaultColor='#333' />

                        <SeparatorControl separator={separator} onChange={val => updateMember(index, 'separator', val)} defaults={{ width: '20%', height: '3px', color: '#777' }} />

                        <BColor label={__('Bio Color:', 'b-blocks')} value={bioColor} onChange={val => updateMember(index, 'bioColor', val)} defaultColor='#333' />

                        <ColorsControl label={__('Social Icon Colors:', 'b-blocks')} colors={socialIconColors} onChange={val => updateMember(index, 'socialIconColors', val)} defaults={{ color: '#fff', bg: '#4527a4' }} />

                        <Button className='mt-20p removeItem' label={__('Remove this member', 'b-blocks')} onClick={e => {
                            e.preventDefault();
                            setAttributes({ members: [...members.slice(0, index), ...members.slice(index + 1)] });
                        }} ><Dashicon icon='no' size={23} />{__('Remove this member', 'b-blocks')}</Button>
                    </PanelBody>
                })}

                <div className='addItem'>
                    <Button label={__('Add New Member', 'b-blocks')} onClick={addMember} ><Dashicon icon='plus' size={23} />{__('Add New Member', 'b-blocks')}</Button>
                </div>
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
                {/* Columns */}
                <PanelRow className='mt-20p'>
                    <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                    <BDevice device={device} onChange={val => setDevice(val)} />
                </PanelRow>
                <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                <UnitControl className='mt-20p' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

                <UnitControl className='mt-20p' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />

                {/* Layout */}
                <PanelRow className='mt-20p'>
                    <Title mt='0' mb='0'>{__('Layout:', 'b-blocks')}</Title>
                    <ButtonGroup className='bBlocksBtnGroup'>
                        <Tooltip text={__('Vertical', 'b-blocks')} position='top'>
                            <Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout} aria-pressed={'vertical' === layout} onClick={() => setAttributes({
                                layout: 'vertical',
                                columns: { ...columns, desktop: 3, tablet: 2 },
                                textAlign: 'center',
                                padding: { ...padding, vertical: '50px', styles: `50px ${padding?.horizontal}` },
                            })}></Button>
                        </Tooltip>

                        <Tooltip text={__('Horizontal', 'b-blocks')} position='top'>
                            <Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout} aria-pressed={'horizontal' === layout} onClick={() => setAttributes({
                                layout: 'horizontal',
                                columns: { ...columns, desktop: 2, tablet: 1 },
                                textAlign: 'left',
                                padding: { ...padding, vertical: '30px', styles: `50px ${padding?.horizontal}` },
                            })}></Button>
                        </Tooltip>
                    </ButtonGroup>
                </PanelRow>

                {/* Style */}
                <PanelRow className='mt-20p'>
                    <Title mt='0' mb='0'>{__('Style:', 'b-blocks')}</Title>
                    <SelectControl value={style} onChange={val => {
                        setAttributes({ style: val });
                        'default' === val && setAttributes({
                            padding: { ...padding, vertical: '50px', horizontal: '20px', styles: `50px 20px` },
                            photoWidth: '170px',
                            nameTypo: { ...nameTypo, textTransform: 'none', styles: `${nameTypo?.styles} text-transform: none;` },
                            titleTypo: { ...titleTypo, fontSize: 16, textTransform: 'none', styles: `${titleTypo?.styles} font-size: 16px; text-transform: none;` },
                            isSep: true,
                            isBio: true
                        });
                        'style1' === val && setAttributes({
                            padding: { ...padding, vertical: '50px', horizontal: '20px', styles: `50px 20px` },
                            photoWidth: '190px',
                            nameTypo: { ...nameTypo, textTransform: 'none', styles: `${nameTypo?.styles} text-transform: none;` },
                            titleTypo: { ...titleTypo, fontSize: 14, textTransform: 'uppercase', styles: `${titleTypo?.styles} font-size: 14px; text-transform: uppercase;` },
                            isSep: true,
                            isBio: true
                        });
                        'style2' === val && setAttributes({
                            padding: { ...padding, vertical: '50px', horizontal: '20px', styles: `50px 20px` },
                            photoWidth: '190px',
                            nameTypo: { ...nameTypo, textTransform: 'none', styles: `${nameTypo?.styles} text-transform: none;` },
                            titleTypo: { ...titleTypo, fontSize: 14, textTransform: 'uppercase', styles: `${titleTypo?.styles} font-size: 14px; text-transform: uppercase;` },
                            isSep: true,
                            isBio: false
                        });
                        'style3' === val && setAttributes({
                            padding: { ...padding, vertical: '15px', horizontal: '15px', styles: `15px 15px` },
                            photoWidth: '500px',
                            nameTypo: { ...nameTypo, textTransform: 'uppercase', styles: `${nameTypo?.styles} text-transform: uppercase;` },
                            titleTypo: { ...titleTypo, fontSize: 15, textTransform: 'none', styles: `${titleTypo?.styles} font-size: 15px; text-transform: none;` },
                            isSep: false,
                            isBio: false
                        });

                        members.map((item, index) => {
                            const { background, border, shadow, photoBorder, separator, socialIconColors } = item;
                            'default' === val && (
                                updateMember(index, 'background', { ...background, color: '#0000', styles: `${background?.styles} background-color: #0000;` }),
                                updateMember(index, 'border', { ...border, radius: '3px', styles: `${border?.styles} border-radius: 3px;` }),
                                updateMember(index, 'shadow', { ...shadow, blur: '0px', color: '#7090b0', styles: `0px 0px 0px 0px #7090b0` }),
                                updateMember(index, 'photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '50%', styles: `${photoBorder?.styles} border: 0px solid #0000; border-radius: 50%;` }),
                                updateMember(index, 'nameColor', '#333'),
                                updateMember(index, 'titleColor', '#333'),
                                updateMember(index, 'separator', { ...separator, color: '#777', styles: `${separator?.styles} border-top: 3px solid #777` }),
                                updateMember(index, 'bioColor', '#333'),
                                updateMember(index, 'socialIconColors', { ...socialIconColors, color: '#fff', bg: '#4527a4', styles: `${socialIconColors?.styles} color: #fff; background: #4527a4;` })
                            );
                            'style1' === val && (
                                updateMember(index, 'background', { ...background, color: '#0000', styles: `${background?.styles} background-color: #0000;` }),
                                updateMember(index, 'border', { ...border, radius: '3px', styles: `${border?.styles} border-radius: 3px;` }),
                                updateMember(index, 'shadow', { ...shadow, blur: '20px', color: '#e8edfb', styles: `0px 0px 20px 0px #e8edfb` }),
                                updateMember(index, 'photoBorder', { ...photoBorder, width: '10px', color: '#e8edfb', radius: '50%', styles: `${photoBorder?.styles} border: 10px solid #e8edfb; border-radius: 50%;` }),
                                updateMember(index, 'nameColor', '#333'),
                                updateMember(index, 'titleColor', '#7a7a7a'),
                                updateMember(index, 'separator', { ...separator, color: '#4527a4', styles: `${separator?.styles} border-top: 3px solid #4527a4` }),
                                updateMember(index, 'bioColor', '#7a7a7a'),
                                updateMember(index, 'socialIconColors', { ...socialIconColors, color: '#fff', bg: '#4527a4', styles: `${socialIconColors?.styles} color: #fff; background: #4527a4;` })
                            );
                            'style2' === val && (
                                updateMember(index, 'background', { ...background, color: '#0000', styles: `${background?.styles} background-color: #0000;` }),
                                updateMember(index, 'border', { ...border, radius: '3px', styles: `${border?.styles} border-radius: 3px;` }),
                                updateMember(index, 'shadow', { ...shadow, blur: '0px', color: '#7090b0', styles: `0px 0px 0px 0px #7090b0` }),
                                updateMember(index, 'photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '50%', styles: `${photoBorder?.styles} border: 0px solid #0000; border-radius: 50%;` }),
                                updateMember(index, 'nameColor', '#333'),
                                updateMember(index, 'titleColor', '#7a7a7a'),
                                updateMember(index, 'separator', { ...separator, color: '#999', styles: `${separator?.styles} border-top: 3px solid #999` }),
                                updateMember(index, 'bioColor', '#7a7a7a'),
                                updateMember(index, 'socialIconColors', { ...socialIconColors, color: '#4527a4', bg: '#0000', styles: `${socialIconColors?.styles} color: #4527a4; background: #0000;` })
                            );
                            'style3' === val && (
                                updateMember(index, 'background', { ...background, color: '#4527a4', styles: `${background?.styles} background-color: #4527a4;` }),
                                updateMember(index, 'border', { ...border, radius: '0px', styles: `${border?.styles} border-radius: 0px;` }),
                                updateMember(index, 'shadow', { ...shadow, blur: '0px', color: '#7090b0', styles: `0px 0px 0px 0px #7090b0` }),
                                updateMember(index, 'photoBorder', { ...photoBorder, width: '0px', color: '#0000', radius: '0px', styles: `${photoBorder?.styles} border: 0px solid #0000; border-radius: 0px;` }),
                                updateMember(index, 'nameColor', '#fff'),
                                updateMember(index, 'titleColor', '#fff'),
                                updateMember(index, 'separator', { ...separator, color: '#777', styles: `${separator?.styles} border-top: 3px solid #777` }),
                                updateMember(index, 'bioColor', '#fff'),
                                updateMember(index, 'socialIconColors', { ...socialIconColors, color: '#4527a4', bg: '#fff', styles: `${socialIconColors?.styles} color: #4527a4; background: #fff;` })
                            );
                        });
                    }} options={memberStyles} />
                </PanelRow>
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Member Settings', 'b-blocks')} initialOpen={false}>
                <SpaceControl label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '20px' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Member Photo', 'b-blocks')} initialOpen={false}>
                <UnitControl label={__('Width:', 'b-blocks')} labelPosition='left' value={photoWidth} onChange={val => setAttributes({ photoWidth: val })} units={[pxUnit, perUnit, emUnit]} />

                <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={photoMargin} onChange={val => setAttributes({ photoMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Member Name', 'b-blocks')} initialOpen={false}>
                <Typography typography={nameTypo} onChange={val => setAttributes({ nameTypo: val })} defaults={{ fontSize: 20, fontWeight: 600 }} />

                <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={nameMargin} onChange={val => setAttributes({ nameMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

                {isTitle && <>
                    <Typography className='mt-20p' typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 16 }} />

                    <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
                </>}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                {isSep && <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '15px' }} />}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Member Bio', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Bio', 'b-blocks')} checked={isBio} onChange={val => setAttributes({ isBio: val })} />

                {isBio && <>
                    <Typography className='mt-20p' typography={bioTypo} onChange={val => setAttributes({ bioTypo: val })} defaults={{ fontSize: 15 }} />

                    <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={bioMargin} onChange={val => setAttributes({ bioMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
                </>}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Member Social', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Social', 'b-blocks')} checked={isSocial} onChange={val => setAttributes({ isSocial: val })} />

                {isSocial && <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={socialIconMargin} onChange={val => setAttributes({ socialIconMargin: val })} defaults={{ side: 4, bottom: '15px' }} />}
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <ToolbarGroup className='bBlocksToolbar'>
                <ToolbarButton label={__('Add New Member', 'b-blocks')} onClick={addMember}><Dashicon icon='plus' size={23} /></ToolbarButton>
            </ToolbarGroup>

            <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
        </BlockControls>
    </>;
};

export default Settings;