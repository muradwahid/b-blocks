import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { TabPanel, PanelBody, PanelRow, TextControl, RangeControl, ToolbarGroup, ToolbarButton, __experimentalUnitControl as UnitControl, Button, Dashicon, __experimentalNumberControl as NumberControl } from '@wordpress/components';

// Variables
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BDevice from '../../../../Components/BDevice';
import ShadowControl from '../../../../Components/ShadowControl';
import SpaceControl from '../../../../Components/SpaceControl';
import options from '../../Const/options';
const { generalStyleTabs, pxUnit, perUnit, emUnit } = options;

import icons from '../../Const/icons';

const Settings = ({ attributes, setAttributes, updatePriceTable, setActiveIndex }) => {
    const { pricingTables, columns, columnGap, rowGap, textAlign, padding, shadow } = attributes;

    const [device, setDevice] = useState('desktop');

    const addPricingTable = () => {
        setAttributes({
            pricingTables: [...pricingTables, {
                name: 'Ultimate',
                price: 14.99,
                priceCurrency: '$',
                period: 'Month',
                link: '#',
                linkLabel: 'Enroll Now',
                color: '#4527a4',
                features: [
                    {
                        isEnable: true,
                        label: 'Unlimited Disk Space'
                    },
                    {
                        isEnable: true,
                        label: 'Unlimited Website'
                    },
                    {
                        isEnable: true,
                        label: 'Unlimited Email Accounts'
                    },
                    {
                        isEnable: true,
                        label: 'Unlimited Bandwidth'
                    },
                    {
                        isEnable: true,
                        label: 'Unlimited Subdomains'
                    },
                    {
                        isEnable: true,
                        label: 'Maintenance'
                    }
                ]
            }]
        });
        setActiveIndex(updatePriceTable.length);
    }


    return <>
        <InspectorControls>
            <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={generalStyleTabs}>{tab => <>
                {'general' === tab.name && <>
                    <PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Prices', 'b-blocks')}>
                        {pricingTables?.map((priceTable, index) => {
                            const { price, priceCurrency, link, color } = priceTable;

                            return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Price No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
                                <NumberControl label={__('Price:', 'b-blocks')} labelPosition='left' value={price} onChange={val => updatePriceTable(index, 'price', val)} />

                                <PanelRow>
                                    <Title mt='0' mb='0'>{__('Currency:', 'b-blocks')}</Title>
                                    <TextControl value={priceCurrency} onChange={val => updatePriceTable(index, 'priceCurrency', val)} />
                                </PanelRow>

                                <Title>{__('Link:', 'b-blocks')}</Title>
                                <TextControl value={link} onChange={val => updatePriceTable(index, 'link', val)} />

                                <BColor label={__('Color:', 'b-blocks')} value={color} onChange={val => updatePriceTable(index, 'color', val)} defaultColor='#4527a4' />

                                <PanelRow className='itemAction mt20'>
                                    <Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
                                        e.preventDefault();
                                        setAttributes({ pricingTables: [...pricingTables.slice(0, index), ...pricingTables.slice(index + 1)] });
                                    }} ><Dashicon icon='no' size={18} />{__('Remove', 'b-blocks')}</Button>

                                    <Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
                                        e.preventDefault();
                                        setAttributes({ pricingTables: [...pricingTables, { ...pricingTables[index] }] });
                                    }} >{icons.gearSettings}{__('Duplicate', 'b-blocks')}</Button>
                                </PanelRow>
                            </PanelBody>
                        })}

                        <div className='addItem'>
                            <Button label={__('Add New Price', 'b-blocks')} onClick={addPricingTable}><Dashicon icon='plus' size={23} />{__('Add New Price', 'b-blocks')}</Button>
                        </div>
                    </PanelBody>


                    <PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
                        {/* Columns */}
                        <PanelRow className='mt20'>
                            <Title mt='0'>{__('Columns:', 'b-blocks')}</Title>
                            <BDevice device={device} onChange={val => setDevice(val)} />
                        </PanelRow>
                        <RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

                        <UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit, perUnit, emUnit]} />

                        <UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit, perUnit, emUnit]} />
                    </PanelBody>
                </>}

                {'style' === tab.name && <>
                    <PanelBody className='bPlPanelBody' title={__('Pricing Table', 'b-blocks')}>
                        <SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '35px', horizontal: '25px' }} />

                        <ShadowControl mt='20' label={__('Shadow:', 'b-blocks')} shadow={shadow} onChange={val => setAttributes({ shadow: val })} defaults={{ blur: '30px', color: '#6e8faf4d' }} />
                    </PanelBody>
                </>}
            </>}</TabPanel>
        </InspectorControls>


        <BlockControls>
            <ToolbarGroup className='bPlToolbar'>
                <ToolbarButton label={__('Add New Counter', 'b-blocks')} onClick={addPricingTable}><Dashicon icon='plus' size={23} /></ToolbarButton>
            </ToolbarGroup>

            <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
        </BlockControls>
    </>;
};
export default Settings;