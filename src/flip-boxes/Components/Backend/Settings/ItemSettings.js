import { __ } from '@wordpress/i18n';
import { TabPanel, PanelBody, TextareaControl, ToggleControl, TextControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

//bpl tools
import { Background, ColorControl, ColorsControl, IconControl, InlineDetailMediaUpload, Label } from '../../../../../../bpl-tools/Components';
import { BorderControl, ShadowControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { emUnit, perUnit, pxUnit } from '../../../../../../bpl-tools/utils/options';
import { updateAttributes } from '../../../../../../bpl-tools/utils/functions';

const frontBackTab = [
    { name: 'front', title: __('Front', 'b-blocks') },
    { name: 'back', title: __('Back', 'b-blocks') }
];
const ItemSettings = (props) => {
    const { attributes, setAttributes, index } = props;
    const { boxes = [], isIcon } = attributes;
    const { frontBG = {}, backBG = {}, border = {}, shadow = {}, isFrontUpIcon = false, frontIcon = {}, upFrontIcon = {}, frontIconWidth = '70px', isBackUpIcon = false, backIcon = {}, upBackIcon = {}, backIconWidth = '70px', frontTitle = '', frontTitleColor = '', backTitle = '', backTitleColor = '', desc = '', descColor = '', btn = '', btnLink = '', btnBorder = {}, btnColors = {}, btnHovColors = {} } = boxes?.[index] || {};



    const updateFlipBox = (type, val) => {
        // const newBoxes = produce(boxes, draft => {
        //     draft[activeIndex][type] = val;
        // });
        // setAttributes({ boxes: newBoxes });
        const update = updateAttributes(attributes, setAttributes)
        update('boxes', val, index, type);
    }


    return <>
        <BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => updateFlipBox('border', val)} />

        <ShadowControl label={__('Shadow:', 'b-blocks')} value={shadow} onChange={val => updateFlipBox('shadow', val)} />

        <TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={frontBackTab}>{tab => <>
            {'front' == tab.name && <>
                <PanelBody className='bPlPanelBody' title={__('Front Box', 'b-blocks')}>
                    <Background label={__('Background:', 'b-blocks')} value={frontBG} onChange={val => updateFlipBox('frontBG', val)} />
                </PanelBody>

                {isIcon && <PanelBody className='bPlPanelBody' title={__('Front Icon', 'b-blocks')} initialOpen={false}>
                    <ToggleControl label={__('Upload Icon?', 'b-blocks')} checked={isFrontUpIcon} onChange={val => updateFlipBox('isFrontUpIcon', val)} />

                    {isFrontUpIcon ? <>
                        <Label>{__('Icon:', 'b-blocks')}</Label>
                        <InlineDetailMediaUpload value={upFrontIcon} onChange={val => updateFlipBox('upFrontIcon', val)} placeholder={__('Enter Icon URL', 'b-blocks')} />

                        <UnitControl className='mt20' label={__('Icon Width:', 'b-blocks')} labelPosition='left' value={frontIconWidth} onChange={val => updateFlipBox('frontIconWidth', val)} units={[pxUnit(), perUnit(), emUnit()]} />

                    </> : <IconControl value={frontIcon} onChange={val => updateFlipBox('frontIcon', val)} defaults={{ class: 'fa fa-sync-alt', fontSize: 70, color: '#fff' }} />}
                </PanelBody>}

                <PanelBody className='bPlPanelBody' title={__('Front Title', 'b-blocks')} initialOpen={false}>
                    <Label className='mb5'>{__('Text:', 'b-blocks')}</Label>
                    <TextControl value={frontTitle} onChange={val => updateFlipBox('frontTitle', val)} />

                    <ColorControl label={__('Color:', 'b-blocks')} value={frontTitleColor} onChange={val => updateFlipBox('frontTitleColor', val)} defaultColor='#fff' />
                </PanelBody>

                <PanelBody className='bPlPanelBody' title={__('Description', 'b-blocks')} initialOpen={false}>
                    <Label className='mb5'>{__('Text:', 'b-blocks')}</Label>
                    <TextareaControl value={desc} onChange={val => updateFlipBox('desc', val)} />

                    <ColorControl label={__('Color:', 'b-blocks')} value={descColor} onChange={val => updateFlipBox('descColor', val)} defaultColor='#fff' />
                </PanelBody>
            </>}

            {'back' == tab.name && <>
                <PanelBody className='bPlPanelBody' title={__('Back Box', 'b-blocks')}>
                    <Background label={__('Background:', 'b-blocks')} value={backBG} onChange={val => updateFlipBox('backBG', val)} />
                </PanelBody>

                {isIcon && <PanelBody className='bPlPanelBody' title={__('Back Icon', 'b-blocks')} initialOpen={false}>
                    <ToggleControl label={__('Upload Icon?', 'b-blocks')} checked={isBackUpIcon} onChange={val => updateFlipBox('isBackUpIcon', val)} />

                    {isBackUpIcon ? <>
                        <Label>{__('Icon:', 'b-blocks')}</Label>
                        <InlineDetailMediaUpload value={upBackIcon} onChange={val => updateFlipBox('upBackIcon', val)} placeholder={__('Enter Icon URL', 'b-blocks')} />

                        <UnitControl className='mt20' label={__('Icon Width:', 'b-blocks')} labelPosition='left' value={backIconWidth} onChange={val => updateFlipBox('backIconWidth', val)} units={[pxUnit(), perUnit(), emUnit()]} />

                    </> : <IconControl value={backIcon} onChange={val => updateFlipBox('backIcon', val)} defaults={{ class: 'fa fa-wordpress', fontSize: 70, color: '#fff' }} />}
                </PanelBody>}

                <PanelBody className='bPlPanelBody' title={__('Back Title', 'b-blocks')} initialOpen={false}>
                    <Label className='mb5'>{__('Text:', 'b-blocks')}</Label>
                    <TextControl value={backTitle} onChange={val => updateFlipBox('backTitle', val)} />

                    <ColorControl label={__('Color:', 'b-blocks')} value={backTitleColor} onChange={val => updateFlipBox('backTitleColor', val)} defaultColor='#fff' />
                </PanelBody>

                <PanelBody className='bPlPanelBody' title={__('Button', 'b-blocks')} initialOpen={false}>
                    <Label className='mb5'>{__('Text:', 'b-blocks')}</Label>
                    <TextControl value={btn} onChange={val => updateFlipBox('btn', val)} />

                    <Label>{__('Link:', 'b-blocks')}</Label>
                    <TextControl value={btnLink} onChange={val => updateFlipBox('btnLink', val)} />

                    <BorderControl label={__('Border:', 'b-blocks')} value={btnBorder} onChange={val => updateFlipBox('btnBorder', val)} defaults={{ radius: '3px' }} />

                    <ColorsControl value={btnColors} onChange={val => updateFlipBox('btnColors', val)} defaults={{ color: '#fff', bg: '#ff4500' }} />

                    <ColorsControl label={__('Hover Colors:', 'b-blocks')} value={btnHovColors} onChange={val => updateFlipBox('btnHovColors', val)} defaults={{ color: '#fff', bg: '#ff7500' }} />
                </PanelBody>
            </>}
        </>}</TabPanel>
    </>
};

export default ItemSettings;