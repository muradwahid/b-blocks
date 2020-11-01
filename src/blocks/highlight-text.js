const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, FontSizePicker } = wp.components;


// Variables
const fontSizes = [
    { name: 'Small', slug: 'small', size: 13 },
    { name: 'Normal', slug: 'normal', size: 16 },
    { name: 'Medium', slug: 'medium', size: 20 },
    { name: 'Large', slug: 'large', size: 36 },
    { name: 'Huge', slug: 'huge', size: 48 }
];


// Functions
const firstTitle = title => <p className="panel_single-title">{title}</p>;
const otherTitle = title => <p className="panel_single-title" style={{ marginTop: '25px' }}>{title}</p>;


registerBlockType('b-blocks/highlight-text', {
    // Build In attributes
    title: 'Highlight Text',
    description: 'Text Highlight',
    icon: 'align-wide',
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        text: { type: 'string', source: 'html', selector: '.b_blocks_highlighter' },
        fontS: { type: 'number' },
        color: { type: 'string', default: '#333' },
        BGColor: { type: 'string', default: '#beff14' }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { text, fontS, color, BGColor }, setAttributes } = props;

        const textStyle = { padding: '3px 5px', fontSize: fontS, color: color, backgroundColor: BGColor }

        return ([
            <InspectorControls>
                {/* Highlight Text Settings */}
                <PanelBody title="Highlight Text Settings">
                    {/* Font Size */}
                    {firstTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={fontS} onChange={cng => setAttributes({ fontS: cng })} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={color} onChange={cng => setAttributes({ color: cng })} />

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} />
                </PanelBody>
            </InspectorControls>,


            <RichText className="b_blocks_highlighter" key="editable" tagName="mark" placeholder="Write Your Highlight Text" value={text} onChange={cng => { setAttributes({ text: cng }) }} style={textStyle} />
        ])
    },

    save: props => {
        const { text, fontS, color, BGColor } = props.attributes;

        const textStyle = { padding: '3px 5px', fontSize: fontS, color: color, backgroundColor: BGColor }

        return (
            <RichText.Content className="b_blocks_highlighter" tagName="mark" value={text} style={textStyle} />
        )
    },
});