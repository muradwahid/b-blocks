import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, TextControl } from '@wordpress/components';

// Variables
import Title from '../../../../Components/Title';
import ColorControl from '../../../../Components/ColorControl';

const Settings = ({ settings }) => {
    const { attributes: { qrAlign, url, dimension, color, bgColor }, setAttributes } = settings;

    return <>
        <InspectorControls>
            <PanelBody className='bPlPanelBody' title={__('QR Code Settings', 'b-blocks')}>
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
    </>;
};
export default Settings;