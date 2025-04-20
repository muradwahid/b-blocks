import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, RangeControl, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { Background, BoxControl, ColorControl, ColorsControl, Device, Typography } from '../../../../../../../bpl-tools/Components';
import { SpaceControl } from '../../../../../../../bpl-tools/Components/Deprecated';
import { BControlPro } from '../../../../../../../bpl-tools/ProControls';
import { tabController } from '../../../../../../../bpl-tools/utils/functions';
import { emUnit, normalHoverTabs, perUnit, pxUnit, vwUnit } from '../../../../../../../bpl-tools/utils/options';
import { sliderStyleTab } from '../../../../utils/options';

const Styles = ({ attributes, isPremium, setIsProModalOpen, updateObj, device }) => {
    const { styles, width, isLabel, labelTypo, labelColors, labelPadding, isCap, capTypo, capColors, capPadding, theme, sliderOptions, sliderStyle } = attributes;
    const { container, dragg } = styles;
    const { height } = sliderOptions;
    const { pagination, navigation } = sliderStyle;
    return (
        <>
            <PanelBody title={__("Container", "image-compare")} className='bPlPanelBody'>
                <UnitControl label={__('Width:', 'image-compare')} labelPosition='left' value={width} onChange={val => updateObj("width", val)} units={[pxUnit(), perUnit(), emUnit(), vwUnit()]} />

                {theme === "default" && <UnitControl className='mt10' label={<Flex>{__('Height:', 'image-compare')}<Device /></Flex>} value={container.height[device]} onChange={val => updateObj("styles", val, "container", "height", device)} units={[pxUnit(), emUnit(), vwUnit()]} />}

                {theme === "slider" && <UnitControl className='mt10' label={<Flex>{__('Height:', 'image-compare')}<Device /></Flex>} value={height[device]} onChange={val => updateObj("sliderOptions", val, "height", device)} units={[pxUnit(), emUnit(), vwUnit()]} />}

            </PanelBody>

            {isLabel && <>
                <PanelBody className='bPlPanelBody' title={__('Labels', 'image-compare')} initialOpen={false}>

                    <Typography value={labelTypo} onChange={val => updateObj('labelTypo', val)} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 } }} />

                    <ColorsControl value={labelColors} onChange={val => updateObj('labelColors', val)} defaults={{ color: '#fff', bg: '#00000080' }} />

                    <SpaceControl className='mt20' label={__('Padding:', 'image-compare')} value={labelPadding} onChange={val => updateObj('labelPadding', val)} defaults={{ vertical: '10px', horizontal: '15px' }} />
                </PanelBody>
            </>}


            {isCap && <>
                <PanelBody className='bPlPanelBody' title={__('Caption', 'image-compare')} initialOpen={false}>

                    <Typography value={capTypo} onChange={val => updateObj('capTypo', val)} defaults={{ fontSize: { desktop: 14, tablet: 14, mobile: 14 } }} />

                    <ColorsControl value={capColors} onChange={val => updateObj('capColors', val)} defaults={{ color: '#333', bg: '#f4f4f4' }} />

                    <SpaceControl className='mt20' label={__('Padding:', 'image-compare')} value={capPadding} onChange={val => updateObj('capPadding', val)} defaults={{ vertical: '10px', horizontal: '15px' }} />
                </PanelBody>
            </>}
            <PanelBody className='bPlPanelBody' title={__('Divider', 'image-compare')} initialOpen={false}>

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Line Size', 'image-compare')} min={1} max={10} step={1} value={dragg.line.size} onChange={val => updateObj('styles', val, 'dragg', 'line', 'size')} Component={RangeControl} />

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Line Color', 'image-compare')} value={dragg.line.bg} onChange={val => updateObj('styles', val, 'dragg', 'line', 'bg')} isImage={false} Component={Background} />

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Handler Color', 'image-compare')} value={dragg.handler.color} onChange={val => updateObj('styles', val, 'dragg', 'handler', 'color')} Component={ColorControl} />

                <BControlPro isPremium={isPremium} setIsProModalOpen={setIsProModalOpen} label={__('Icon Color', 'image-compare')} value={dragg.icon.color} onChange={val => updateObj('styles', val, 'dragg', 'icon', 'color')} isImage={false} Component={ColorControl} />
            </PanelBody>

            {theme === "slider" && <PanelBody className='bPlPanelBody' title={__('Slider Styles', 'image-compare')} initialOpen={false}>
                <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={sliderStyleTab} onSelect={tabController}>
                    {tab => <>
                        {tab.name === "navigation" && <>
                            <TabPanel className='bPlTabPanel mini mt10' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
                                {tab => <>
                                    {tab.name === "normal" && <>
                                        <BControlPro {...{ isPremium, setIsProModalOpen }} className='mt10' labelPosition='edge' label={__("Container Width", "image-compare")} value={navigation.container.width} onChange={val => updateObj("sliderStyle", val, "navigation", "container", "width")} Component={UnitControl} />

                                        <BControlPro {...{ isPremium, setIsProModalOpen }} className='mt10' labelPosition='edge' label={__("Container Height", "image-compare")} value={navigation.container.height} onChange={val => updateObj("sliderStyle", val, "navigation", "container", "height")} Component={UnitControl} />
                                    </>
                                    }
                                    <BControlPro {...{ isPremium, setIsProModalOpen }} className='mt10' labelPosition='edge' label={__("Icon Size", "image-compare")} value={navigation.icon[tab.name].size} onChange={(val) => updateObj("sliderStyle", val, "navigation", "icon", tab.name, "size")} Component={UnitControl} />

                                    <BControlPro {...{ isPremium, setIsProModalOpen }} label={__("Icon Color", "image-compare")} value={navigation.icon[tab.name].color} onChange={(val) => updateObj("sliderStyle", val, "navigation", "icon", tab.name, "color")} Component={ColorControl} />

                                    <BControlPro {...{ isPremium, setIsProModalOpen }} label={__("Background", "image-compare")} value={navigation.container[tab.name].bg} onChange={(val) => updateObj("sliderStyle", val, "navigation", "container", tab.name, "bg")} Component={Background} />

                                    <BControlPro {...{ isPremium, setIsProModalOpen }} label={__("Border", "image-compare")} value={navigation.container[tab.name].border} onChange={(val) => updateObj("sliderStyle", val, "navigation", "container", tab.name, "border")} Component={BorderBoxControl} />

                                    <BControlPro {...{ isPremium, setIsProModalOpen }} className="mt10" label={__("Border Radius", "image-compare")} values={navigation.container[tab.name].radius} onChange={(val) => updateObj("sliderStyle", val, "navigation", "container", tab.name, "radius")} Component={BoxControl} />
                                </>}
                            </TabPanel>
                        </>}
                        {tab.name === "pagination" && <>
                            <BControlPro {...{ isPremium, setIsProModalOpen }} label={__("Active Color", "image-compare")} value={pagination.active} onChange={val => updateObj("sliderStyle", val, "pagination", "active")} Component={ColorControl} />
                        </>}
                    </>}
                </TabPanel>
            </PanelBody>}

        </>
    );
};
export default compose(
    withSelect((select) => {
        const { getDeviceType } = select('core/editor');

        return {
            device: getDeviceType()?.toLowerCase(),
        };
    }),
)(Styles);