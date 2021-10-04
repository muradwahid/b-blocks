import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';

// Variables
import Title from '../../Components/Title';
import ColorControl from '../../Components/ColorControl';

const Edit = props => {
    const { className, attributes: { qrAlign, url, dimension, color, bgColor }, setAttributes, clientId } = props;

    // useEffect
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${dimension}x${dimension}&color=${color.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}&ecc=L&qzone=1&data=${url}`;

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('QR Code Settings', 'b-blocks')}>
                <Title mt='0'>{__('Website URL:', 'b-blocks')}</Title>
                <TextControl value={url} onChange={val => setAttributes({ url: val })} placeholder={__('Website URL:', 'b-blocks')} />

                <Title>{__('Dimension:', 'b-blocks')}</Title>
                <RangeControl value={dimension} onChange={val => setAttributes({ dimension: val })} min={50} max={1000} step={1} />

                <ColorControl label={__('Color:', 'b-blocks')} value={color} onChange={val => setAttributes({ color: val })} defaultColor='#000' disableAlpha={true} />

                <ColorControl label={__('Background Color:', 'b-blocks')} value={bgColor} onChange={val => setAttributes({ bgColor: val })} defaultColor='#fff' disableAlpha={true} />
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={qrAlign} onChange={val => setAttributes({ qrAlign: val })} describedBy={__('QR Code Alignment')} alignmentControls={[
                { title: __('QR Code in left', 'b-blocks'), align: 'left', icon: 'align-left' },
                { title: __('QR Code in center', 'b-blocks'), align: 'center', icon: 'align-center' },
                { title: __('QR Code in right', 'b-blocks'), align: 'right', icon: 'align-right' }
            ]} />
        </BlockControls>


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