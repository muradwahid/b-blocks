const { registerBlockType } = wp.blocks;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { PanelBody, RangeControl, TextControl } = wp.components;

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/qr-code', {
    // Build In attributes
    title: 'QR Code',
    description: 'Show QR Code in posts and pages',
    icon: icons.qrCode,
    category: 'bBlocks',
    keywords: ['QR', 'QR Code', 'Code'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        url: { type: 'string' },
        dimension: { type: 'number', default: 180 },
        qrAlign: { type: 'string', default: 'center' }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { url, dimension, qrAlign }, setAttributes, isSelected } = props;

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${dimension}x${dimension}&ecc=L&qzone=1&data=${url}`;

        return ([
            <InspectorControls>
                {/* QR Code Settings */}
                <PanelBody title="QR Code Settings" initialOpen={true}>
                    {/* Website url */}
                    {firstTitle('Website url:')}
                    <TextControl value={url} onChange={cng => setAttributes({ url: cng })} />

                    {/* Dimension */}
                    {otherTitle('Dimension:')}
                    <RangeControl value={dimension} onChange={cng => setAttributes({ dimension: cng })} min={50} max={1000} step={1} />
                </PanelBody>
            </InspectorControls>,

            <div className="b_blocks_qr_code">
                <BlockControls>
                    <AlignmentToolbar value={qrAlign} onChange={cng => setAttributes({ qrAlign: cng })} />
                </BlockControls>

                <div style={{ textAlign: qrAlign, position: 'relative' }}>
                    <img src={qrUrl} />

                    {isSelected && <div style={{ position: 'absolute', bottom: '-33px', left: `${qrAlign === 'left' ? '0%' : qrAlign === 'center' ? '50%' : qrAlign === 'right' && '100%'}`, transform: `${qrAlign === 'left' ? 'translateX(0)' : qrAlign === 'center' ? 'translateX(-50%)' : qrAlign === 'right' && 'translateX(-100%)'}`, zIndex: 30 }}>

                        <TextControl style={{ width: '350px', padding: '8px 15px', borderRadius: '3px', color: '#000' }} value={url} onChange={cng => setAttributes({ url: cng })} placeholder="Website url" />
                    </div>}
                </div>
            </div>
        ]);
    },

    save: props => {
        const { url, dimension, qrAlign } = props.attributes;

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${dimension}x${dimension}&ecc=L&qzone=1&data=${url}}`;

        return (
            <div className="b_blocks_qr_code">
                <div style={{ textAlign: qrAlign }}>
                    <img src={qrUrl} />
                </div>
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});