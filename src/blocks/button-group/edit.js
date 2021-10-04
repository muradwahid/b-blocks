import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { AlignmentToolbar, BlockControls, InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, PanelRow, TabPanel, TextControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Variables
import Title from '../../Components/Title';
import BColor from '../../Components/BColor';
import BtnGroup from '../../Components/BtnGroup';
import Typography from '../../Components/Typography';
import SpaceControl from '../../Components/SpaceControl';
import BorderControl from '../../Components/BorderControl';
import ColorsControl from '../../Components/ColorsControl';
import IconControl from '../../Components/IconControl';
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

const Edit = props => {
    const { className, attributes: { btnAlign, btnType, btnTypo, btnWidth, btnPadding, btnOne, btnOneLink, btnOneBorder, btnOneColors, btnOneHovColors, btnTwo, btnTwoLink, btnTwoBorder, btnTwoColors, btnTwoHovColors, isSep, sepType, sepText, sepTextTypo, sepTextColor, sepIcon, sepWidth, sepSize, sepBGColor }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('Button Settings', 'b-blocks')}>
                {/* Button Type */}
                <PanelRow>
                    <Title mt='0' mb='0'>{__('Type:', 'b-blocks')}</Title>
                    <BtnGroup myValue={btnType} setState={val => {
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

                {/* Typography */}
                <Typography className='mt-20p' typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 16 }} />

                {/* Width */}
                <UnitControl className='mt-20p' label={__('Width:', 'b-blocks')} labelPosition='left' value={btnWidth} onChange={val => setAttributes({ btnWidth: val })} units={[pxUnit, perUnit, emUnit]} />

                {/* Padding */}
                <SpaceControl className='mt-20p' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '12px', horizontal: '30px' }} />

                <Title>{__('Buttons:', 'b-blocks')}</Title>
                <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={btnGroupTabs}>{tab => <>
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

            <PanelBody className='bBlocksPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val, sepWidth: val && 0 })} />

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
            <AlignmentToolbar value={btnAlign} onChange={val => setAttributes({ btnAlign: val })} describedBy={__('Button Group Align')} alignmentControls={[
                { title: __('Button Group in left', 'b-blocks'), align: 'left', icon: 'align-left' },
                { title: __('Button Group in center', 'b-blocks'), align: 'center', icon: 'align-center' },
                { title: __('Button Group in right', 'b-blocks'), align: 'right', icon: 'align-right' }
            ]} />
        </BlockControls>


        <div className={className} id={`bBlocksButtonGroup-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${btnTypo?.googleFontLink});
                @import url(${sepTextTypo?.googleFontLink});

                #bBlocksButtonGroup-${clientId}{
                    text-align: ${btnAlign};
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .btnG{
                    ${btnTypo?.styles || 'font-size: 16px;'}
                    width: ${'0px' !== btnWidth && '0%' !== btnWidth && '0em' !== btnWidth ? btnWidth : 'auto'};
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
                    <RichText className={`btnG btnOne btn-${btnType}`} tagName='a' href={btnOneLink} value={btnOne} onChange={val => setAttributes({ btnOne: val })} placeholder={__('First Button', 'b-blocks')} />

                    {isSep && <div className='btnSeparator'>
                        {'text' === sepType ? <span>{sepText}</span> : 'icon' === sepType && sepIcon?.class ? <i className={sepIcon?.class}></i> : ''}
                    </div>}
                </div>

                <RichText className={`btnG btnTwo btn-${btnType}`} tagName='a' href={btnTwoLink} value={btnTwo} onChange={val => setAttributes({ btnTwo: val })} placeholder={__('Second Button', 'b-blocks')} />
            </div>
        </div>
    </>;
};
export default Edit;