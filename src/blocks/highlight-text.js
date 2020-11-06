const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, FontSizePicker } = wp.components;


// Variables
import options from '../Const/options';
const { fontSizes, colors } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/highlight-text', {
    // Build In attributes
    title: 'Highlight Text',
    description: 'Text Highlight',
    icon: icons.paint,
    category: 'bBlocks',
    keywords: ['Highlight', 'Highlight Text', 'Color Text'],

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

        const textStyle = { padding: '3px 5px', fontSize: `${fontS}px`, color: color, backgroundColor: BGColor }

        return ([
            <InspectorControls>
                {/* Highlight Text Settings */}
                <PanelBody title="Highlight Text Settings" initialOpen={true}>
                    {/* Font Size */}
                    {firstTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={fontS} onChange={cng => setAttributes({ fontS: cng })} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={color} onChange={cng => setAttributes({ color: cng })} colors={colors} />

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />
                </PanelBody>
            </InspectorControls>,


            <RichText className="b_blocks_highlighter" key="editable" tagName="mark" placeholder="Write Your Highlight Text" value={text} onChange={cng => { setAttributes({ text: cng }) }} style={textStyle} />
        ])
    },

    save: props => {
        const { text, fontS, color, BGColor } = props.attributes;

        const textStyle = { padding: '3px 5px', fontSize: `${fontS}px`, color: color, backgroundColor: BGColor }

        return (
            <RichText.Content className="b_blocks_highlighter" tagName="mark" value={text} style={textStyle} />
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});