import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Variables
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import BtnGroup from '../../../../Components/BtnGroup';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ColorsControl from '../../../../Components/ColorsControl';
import IconControl from '../../../../Components/IconControl';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;
const sepTypes = [
    { label: 'Icon', value: 'icon', icon: 'Icon' },
    { label: 'Text', value: 'text', icon: 'Text' }
];
const btnGroupTabs = [
    { name: 'btn-one', title: __('Button One', 'b-blocks') },
    { name: 'btn-two', title: __('Button Two', 'b-blocks') }
];

const Settings = ({ settings }) => {
    const { attributes: { width, btnAlign, btnType, btnTypo, btnPadding, btnOneLink, btnOneBorder, btnOneColors, btnOneHovColors, btnTwoLink, btnTwoBorder, btnTwoColors, btnTwoHovColors, isSep, sepType, sepText, sepTextTypo, sepTextColor, sepIcon, sepBGColor }, setAttributes } = settings;

    return <>
        <InspectorControls>
            <PanelBody className='bPlPanelBody' title={__('Button Settings', 'b-blocks')}>
                {/* Width */}
                <UnitControl label={__('Container Width:', 'b-blocks')} labelPosition='left' value={width} onChange={val => setAttributes({ width: val })} units={[pxUnit, perUnit, emUnit]} />

                {/* Button Type */}
                <PanelRow>
                    <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                    <BtnGroup value={btnType} onChange={val => {
                        setAttributes({ btnType: val });
                        'fill' === val && setAttributes({
                            btnOneColors: { ...btnOneColors, color: '#fff', bg: '#4527a4', styles: 'color: #fff; background: #4527a4;' },
                            btnOneBorder: { ...btnOneBorder, width: '0px', color: '#0000', styles: '' },
                            btnTwoColors: { ...btnTwoColors, color: '#fff', bg: '#8344c5', styles: 'color: #fff; background: #8344c5;' },
                            btnTwoBorder: { ...btnTwoBorder, width: '0px', color: '#0000', styles: '' }
                        });
                        'outline' === val && setAttributes({
                            btnOneColors: { ...btnOneColors, color: '#4527a4', bg: '#0000', styles: 'color: #4527a4; background: #0000;' },
                            btnOneBorder: { ...btnOneBorder, width: '3px', color: '#4527a4', styles: 'border: 3px solid #4527a4;' },
                            btnTwoColors: { ...btnTwoColors, color: '#8344c5', bg: '#0000', styles: 'color: #8344c5; background: #0000;' },
                            btnTwoBorder: { ...btnTwoBorder, width: '3px', color: '#8344c5', styles: 'border: 3px solid #8344c5;' }
                        });
                    }} options={[
                        { label: __('Fill', 'b-blocks'), value: 'fill', icon: 'FILL' },
                        { label: __('Outline', 'b-blocks'), value: 'outline', icon: 'OUTLINE' }
                    ]} />
                </PanelRow>
                <small>{__('Some settings may change when type will be changed.', 'b-blocks')}</small>

                {/* Typography */}
                <Typography typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 16 }} />

                {/* Padding */}
                <SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '30px' }} />

                <Title>{__('Buttons:', 'b-blocks')}</Title>
                <TabPanel className='bPlTabPanel' activeClass='activeTab' tabs={btnGroupTabs}>{tab => <>
                    {'btn-one' == tab.name && <>
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Link:', 'b-blocks')}</Title>
                            <TextControl value={btnOneLink} onChange={val => setAttributes({ btnOneLink: val })} />
                        </PanelRow>

                        <BorderControl label={__('Border', 'b-blocks')} border={btnOneBorder} onChange={val => setAttributes({ btnOneBorder: val })} defaults={{ radius: '50px' }} />

                        <ColorsControl colors={btnOneColors} onChange={val => setAttributes({ btnOneColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

                        <ColorsControl label={__('Hover Colors:', 'b-blocks')} colors={btnOneHovColors} onChange={val => setAttributes({ btnOneHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />
                    </>}

                    {'btn-two' == tab.name && <>
                        <PanelRow>
                            <Title mt='0' mb='0'>{__('Link:', 'b-blocks')}</Title>
                            <TextControl value={btnTwoLink} onChange={val => setAttributes({ btnTwoLink: val })} />
                        </PanelRow>

                        <BorderControl label={__('Border', 'b-blocks')} border={btnTwoBorder} onChange={val => setAttributes({ btnTwoBorder: val })} defaults={{ radius: '50px' }} />

                        <ColorsControl colors={btnTwoColors} onChange={val => setAttributes({ btnTwoColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

                        <ColorsControl label={__('Hover Colors:', 'b-blocks')} colors={btnTwoHovColors} onChange={val => setAttributes({ btnTwoHovColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />
                    </>}
                </>}
                </TabPanel>
            </PanelBody>

            <PanelBody className='bPlPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                {isSep && <>
                    <PanelRow>
                        <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                        <BtnGroup value={sepType} onChange={val => setAttributes({ sepType: val })} options={sepTypes} />
                    </PanelRow>

                    {/* Separator Text */}
                    {'text' === sepType && <>
                        <Title>{__('Separator Text:', 'b-blocks')}</Title>
                        <TextControl value={sepText} onChange={val => setAttributes({ sepText: val })} />

                        {/* Text Typography */}
                        <Typography label={__('Text Typography', 'b-blocks')} typography={sepTextTypo} onChange={val => setAttributes({ sepTextTypo: val })} defaults={{ fontSize: 15 }} />

                        {/* Text Color */}
                        <BColor label={__('Text Color:', 'b-blocks')} value={sepTextColor} onChange={val => setAttributes({ sepTextColor: val })} defaultColor='#333' />
                    </>}

                    {/* Icon */}
                    {'icon' === sepType && <IconControl icon={sepIcon} onChange={val => setAttributes({ sepIcon: val })} defaults={{ class: 'fa fa fa-arrows-alt-h', fontSize: 20, color: '#333' }} />}

                    {/* Background Color */}
                    <BColor label={__('Background Color:', 'b-blocks')} value={sepBGColor} onChange={val => setAttributes({ sepBGColor: val })} defaultColor='#fff' />
                </>}
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={btnAlign} onChange={val => setAttributes({ btnAlign: val })} describedBy={__('Button Group Align')} alignmentControls={[
                { title: __('Button Group in left', 'b-blocks'), align: 'left', icon: 'align-left' },
                { title: __('Button Group in center', 'b-blocks'), align: 'center', icon: 'align-center' },
                { title: __('Button Group in right', 'b-blocks'), align: 'right', icon: 'align-right' }
            ]} />
        </BlockControls>
    </>;
};
export default Settings;