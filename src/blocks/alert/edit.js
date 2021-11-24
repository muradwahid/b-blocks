import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { Tooltip } from '@wordpress/components';

import Settings from './settings';

const Edit = props => {
    const { className, attributes: { width, alignment, textAlign, message, icon, isDismiss, typography, colors, padding, border, shadow }, setAttributes, clientId } = props;

    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

    return <>
        <Settings settings={props} />

        <div className={className} id={`bBlocksAlert-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${typography?.googleFontLink || ''});

                #bBlocksAlert-${clientId} .bBlocksAlert{
                    text-align: ${alignment};
                }
                #bBlocksAlert-${clientId} .bBlocksAlert .alert{
                    text-align: ${textAlign};
                    width: ${'0px' === width || '0%' === width || '0em' === width ? 'auto' : width};
                    ${typography?.styles || 'font-size: 25px;'}
                    ${colors?.styles || 'color: #333; background: #fff;'}
                    padding: ${padding?.styles || '15px 30px'};
                    ${border?.styles || 'border: 2px solid #333; border-radius: 8px;'}
                    box-shadow: ${shadow?.styles || 'none'};
                }
                #bBlocksAlert-${clientId} .bBlocksAlert .alert .alertIcon{
                    font-size: ${typography?.fontSize || '25px'};
                    color: ${colors?.color || '#333'};
                }
                #bBlocksAlert-${clientId} .bBlocksAlert .alert .alertClose{
                    color: ${colors?.color || '#333'};
                }
            `}} />

            <div className='bBlocksAlert'>
                <div className='alert'>
                    {icon?.class && <i className={`alertIcon ${icon?.class}`}></i>}

                    <RichText className='alertMessage' tagName='span' value={message} onChange={val => setAttributes({ message: val })} placeholder={__('Alert Message', 'b-blocks')} inlineToolbar />

                    {isDismiss && <Tooltip text='Hide will only work in frontend' position='top center'>
                        <i className='alertClose fa fa-times-circle'></i>
                    </Tooltip>}
                </div>
            </div>
        </div>
    </>;
};
export default Edit;