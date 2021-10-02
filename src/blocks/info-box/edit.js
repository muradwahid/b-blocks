import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

import Settings from './settings';

const Edit = props => {
    const { className, attributes: { infoBoxAlign, textAlign, width, background, padding, border, shadow, isIcon, icon, iconMargin, title, titleTypo, titleColor, titleMargin, isDesc, desc, descTypo, descColor, descMargin, isBtn, btn, btnLink, isLinkNewTab, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

    return <>
        <Settings settings={props} />

        <div className={className} id={`bBlocksInfoBox-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${titleTypo?.googleFontLink});
                @import url(${descTypo?.googleFontLink});
                @import url(${btnTypo?.googleFontLink});

                #bBlocksInfoBox-${clientId}{
                    text-align: ${infoBoxAlign};
                }
                #bBlocksInfoBox-${clientId} .bBlocksInfoBox{
                    text-align: ${textAlign};
                    width: ${'0px' === width || '0%' === width || '0em' === width ? 'auto' : width};
                    ${background?.styles || 'background-color: #f1f7ff;'}
                    padding: ${padding?.styles || '50px 50px'};
                    ${border?.styles || 'border: 10px solid #fff; border-radius: 5px;'}
                    box-shadow: ${shadow?.styles || 'none'};
                }
                #bBlocksInfoBox-${clientId} .bBlocksInfoBox .infoBoxIcon{
                    margin: ${iconMargin?.styles || '0px 0px 20px 0px'};
                }
                #bBlocksInfoBox-${clientId} .bBlocksInfoBox .infoBoxIcon i{
                    ${icon?.styles || 'font-size: 70px; color: #4527a4;'}
                }
                #bBlocksInfoBox-${clientId} .bBlocksInfoBox .infoBoxTitle{
                    ${titleTypo?.styles || 'font-size: 25px; font-weight: 600;'}
                    color: ${titleColor};
                    margin: ${titleMargin?.styles || '0px 0px 10px 0px'};
                }
                #bBlocksInfoBox-${clientId} .bBlocksInfoBox .infoBoxDescription{
                    ${descTypo?.styles || 'font-size: 15px;'}
                    color: ${descColor};
                    margin: ${descMargin?.styles || '0px 0px 15px 0px'};
                }
                #bBlocksInfoBox-${clientId} .bBlocksInfoBox .infoBoxButton{
                    ${btnTypo?.styles || 'font-size: 15px;'}
                    ${btnColors?.styles || 'color: #fff; background: #4527a4;'}
                    padding: ${btnPadding?.styles || '8px 15px'};
                    ${btnBorder?.styles || 'border-radius: 5px;'}
                }
                #bBlocksInfoBox-${clientId} .bBlocksInfoBox .infoBoxButton:hover{
                    ${btnHovColors?.styles || 'color: #fff; background: #8344c5;'}
                }
            `}} />

            <div className='bBlocksInfoBox'>
                {isIcon && icon?.class && <div className='infoBoxIcon'><i className={icon?.class}></i></div>}

                <RichText className='infoBoxTitle' tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Info box title', 'b-blocks')} inlineToolbar />

                {isDesc && <RichText className='infoBoxDescription' tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Info box description', 'b-blocks')} inlineToolbar />}

                {isBtn && <RichText className='infoBoxButton' tagName='a' value={btn} href={btnLink} target={isLinkNewTab ? '_blank' : ''} rel='noreferrer noopener' onChange={val => setAttributes({ btn: val })} placeholder={__('Click Me', 'b-blocks')} />}
            </div>
        </div>
    </>;
};
export default Edit;