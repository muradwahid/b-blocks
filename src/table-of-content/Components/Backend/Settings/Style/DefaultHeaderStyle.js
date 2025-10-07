import { PanelBody, RangeControl, TabPanel, ToggleControl } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { BoxControl, ColorControl, Device } from '../../../../../../../bpl-tools/Components';
import { tabController, updateData } from '../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../../bpl-tools/utils/options';
import RangeUnitControl from '../../Panel/RangeUnitControl/RangeUnitControl';

const DefaultHeaderStyle = ({ attributes, setAttributes, device }) => {
    const { header, boxList, markup } = attributes;

    return <>
        <PanelBody className='bPlPanelBody' title={__('Header', 'b-blocks')} initialOpen={true}>
            <ColorControl
                label={__('Background Color', 'b-blocks')}
                value={header.bgColor}
                colors={[
                    { name: 'red', color: '#f00' },
                    { name: 'white', color: '#fff' },
                    { name: 'blue', color: '#00f' },
                ]}
                onChange={(value) =>
                    setAttributes({
                        header: updateData(header, value, 'bgColor'),
                    })
                }
            />
            <ColorControl
                label={__('Text Color', 'b-blocks')}
                value={header.txtColor}
                colors={[
                    { name: 'red', color: '#f00' },
                    { name: 'white', color: '#fff' },
                    { name: 'blue', color: '#00f' },
                ]}
                onChange={(value) =>
                    setAttributes({
                        header: updateData(header, value, 'txtColor'),
                    })
                }
            />
            <ColorControl
                label={__('Icon Color', 'b-blocks')}
                value={header.iconColor}
                colors={[
                    { name: 'red', color: '#f00' },
                    { name: 'white', color: '#fff' },
                    { name: 'blue', color: '#00f' },
                ]}
                onChange={(value) =>
                    setAttributes({
                        header: updateData(header, value, 'iconColor'),
                    })
                }
            />
            <RangeControl
                label={__('Separator Width', 'b-blocks')}
                value={header.separatorWidth}
                onChange={(value) =>
                    setAttributes({
                        header: updateData(header, value, 'separatorWidth'),
                    })
                }
                min={0}
                max={100}
                step={1}
            />
            <ColorControl
                label={__('Separator Color', 'b-blocks')}
                value={header.separatorColor}
                defaults='#ccc'
                colors={[
                    { name: 'red', color: '#f00' },
                    { name: 'white', color: '#fff' },
                    { name: 'blue', color: '#00f' },
                ]}
                onChange={(value) =>
                    setAttributes({
                        header: updateData(header, value, 'separatorColor'),
                    })
                }
            />
        </PanelBody>

        <PanelBody className='bPlPanelBody' title={__('List Item', 'b-blocks')} initialOpen={false}>
            <div style={{ marginTop: '10px' }} className='panelPosition'>
                <Device className='devicePosition' style={{ left: '60px', top: '0px' }} />
                <BoxControl
                    label={__('Padding', 'b-blocks')}
                    values={boxList.padding[device]}
                    resetValues={{
                        top: '0px',
                        left: '20px',
                        right: '0px',
                        bottom: '0px',
                    }}
                    onChange={(value) =>
                        setAttributes({
                            boxList: updateData(boxList, value, 'padding', device),
                        })
                    }
                />
            </div>

            <div style={{ marginTop: '10px' }} className='panelPosition'>
                <Device className='devicePosition' style={{ left: '80px', top: '0px' }} />
                <RangeControl
                    label={__('Max Height', 'b-blocks')}
                    value={boxList.maxHeight[device]}
                    onChange={(value) =>
                        setAttributes({
                            boxList: updateData(boxList, value, 'maxHeight', device),
                        })
                    }
                    min={0}
                    max={1000}
                    step={1}
                />
            </div>

            <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
                {tab => <>
                    {tab.name === 'normal' && <>
                        <ColorControl
                            label={__('Text Color', 'b-blocks')}
                            value={boxList.nTxtColor}
                            colors={[
                                { name: 'red', color: '#f00' },
                                { name: 'white', color: '#fff' },
                                { name: 'blue', color: '#00f' },
                            ]}
                            onChange={(value) =>
                                setAttributes({
                                    boxList: { ...boxList, nTxtColor: value },
                                })
                            }
                        />
                        <div style={{ marginTop: '10px' }}>
                            <ToggleControl
                                label={__('Underline', 'b-blocks')}
                                checked={boxList.nTxtDecoration}
                                onChange={(value) =>
                                    setAttributes({
                                        boxList: {
                                            ...boxList,
                                            nTxtDecoration: value,
                                        },
                                    })
                                }
                            />
                        </div>
                    </>}
                    {tab.name === 'hover' && <>
                        <ColorControl
                            label={__('Text Color', 'b-blocks')}
                            value={boxList.hTxtColor}
                            colors={[
                                { name: 'red', color: '#f00' },
                                { name: 'white', color: '#fff' },
                                { name: 'blue', color: '#00f' },
                            ]}
                            onChange={(value) =>
                                setAttributes({
                                    boxList: { ...boxList, hTxtColor: value },
                                })
                            }
                        />
                        <div style={{ marginTop: '10px' }}>
                            <ToggleControl
                                label={__('Underline', 'b-blocks')}
                                checked={boxList.hTxtDecoration}
                                onChange={(value) =>
                                    setAttributes({
                                        boxList: {
                                            ...boxList,
                                            hTxtDecoration: value,
                                        },
                                    })
                                }
                            />
                        </div>
                    </>}
                </>}
            </TabPanel>
            <div
                style={{
                    borderTop: '1px solid #ccc',
                    margin: '15px 0',
                    paddingTop: '10px',
                }}
            >
                <strong>Marker</strong>
            </div>
            <ColorControl
                label={__('Color', 'b-blocks')}
                value={markup.color}
                colors={[
                    { name: 'red', color: '#f00' },
                    { name: 'white', color: '#fff' },
                    { name: 'blue', color: '#00f' },
                ]}
                onChange={(value) =>
                    setAttributes({
                        markup: updateData(markup, value, 'color'),
                    })
                }
            />
            <div style={{ marginTop: '10px' }}>
                <div style={{ marginTop: '10px' }} className='panelPosition'>
                    <Device className='devicePosition' />
                    <RangeUnitControl
                        label={__('Size', 'b-blocks')}
                        value={markup.markupSize[device]}
                        min={0}
                        step={1}
                        max={markup.markupSize[device].includes('px') ? 50 : 100}
                        onChange={(value) =>
                            setAttributes({
                                markup: updateData(markup, value, 'markupSize', device),
                            })
                        }
                    />
                </div>
            </div>
        </PanelBody>
    </>
};

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(DefaultHeaderStyle);