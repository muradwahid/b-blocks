import { __experimentalBorderBoxControl as BorderBoxControl, Flex, PanelBody, RangeControl, TabPanel } from '@wordpress/components';
import { withSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { BoxControl, ColorControl, Device } from '../../../../../../../../bpl-tools/Components';
import { tabController } from '../../../../../../../../bpl-tools/utils/functions';
import { normalHoverTabs } from '../../../../../../utils/options';

const ArrowStyles = ({ attributes, device, updateObj }) => {
    const { arrows } = attributes;

    return (
        <PanelBody className='bPlPanelBody' title={__('Arrows', 'b-blocks')} initialOpen={false} >

            <RangeControl className='mt10' label={<Flex>{__('Arrows Size', 'b-blocks')} <Device /></Flex>} value={arrows.size[device]} onChange={(value) => updateObj('arrows', value, 'size', device)} />

            <RangeControl className='mt10' label={<Flex>{__('Align Left Arrow', 'b-blocks')} <Device /></Flex>} value={arrows.alignLeft[device]} onChange={(value) => updateObj('arrows', value, 'alignLeft', device)} min={-50} max={200} />

            <RangeControl className='mt10' label={<Flex>{__('Align Right Arrow', 'b-blocks')} <Device /></Flex>} value={arrows.alignRight[device]} onChange={(value) => updateObj('arrows', value, 'alignRight', device)} min={-50} max={200} />

            <BoxControl label={<Flex>{__('Padding', 'b-blocks')} <Device /></Flex>} values={arrows.padding[device]} onChange={(value) => updateObj('arrows', value, 'padding', device)} />

            <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={normalHoverTabs} onSelect={tabController}>
                {
                    (tab) => <>
                        <ColorControl label={__('Background', 'b-blocks')} value={arrows[tab.name].bg} onChange={(value) => updateObj('arrows', value, tab.name, 'bg')} />

                        <ColorControl label={__('Color', 'b-blocks')} value={arrows[tab.name].color} onChange={(value) => updateObj('arrows', value, tab.name, 'color')} />

                        <BorderBoxControl label={__('Border', 'b-blocks')} value={arrows[tab.name].border} onChange={(value) => updateObj('arrows', value, tab.name, 'border')} />

                        <BoxControl label={__('Border Radius', 'b-blocks')} values={arrows[tab.name].borderRadius} onChange={(value) => updateObj('arrows', value, tab.name, 'borderRadius')} />
                    </>
                }
            </TabPanel>

        </PanelBody>
    );
};

export default withSelect((select) => {
    const { getDeviceType } = select('core/editor');

    return {
        device: getDeviceType()?.toLowerCase(),
    };
})(ArrowStyles);
