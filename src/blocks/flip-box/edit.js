import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, TabPanel } from '@wordpress/components';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import ShadowControl from '../../GutenComp/ShadowControl';
import BorderControl from '../../GutenComp/BorderControl';
import ColorsControl from '../../GutenComp/ColorsControl';
import IconControl from '../../GutenComp/IconControl';
import Background from '../../GutenComp/Background';

const Edit = props => {
    const { className, attributes: { contentAlign, frontBG, backBG, border, shadow, isIcon, fIcon, bIcon, fTitle, bTitle, titleColor, isDesc, desc, descColor, isBtn, btn, btnLink, btnColors, btnHovColors, btnBorder }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('Box Settings', 'b-blocks')}>
                {/* Front Background */}
                <Background label={__('Front Background', 'b-blocks')} background={frontBG} onChange={val => setAttributes({ frontBG: val })} />

                {/* Back Background */}
                <Background label={__('Back Background', 'b-blocks')} background={backBG} onChange={val => setAttributes({ backBG: val })} />

                {/* Border */}
                <BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} />

                {/* Shadow */}
                <ShadowControl label={__('Shadow:', 'b-blocks')} border={shadow} onChange={val => setAttributes({ shadow: val })} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isIcon ? 'Hide Icon' : 'Show Icon'} checked={isIcon} onChange={val => setAttributes({ isIcon: val })} />

                {isIcon && <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={[{ name: 'front', title: __('Front Icon', 'b-blocks'), className: 'front-tab' }, { name: 'back', title: __('Back Icon', 'b-blocks'), className: 'back-tab', }]}>
                    {tab => <>
                        {'front' == tab.name && <IconControl icon={fIcon} onChange={val => setAttributes({ fIcon: val })} defaults={{ class: 'fa fa-sync-alt', fontSize: 70, color: '#fff' }} />}

                        {'back' == tab.name && <IconControl icon={bIcon} onChange={val => setAttributes({ bIcon: val })} defaults={{ class: 'fa fa-wordpress', fontSize: 70, color: '#fff' }} />}
                    </>}
                </TabPanel>}
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                {/* Back Title */}
                <Title mt='0'>{__('Front Title:', 'b-blocks')}</Title>
                <TextControl value={fTitle} onChange={val => setAttributes({ fTitle: val })} />

                {/* Back Title */}
                <Title>{__('Back Title:', 'b-blocks')}</Title>
                <TextControl value={bTitle} onChange={val => setAttributes({ bTitle: val })} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#fff' />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isDesc ? 'Hide Description' : 'Show Description'} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                {/* Text */}
                <Title>{__('Text:', 'b-blocks')}</Title>
                <TextareaControl value={desc} onChange={val => setAttributes({ desc: val })} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#fff' />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Button Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isBtn ? 'Hide Button' : 'Show Button'} checked={isBtn} onChange={val => setAttributes({ isBtn: val })} />

                {/* Text */}
                <Title>{__('Text:', 'b-blocks')}</Title>
                <TextControl value={btn} onChange={val => setAttributes({ btn: val })} />

                {/* Link */}
                <Title>{__('Link:', 'b-blocks')}</Title>
                <TextControl value={btnLink} onChange={val => setAttributes({ btnLink: val })} />

                {/* Border */}
                <BorderControl label={__('Border:', 'b-blocks')} border={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '3px' }} />

                {/* Colors */}
                <Title>{__('Colors:', 'b-blocks')}</Title>
                <TabPanel className='bBlocksTabPanel' activeClass='activeTab' tabs={[{ name: 'normal', title: __('Normal', 'b-blocks'), className: 'normal-tab' }, { name: 'hover', title: __('Hover', 'b-blocks'), className: 'hover-tab', }]}>
                    {tab => <>
                        {'normal' == tab.name && <>
                            {/* Colors */}
                            <ColorsControl colors={btnColors} onChange={val => setAttributes({ btnColors: val })} defaults={{ color: '#fff', bg: '#ff4500' }} />
                        </>}

                        {'hover' == tab.name && <>
                            {/* Hover Colors */}
                            <ColorsControl colors={btnHovColors} onChange={val => setAttributes({ btnHovColors: val })} defaults={{ color: '#fff', bg: '#ff7500' }} />
                        </>}
                    </>}
                </TabPanel>
            </PanelBody>
        </InspectorControls>


        <div className={`${className} bBlocksFlipBox`} id={`bBlocksFlipBox-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                #bBlocksFlipBox-${clientId} .box{
                    ${border?.styles};
                    box-shadow: ${shadow?.styles};
                }
                #bBlocksFlipBox-${clientId} .box.front{
                    ${frontBG?.styles || `background-color: #000000b3;`}
                }
                #bBlocksFlipBox-${clientId} .box.back{
                    ${backBG?.styles || `background-color: #000000b3;`}
                }

                #bBlocksFlipBox-${clientId} .flipIcon.frontIcon{
                    ${fIcon?.styles || 'font-size: 70px; color: #fff;'}
                }
                #bBlocksFlipBox-${clientId} .flipIcon.backIcon{
                    ${bIcon?.styles || 'font-size: 70px; color: #fff;'}
                }
                #bBlocksFlipBox-${clientId} .flipTitle{
                    color: ${titleColor};
                }
                #bBlocksFlipBox-${clientId} .flipDescription{
                    color: ${descColor};
                }

                #bBlocksFlipBox-${clientId} .flipBtn{
                    ${btnColors?.styles || 'color: #fff; background: #ff4500;'}
                    ${btnBorder?.styles || 'border-radius: 3px;'}
                }
                #bBlocksFlipBox-${clientId} .flipBtn:hover{
                    ${btnHovColors?.styles || 'color: #fff; background: #ff7500;'}
                }
            `}} />

            <div className={`box front text-${contentAlign}`}>
                <div className='frontContent'>
                    {isIcon && fIcon?.class && <i className={`flipIcon frontIcon ${fIcon?.class}`}></i>}

                    {fTitle && <h3 className='flipTitle flipFrontTitle'>{fTitle}</h3>}

                    {isDesc && desc && <p className='flipDescription'>{desc}</p>}
                </div>
            </div>

            <div className={`box back text-${contentAlign}`}>
                <div className='backContent'>
                    {isIcon && bIcon?.class && <i className={`flipIcon frontIcon ${bIcon?.class}`}></i>}

                    {bTitle && <h3 className='flipTitle flipBackTitle'>{bTitle}</h3>}

                    {isBtn && btn && <a href={btnLink} className='flipBtn' target='_blank' rel='noreferrer noopener'>{btn}</a>}
                </div>
            </div>
        </div>
    </>;
};
export default Edit;