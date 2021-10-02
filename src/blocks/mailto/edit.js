import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

import Settings from './settings';

const Edit = props => {
    const { className, attributes: { mailtoAlign, btn, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder, icon, iconPosition }, setAttributes, clientId } = props;

    // Functions
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

    return <>
        <Settings settings={props} />

        <div className={className} id={`bBlocksMailto-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${btnTypo?.googleFontLink});

                #bBlocksMailto-${clientId} .bBlocksMailto{
                    text-align: ${mailtoAlign};
                }
                #bBlocksMailto-${clientId} .bBlocksMailto a.mailtoButton{
                    ${btnTypo?.styles || 'font-size: 22px; font-weight: 600;'}
                    ${btnColors?.styles || 'color: #fff; background: #4527a4;'}
                    padding: ${btnPadding?.styles || '18px 45px'};
                    ${btnBorder?.styles || 'border-radius: 50px;'}
                    box-shadow: 0px 5px 20px 0px ${btnColors?.bg};
                }
                #bBlocksMailto-${clientId} .bBlocksMailto a.mailtoButton:hover{
                    ${btnHovColors?.styles || 'color: #fff; background: #8344c5;'}
                    box-shadow: 0px 5px 20px 0px ${btnHovColors?.bg};
                }
            `}} />

            <div className='bBlocksMailto'>
                <a href='#' className='mailtoui mailtoButton'>
                    {'left' === iconPosition && icon?.class && <i className={icon?.class}></i>}

                    <RichText tagName='span' value={btn} onChange={val => setAttributes({ btn: val })} placeholder={__('Send E-mail', 'b-blocks')} inlineToolbar />

                    {'right' === iconPosition && icon?.class && <i className={icon?.class}></i>}
                </a>
            </div>
        </div>
    </>;
};
export default Edit;