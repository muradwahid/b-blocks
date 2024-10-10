import { PanelBody, PanelRow, TabPanel } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { produce } from 'immer';
import React from 'react';
import { BorderControl, Label, MultiShadowControl, BoxControl } from '../../../../../../../Components';
import { updateData } from '../../../../utils/functions';
import { Overlay } from '../../../../../../../bpl-tools/Components/Overlay/Overlay';
import { Device } from '../../../../../../../bpl-tools/Components/Device/Device';
import { borderTabs } from '../../../../utils/options';
import { AdvBackground } from '../../../../../../../bpl-tools/Components/AdvBackground/AdvBackground';


const Style = ({ attributes, setAttributes }) => {
    const { wrapper, background2, overlay } = attributes;
    const [device, setDevice] = useState('desktop');
    const { border, shadow } = wrapper;
    const { normalBorder, hoverBorder } = border;
    const { normal, hover } = shadow;


    return (
        <Fragment>

            {/* Background Settings */}
            <PanelBody className='bPlPanelBody' title={__("Background", "b-blocks")} initialOpen={false}>
                <AdvBackground value={background2} onChange={val => setAttributes({ background2: val })} />


                {/* Overly */}
                <Overlay value={overlay} onChange={val => setAttributes({ overlay: val })} />
            </PanelBody>

            {/* Border & Shadow Settings */}
            <PanelBody className='bPlPanelBody' title={__("Border & Shadow", "b-blocks")} initialOpen={false}>
                <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={borderTabs}>
                    {tab => <>
                        {'normal' === tab.name && <>
                            {/*Normal Border Control */}
                            <BorderControl label={__('Normal Border:', 'b-block')} value={normalBorder}
                                onChange={val => {
                                    const newBorder = produce(wrapper, draft => {
                                        draft.border.normalBorder = val
                                    })
                                    setAttributes({ wrapper: newBorder })
                                }} defaults={{ radius: '5px' }} />

                            {/* Normal Shadow Control Here */}
                            <MultiShadowControl
                                label={__("Normal Shadow", "b-block")}
                                value={normal}
                                onChange={(value) => {
                                    const newShadow = produce(wrapper, draft => {
                                        draft.shadow.normal = value
                                    })
                                    setAttributes({ wrapper: newShadow })
                                }}
                                defaults={[
                                    { hOffset: '0px', vOffset: '0px', blur: '0px', spreed: '0px', color: '#7090b0', isInset: false },
                                ]}
                            />
                        </>}

                        {'hover' === tab.name && <>
                            <BorderControl label={__('Hover Border:', 'b-block')} value={hoverBorder}
                                onChange={val => {
                                    const newBorder = produce(wrapper, draft => {
                                        draft.border.hoverBorder = val
                                    })
                                    setAttributes({ wrapper: newBorder })
                                }} defaults={{ radius: '5px' }} />

                            {/* Hover Shadow Control Here */}
                            <MultiShadowControl
                                label={__("Hover Shadow", "b-block")}
                                value={hover}
                                onChange={(value) => {
                                    const newShadow = produce(wrapper, draft => {
                                        draft.shadow.hover = value
                                    })
                                    setAttributes({ wrapper: newShadow })
                                }}
                                defaults={[
                                    { hOffset: '0px', vOffset: '0px', blur: '0px', spreed: '0px', color: '#7090b0', isInset: false },
                                ]}
                            />
                        </>}
                    </>}
                </TabPanel>
            </PanelBody>
        </Fragment >
    );
};

export default Style;