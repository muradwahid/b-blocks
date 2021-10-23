import { useEffect } from '@wordpress/element';

import Settings from './settings';

const Edit = props => {
    const { className, attributes: { qrAlign, url, dimension, color, bgColor }, setAttributes, clientId } = props;

    // useEffect
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${dimension}x${dimension}&color=${color.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&ecc=L&qzone=1&data=${url || 'http://bplugins.com'}`;

    return <>
        <Settings settings={props} />


        <div className={className} id={`bBlocksQRCode-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                #bBlocksQRCode-${clientId} .bBlocksQRCode{
                    text-align: ${qrAlign};
                }
            `}} />

            <div className='bBlocksQRCode'>
                <img src={qrUrl} alt={url} />
            </div>
        </div>
    </>;
};
export default Edit;