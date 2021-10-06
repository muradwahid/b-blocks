import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

import Settings from './settings';

const Edit = props => {
    const { className, attributes: { width, btnAlign, btnType, btnTypo, btnPadding, btnOne, btnOneLink, btnOneBorder, btnOneColors, btnOneHovColors, btnTwo, btnTwoLink, btnTwoBorder, btnTwoColors, btnTwoHovColors, isSep, sepType, sepText, sepTextTypo, sepTextColor, sepIcon, sepBGColor }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

    return <>
        <Settings settings={props} />


        <div className={className} id={`bBlocksButtonGroup-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${btnTypo?.googleFontLink});
                @import url(${sepTextTypo?.googleFontLink});

                #bBlocksButtonGroup-${clientId}{
                    text-align: ${btnAlign};
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup{
                    width: ${'0px' !== width && '0%' !== width && '0em' !== width ? width : 'auto'};
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .bBlocksBtn{
                    min-width: ${'0px' !== width && '0%' !== width && '0em' !== width ? '50%' : 'auto'};
                }
                #bBlocksButtonGroup-${clientId} .bBlocksButtonGroup .bBlocksBtn a{
                    ${btnTypo?.styles || 'font-size: 16px;'}
                    padding: ${btnPadding?.styles || '12px 30px'};
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
                    width: ${'text' === sepType ? `${sepTextTypo?.fontSize * 1.75}px` : `${sepIcon?.fontSize * 1.65}px`};
                    height: ${'text' === sepType ? `${sepTextTypo?.fontSize * 1.75}px` : `${sepIcon?.fontSize * 1.65}px`};
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
                <div className='bBlocksBtn firstBtn'>
                    <RichText className={`btnOne btn-${btnType}`} tagName='a' href={btnOneLink} value={btnOne} onChange={val => setAttributes({ btnOne: val })} placeholder={__('First Button', 'b-blocks')} inlineToolbar />

                    {isSep && <div className='btnSeparator'>
                        {'text' === sepType ? <span>{sepText}</span> : 'icon' === sepType && sepIcon?.class ? <i className={sepIcon?.class}></i> : ''}
                    </div>}
                </div>

                <div className='bBlocksBtn secondBtn'>
                    <RichText className={`btnTwo btn-${btnType}`} tagName='a' href={btnTwoLink} value={btnTwo} onChange={val => setAttributes({ btnTwo: val })} placeholder={__('Second Button', 'b-blocks')} inlineToolbar />
                </div>
            </div>
        </div>
    </>;
};
export default Edit;