import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button } from '@wordpress/components';

import { IndexContext } from './edit';

// Variables
import Title from '../../Components/Title';
import BColor from '../../Components/BColor';
import Background from '../../Components/Background';
import { ImageHolderControl } from '../../Components/ImageControl';
import BDevice from '../../Components/BDevice';
import IconControl from '../../Components/IconControl';
import Typography from '../../Components/Typography';
import SeparatorControl from '../../Components/SeparatorControl';
import SpaceControl from '../../Components/SpaceControl';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;

const Settings = ({ settings }) => {
    const { attributes: { features = [], columns, columnGap, rowGap, textAlign, padding, isIcon, iconMargin, isTitle, titleTypo, titleMargin, isSep, sepMargin, isDesc, descTypo }, setAttributes } = settings;

    const setActiveIndex = useContext(IndexContext);
    const [device, setDevice] = useState('desktop');

    const addFeature = () => {
        setAttributes({
            features: [...features, {
                background: { color: '#0000' },
                isUpIcon: false,
                icon: { class: 'fa fa-wordpress', fontSize: 120 },
                upIcon: { id: null, url: '', alt: '', title: '' },
                iconWidth: '120px',
                title: `Feature ${features.length + 1}`,
                titleColor: '#333',
                separator: { width: '20%', height: '2px', style: 'solid', color: '#bbb' },
                desc: `This content area describes feature ${features.length + 1} description/details.`,
                descColor: '#333'
            }]
        });
        setActiveIndex(features.length);
    }

    const updateFeature = (index, type, val) => {
        const newFeature = [...features];
        newFeature[index][type] = val;
        setAttributes({ features: newFeature });
        setActiveIndex(index);
    }

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody addRemoveItems' title={__('Add or Remove Features', 'b-blocks')}>
                {features.map((item, index) => {
                    const { background, isUpIcon, icon, upIcon, iconWidth, titleColor, separator, descColor } = item;

                    return <PanelBody key={index} className='bBlocksPanelBody editItem' title={__(`Feature No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
                        <Background label={__('Background:', 'b-blocks')} background={background} onChange={val => updateFeature(index, 'background', val)} />

                        {isIcon && <>
                            <ToggleControl label={__('Upload Icon?', 'b-blocks')} checked={isUpIcon} onChange={val => updateFeature(index, 'isUpIcon', val)} />

                            {isUpIcon ? <>
                                <ImageHolderControl className='mt-20p' label={__('Icon:', 'b-blocks')} img={upIcon} onChange={val => updateFeature(index, 'upIcon', val)} />

                                <UnitControl className='mt-20p' label={__('Icon Width:', 'b-blocks')} labelPosition='left' value={iconWidth} onChange={val => updateFeature(index, 'iconWidth', val)} units={[pxUnit, perUnit, emUnit]} />

                            </> : <IconControl icon={icon} onChange={val => updateFeature(index, 'icon', val)} defaults={{ class: 'fa fa-wordpress', fontSize: 120 }} />} </>}

                        <BColor label={__('Title Color:', 'b-blocks')} value={titleColor} onChange={val => updateFeature(index, 'titleColor', val)} defaultColor='#333' />

                        <SeparatorControl separator={separator} onChange={val => updateFeature(index, 'separator', val)} defaults={{ width: '20%' }} />

                        <BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateFeature(index, 'descColor', val)} defaultColor='#333' />

                        <Button className='mt-20p removeItem' label={__('Remove this feature', 'b-blocks')} onClick={e => {
                            e.preventDefault();
                            setAttributes({ features: [...features.slice(0, index), ...features.slice(index + 1)] });
                        }} ><Dashicon icon='no' size={23} />{__('Remove this feature', 'b-blocks')}</Button>
                    </PanelBody>
                })}

                <div className='addItem'>
                    <Button label={__('Add New Feature', 'b-blocks')} onClick={addFeature} ><Dashicon icon='plus' size={23} />{__('Add New Feature', 'b-blocks')}</Button>
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
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
                <SpaceControl label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '20px' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Icon', 'b-blocks')} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

                {isIcon && <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={iconMargin} onChange={val => setAttributes({ iconMargin: val })} defaults={{ side: 4, bottom: '20px' }} />}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Title', 'b-blocks')} checked={isTitle} onChange={val => setAttributes({ isTitle: val })} />

                {isTitle && <>
                    <Typography className='mt-20p' typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 20 }} />

                    <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
                </>}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                {isSep && <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '10px' }} />}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                {isDesc && <Typography className='mt-20p' typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />}
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <ToolbarGroup className='bBlocksToolbar'>
                <ToolbarButton label={__('Add New Feature', 'b-blocks')} onClick={addFeature}><Dashicon icon='plus' size={23} /></ToolbarButton>
            </ToolbarGroup>

            <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
        </BlockControls>
    </>;
};

export default Settings;