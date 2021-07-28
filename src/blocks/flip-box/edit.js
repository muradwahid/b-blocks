import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { InspectorControls, BlockControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, TextareaControl, ToggleControl, TabPanel } from '@wordpress/components';

// Variables
import Title from '../../GutenComp/Title';
import BColor from '../../GutenComp/BColor';
import ShadowControl from '../../GutenComp/ShadowControl';
import BorderControl from '../../GutenComp/BorderControl';
import ColorsControl from '../../GutenComp/ColorsControl';
import Background from '../../GutenComp/Background';
import { ImageHolderControl, ImageEditControl } from '../../GutenComp/ImageControl';

const Edit = props => {
    const { className, attributes: { contentAlign, frontBG, backBG, border, shadow, isImg, fImg, bImg, imgBorder, fTitle, bTitle, titleColor, isDesc, desc, descColor, isBtn, btn, btnLink, btnColors, btnHovColors, btnBorder }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);

    return <>
        <InspectorControls>
            <PanelBody title={__('Box Settings', 'b-blocks')}>
                {/* Front Background */}
                <Background label={__('Front Background', 'b-blocks')} background={frontBG} onChange={val => setAttributes({ frontBG: val })} />

                {/* Back Background */}
                <Background label={__('Back Background', 'b-blocks')} background={backBG} onChange={val => setAttributes({ backBG: val })} />

                {/* Border */}
                <BorderControl label={__('Border:', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} />

                {/* Shadow */}
                <ShadowControl label={__('Shadow:', 'b-blocks')} border={shadow} onChange={val => setAttributes({ shadow: val })} />
            </PanelBody>

            <PanelBody title={__('Image Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isImg ? 'Hide Image' : 'Show Image'} checked={isImg} onChange={val => setAttributes({ isImg: val })} />

                <ImageHolderControl className='mt-20p mb-5p' label={__('Front Image:', 'b-blocks')} img={fImg} onChange={val => setAttributes({ fImg: val })} />

                <ImageHolderControl className='mt-20p mb-5p' label={__('Back Image:', 'b-blocks')} img={bImg} onChange={val => setAttributes({ bImg: val })} />

                {/* Border */}
                <BorderControl label={__('Border:', 'b-blocks')} border={imgBorder} onChange={val => setAttributes({ imgBorder: val })} />
            </PanelBody>

            <PanelBody title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                {/* Back Title */}
                <Title mt='0'>{__('Front Title:', 'b-blocks')}</Title>
                <TextControl value={fTitle} onChange={val => setAttributes({ fTitle: val })} />

                {/* Back Title */}
                <Title>{__('Back Title:', 'b-blocks')}</Title>
                <TextControl value={bTitle} onChange={val => setAttributes({ bTitle: val })} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#fff' />
            </PanelBody>

            <PanelBody title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={isDesc ? 'Hide Description' : 'Show Description'} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                {/* Text */}
                <Title>{__('Text:', 'b-blocks')}</Title>
                <TextareaControl value={desc} onChange={val => setAttributes({ desc: val })} />

                {/* Color */}
                <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#fff' />
            </PanelBody>

            <PanelBody title={__('Button Settings', 'b-blocks')} initialOpen={false}>
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


        <BlockControls>
            <ImageEditControl label={__('Edit Front Image:', 'b-blocks')} img={fImg} onChange={val => setAttributes({ fImg: val })} />
            <ImageEditControl label={__('Edit Back Image:', 'b-blocks')} img={bImg} onChange={val => setAttributes({ bImg: val })} />
        </BlockControls>


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

                #bBlocksFlipBox-${clientId} img{
                    ${imgBorder?.styles};
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
                    {isImg && fImg && <img src={fImg.url} alt={fImg.alt} />}

                    {fTitle && <h3 className='flipTitle flipFrontTitle'>{fTitle}</h3>}

                    {isDesc && desc && <p className='flipDescription'>{desc}</p>}
                </div>
            </div>

            <div className={`box back text-${contentAlign}`}>
                <div className='backContent'>
                    {isImg && bImg && <img src={bImg.url} alt={bImg.alt} />}

                    {bTitle && <h3 className='flipTitle flipBackTitle'>{bTitle}</h3>}

                    {isBtn && btn && <a href={btnLink} className='flipBtn' target='_blank' rel='noreferrer noopener'>{btn}</a>}
                </div>
            </div>
        </div>
    </>;
};
export default Edit;