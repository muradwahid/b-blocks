import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls, RichText } from '@wordpress/block-editor';
import { Button, ButtonGroup, PanelBody, PanelRow, TabPanel, TextControl, ToggleControl, Tooltip, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import BtnGroup from '../../GutenComp/BtnGroup';
import Typography from '../../GutenComp/Typography';
import SpaceControl from '../../GutenComp/SpaceControl';
import BorderControl from '../../GutenComp/BorderControl';
import ColorsControl from '../../GutenComp/ColorsControl';
import IconControl from '../../GutenComp/IconControl';
import options from '../../Const/options';
const { pxUnit, perUnit, emUnit } = options;
const sepTypes = [
    { label: 'Icon', value: 'icon', icon: 'Icon' },
    { label: 'Text', value: 'text', icon: 'Text' }
];

const Edit = props => {
    const { className, attributes: { btnAlign, btnTypo, btnWidth, btnPadding, btnOne, btnOneType, btnOneLink, btnOneBorder, btnOneColors, btnOneHovColors, btnTwo, btnTwoType, btnTwoLink, btnTwoBorder, btnTwoColors, btnTwoHovColors, isSep, sepType, sepText, sepTextTypo, sepTextColor, sepIcon, sepWidth, sepSize, sepBGColor }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('Button Settings', 'b-blocks')}>
                {/* Button One Link */}
                <Title mt='0'>{__('Button One Link:', 'b-blocks')}</Title>
                <TextControl value={btnOneLink} onChange={val => setAttributes({ btnOneLink: val })} />

                {/* Button Two Link */}
                <Title>{__('Button Two Link:', 'b-blocks')}</Title>
                <TextControl value={btnTwoLink} onChange={val => setAttributes({ btnTwoLink: val })} />

                {/* Typography */}
                <Typography className='mt-20p' typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 16 }} />

                {/* Width */}
                <UnitControl className='mt-20p' label={__('Width:', 'b-blocks')} labelPosition='left' value={btnWidth} onChange={val => setAttributes({ btnWidth: val })} units={[pxUnit, perUnit, emUnit]} />

                {/* Padding */}
                <SpaceControl className='mt-20p' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '30px' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Button One Settings', 'b-blocks')} initialOpen={false}>
                {/* Type */}
                <PanelRow>
                    <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                    <ButtonGroup className='bBlocksBtnGroup'>
                        <Tooltip text={__('Fill', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'fill' === btnOneType} aria-pressed={'fill' === btnOneType} onClick={() => setAttributes({ btnOneType: 'fill', btnOneColors: { ...btnOneColors, color: '#fff', bg: '#4527a4' }, btnOneBorder: { ...btnOneBorder, width: '0px', color: '#0000' } })}>{__('Fill', 'b-blocks')}</Button>
                        </Tooltip>

                        <Tooltip text={__('Outline', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'outline' === btnOneType} aria-pressed={'outline' === btnOneType} onClick={() => setAttributes({ btnOneType: 'outline', btnOneColors: { ...btnOneColors, color: '#4527a4', bg: '#0000' }, btnOneBorder: { ...btnOneBorder, width: '3px', color: '#4527a4' } })}>{__('Outline', 'b-blocks')}</Button>
                        </Tooltip>

                        <Tooltip text={__('Text', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'text' === btnOneType} aria-pressed={'text' === btnOneType} onClick={() => setAttributes({ btnOneType: 'text', btnOneColors: { ...btnOneColors, color: '#4527a4', bg: '#0000' }, btnOneBorder: { ...btnOneBorder, width: '0px', color: '#0000' } })}>{__('Text', 'b-blocks')}</Button>
                        </Tooltip>
                    </ButtonGroup>
                </PanelRow>

                {/* Border */}
                <BorderControl label={__('Border', 'b-blocks')} border={btnOneBorder} onChange={val => setAttributes({ btnOneBorder: val })} defaults={{ radius: '50px' }} />

                {/* Colors */}
                <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={[{ name: 'normal', title: __('Normal Color', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover Color', 'b-blocks'), className: 'hover-tab', }]}>
                    {tab => <>
                        {'normal' == tab.name && <ColorsControl colors={btnOneColors} onChange={val => setAttributes({ btnOneColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />}

                        {'hover' == tab.name && <ColorsControl colors={btnOneHovColors} onChange={val => setAttributes({ btnOneHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />}
                    </>}
                </TabPanel>
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Button Two Settings', 'b-blocks')} initialOpen={false}>
                {/* Type */}
                <PanelRow>
                    <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                    <ButtonGroup className='bBlocksBtnGroup'>
                        <Tooltip text={__('Fill', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'fill' === btnTwoType} aria-pressed={'fill' === btnTwoType} onClick={() => setAttributes({ btnTwoType: 'fill', btnTwoColors: { ...btnTwoColors, color: '#fff', bg: '#8344c5' }, btnTwoBorder: { ...btnTwoBorder, width: '0px', color: '#0000' } })}>{__('Fill', 'b-blocks')}</Button>
                        </Tooltip>

                        <Tooltip text={__('Outline', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'outline' === btnTwoType} aria-pressed={'outline' === btnTwoType} onClick={() => setAttributes({ btnTwoType: 'outline', btnTwoColors: { ...btnTwoColors, color: '#8344c5', bg: '#0000' }, btnTwoBorder: { ...btnTwoBorder, width: '3px', color: '#8344c5' } })}>{__('Outline', 'b-blocks')}</Button>
                        </Tooltip>

                        <Tooltip text={__('Text', 'b-blocks')} position='top'>
                            <Button isMedium isPrimary={'text' === btnTwoType} aria-pressed={'text' === btnTwoType} onClick={() => setAttributes({ btnTwoType: 'text', btnTwoColors: { ...btnTwoColors, color: '#8344c5', bg: '#0000' }, btnTwoBorder: { ...btnTwoBorder, width: '0px', color: '#0000' } })}>{__('Text', 'b-blocks')}</Button>
                        </Tooltip>
                    </ButtonGroup>
                </PanelRow>

                {/* Border */}
                <BorderControl label={__('Border', 'b-blocks')} border={btnTwoBorder} onChange={val => setAttributes({ btnTwoBorder: val })} defaults={{ radius: '50px' }} />

                {/* Colors */}
                <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={[{ name: 'normal', title: __('Normal Color', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover Color', 'b-blocks'), className: 'hover-tab', }]}>
                    {tab => <>
                        {'normal' == tab.name && <ColorsControl colors={btnTwoColors} onChange={val => setAttributes({ btnTwoColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />}

                        {'hover' == tab.name && <ColorsControl colors={btnTwoHovColors} onChange={val => setAttributes({ btnTwoHovColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />}
                    </>}
                </TabPanel>
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isSep ? 'Hide Separator' : 'Show Separator'} checked={isSep} onChange={val => setAttributes({ isSep: val, sepWidth: val && 0 })} />

                {isSep && <>
                    <PanelRow className='mt-20p'>
                        <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                        <BtnGroup options={sepTypes} myValue={sepType} setState={val => setAttributes({ sepType: val })} />
                    </PanelRow>

                    {/* Separator Text */}
                    {'text' === sepType && <>
                        <Title>{__('Separator Text:', 'b-blocks')}</Title>
                        <TextControl value={sepText} onChange={val => setAttributes({ sepText: val })} />

                        {/* Text Typography */}
                        <Typography className='mt-20p' label={__('Text Typography', 'b-blocks')} typography={sepTextTypo} onChange={val => setAttributes({ sepTextTypo: val })} defaults={{ fontSize: 15 }} />

                        {/* Text Color */}
                        <BColor className='mt-20p' label={__('Text Color:', 'b-blocks')} value={sepTextColor} onChange={val => setAttributes({ sepTextColor: val })} defaultColor='#333' />
                    </>}

                    {/* Icon */}
                    {'icon' === sepType && <IconControl icon={sepIcon} onChange={val => setAttributes({ sepIcon: val })} defaults={{ class: 'fa fa fa-arrows-alt-h', fontSize: 20, color: '#333' }} />}

                    {/* Width */}
                    <UnitControl className='mt-20p' label={__('Width:', 'b-blocks')} labelPosition='left' value={sepWidth} onChange={val => setAttributes({ sepWidth: val })} units={[pxUnit, emUnit]} />

                    {/* Size */}
                    <UnitControl className='mt-20p' label={__('Size:', 'b-blocks')} labelPosition='left' value={sepSize} onChange={val => setAttributes({ sepSize: val })} units={[pxUnit, emUnit]} />

                    {/* Background Color */}
                    <BColor className='mt-20p' label={__('Background Color:', 'b-blocks')} value={sepBGColor} onChange={val => setAttributes({ sepBGColor: val })} defaultColor='#fff' />
                </>}
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={btnAlign} onChange={val => setAttributes({ btnAlign: val })} />
        </BlockControls>


        <div className={`${className} text-${btnAlign}`} id={`bBlocksButtonGroup-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${btnTypo?.googleFontLink});
                @import url(${sepTextTypo?.googleFontLink});

                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnG{
                    ${btnTypo?.styles || 'font-size: 16px;'}
                    width: ${'0px' !== btnWidth ? btnWidth : 'auto'};
                    padding: ${btnPadding?.styles || '12px 30px'};
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .firstBtn{
                    margin-right: calc(${sepWidth} / 2);
                    padding-right: calc(${sepWidth} / 2);
                }

                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnOne{
                    ${btnOneBorder?.styles || 'border-radius: 50px;'}
                    ${btnOneColors?.styles || 'color: #fff; background: #4527a4;'}
                    border-radius: ${btnOneBorder?.radius || '50px'} 0 0 ${btnOneBorder?.radius || '50px'};
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnOne:hover{
                    ${btnOneHovColors?.styles || 'color: #fff; background: #8344c5;'}
                }

                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnTwo{
                    ${btnTwoBorder?.styles || 'border-radius: 50px;'}
                    ${btnTwoColors?.styles || 'color: #fff; background: #8344c5;'}
                    border-radius: 0 ${btnTwoBorder?.radius || '50px'} ${btnTwoBorder?.radius || '50px'} 0;
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnTwo:hover{
                    ${btnTwoHovColors?.styles || 'color: #fff; background: #4527a4;'}
                }

                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnSeparator{
                    width: ${sepSize};
                    height: ${sepSize};
                    background-color: ${sepBGColor};
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnSeparator span{
                    ${sepTextTypo?.styles || 'font-size: 15px;'}
                    color: ${sepTextColor};
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnSeparator i{
                    ${sepIcon?.styles || 'font-size: 20px; color: #333;'}
                }
            `}} />

            <div className='bBlocksButtonGroup'>
                <div className='firstBtn'>
                    <RichText className={`btnG btnOne btn-${btnOneType}`} tagName='a' href={btnOneLink} value={btnOne} onChange={val => setAttributes({ btnOne: val })} placeholder={__('First Button', 'b-blocks')} />

                    {isSep && <div className='btnSeparator'>
                        {'text' === sepType ? <span>{sepText}</span> : 'icon' === sepType && sepIcon?.class ? <i className={sepIcon?.class}></i> : ''}
                    </div>}
                </div>

                <RichText className={`btnG btnTwo btn-${btnTwoType}`} tagName='a' href={btnTwoLink} value={btnTwo} onChange={val => setAttributes({ btnTwo: val })} placeholder={__('Second Button', 'b-blocks')} />
            </div>
        </div>
    </>;
};
export default Edit;