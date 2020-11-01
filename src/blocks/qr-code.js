const { registerBlockType } = wp.blocks;
const { InspectorControls, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { PanelBody, RangeControl, TextControl } = wp.components;


// Functions
const firstTitle = title => <p className="panel_single-title">{title}</p>;
const otherTitle = title => <p className="panel_single-title" style={{ marginTop: '25px' }}>{title}</p>;


registerBlockType('b-blocks/qr-code', {
    // Build In attributes
    title: 'QR Code',
    description: 'Show QR Code in posts and pages',
    icon: 'admin-site-alt3',
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        url: { type: 'string', default: 'https://wasek-bellah.web.app/' },
        dimension: { type: 'number', default: 180 },
        alignment: { type: 'string', default: 'center' }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { url, dimension, alignment }, setAttributes } = props;

        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${dimension}x${dimension}&ecc=L&qzone=1&data=${url}}`;


        return ([
            <InspectorControls>
                {/* QR Code Settings */}
                <PanelBody title="QR Code Settings">
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
});