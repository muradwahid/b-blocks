import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls, RichText } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

// Variables
import SeparatorControl from '../../Components/SeparatorControl';
import Typography from '../../Components/Typography';
import BColor from '../../Components/BColor';
import SpaceControl from '../../Components/SpaceControl';

const Edit = props => {
    const { className, attributes: { textAlign, title, titleTypo, titleColor, titleMargin, isSep, separator, sepMargin, isDesc, desc, descTypo, descColor, descMargin }, setAttributes, clientId } = props;

    // useEffect
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('Title Settings', 'b-blocks')}>
                <Typography typography={titleTypo} onChange={val => setAttributes({ titleTypo: val })} defaults={{ fontSize: 25, fontWeight: 600 }} />

                <BColor label={__('Color:', 'b-blocks')} value={titleColor} onChange={val => setAttributes({ titleColor: val })} defaultColor='#4527a4' />

                <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={titleMargin} onChange={val => setAttributes({ titleMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />

                <SeparatorControl separator={separator} onChange={val => setAttributes({ separator: val })} defaults={{ width: '150px', height: '3px', color: '#8344c5' }} />

                <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={sepMargin} onChange={val => setAttributes({ sepMargin: val })} defaults={{ side: 4, bottom: '5px' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
                <ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

                <Typography typography={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: 15 }} />

                <BColor label={__('Color:', 'b-blocks')} value={descColor} onChange={val => setAttributes({ descColor: val })} defaultColor='#333' />

                <SpaceControl className='mt-20p' label={__('Margin:', 'b-blocks')} space={descMargin} onChange={val => setAttributes({ descMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
        </BlockControls>


        <div className={className} id={`bBlocksSectionHeading-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${titleTypo?.googleFontLink});
                @import url(${descTypo?.googleFontLink});

                #bBlocksSectionHeading-${clientId} .bBlocksSectionHeading{
                    text-align: ${textAlign};
                }
                #bBlocksSectionHeading-${clientId} .bBlocksSectionHeading .sectionHeadingTitle{
                    ${titleTypo?.styles || 'font-size: 25px; font-weight: 600;'}
                    color: ${titleColor};
                    margin: ${titleMargin?.styles || '0px 0px 10px 0px'};
                }
                #bBlocksSectionHeading-${clientId} .bBlocksSectionHeading .sectionHeadingSeparator{
                    ${separator?.styles || 'width: 150px; border-top: 3px solid #8344c5;'}
                    margin: ${sepMargin?.styles || '0px 0px 5px 0px'};
                }
                #bBlocksSectionHeading-${clientId} .bBlocksSectionHeading .sectionHeadingDescription{
                    ${descTypo?.styles || 'font-size: 15px;'}
                    color: ${descColor};
                    margin: ${descMargin?.styles || '0px 0px 15px 0px'};
                }
            `}} />

            <div className='bBlocksSectionHeading'>
                <RichText className='sectionHeadingTitle' tagName='h2' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Section heading title', 'b-blocks')} inlineToolbar />

                {isSep && <span className='sectionHeadingSeparator'></span>}

                {isDesc && <RichText className='sectionHeadingDescription' tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Section heading description', 'b-blocks')} inlineToolbar />}
            </div>
        </div>
    </>;
};
export default Edit;