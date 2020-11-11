const { registerBlockType } = wp.blocks;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { PanelBody, RangeControl, TextControl, PanelRow } = wp.components;


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

    // Custom Attributes
    attributes: {
        url: { type: 'string', default: 'https://wasek-bellah.web.app/' },
        dimension: { type: 'number', default: 180 },
        alignment: { type: 'string', default: 'center' }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { url, dimension, alignment }, setAttributes, isSelected } = props;

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
                    <RangeControl value={dimension} onChange={cng => setAttributes({ dimension: cng })} min={50} max={500} step={1} />
                </PanelBody>
            </InspectorControls>,

            <div style={{ textAlign: alignment }}>
                <BlockControls>
                    <AlignmentToolbar value={alignment} onChange={cng => setAttributes({ alignment: cng })} />
                </BlockControls>

                <img src={qrUrl} />

                {isSelected && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                    <label htmlFor="bBlocksQRWebUrlField" style={{ marginRight: '20px', fontWeight: 'bold' }}>Website url:</label>

                    <TextControl style={{ width: '350px', padding: '8px 15px', borderRadius: '3px', color: '#000' }} id="bBlocksQRWebUrlField" value={url} onChange={cng => setAttributes({ url: cng })} />
                </div>}
            </div>
        ]);
    },

    save: props => {
        const { url, dimension, alignment } = props.attributes;

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${dimension}x${dimension}&ecc=L&qzone=1&data=${url}}`;

        return (
            <div style={{ textAlign: alignment }}>
                <img src={qrUrl} />
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});