const { registerBlockType } = wp.blocks;
const { InspectorControls, ColorPalette, InnerBlocks } = wp.blockEditor;
const { PanelBody, RangeControl } = wp.components;


// Variables
import options from '../Const/options';
const { colors } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/section', {
    // Build In attributes
    title: 'Section',
    description: 'Section',
    icon: icons.section,
    category: 'bBlocks',
    keywords: ['Section', 'Section Content', 'Inner Block'],

    // Custom Attributes
    attributes: {
        BGColor: { type: 'string', default: '#f3f4f5' },
        PT: { type: 'number', default: 50 },
        PR: { type: 'number', default: 15 },
        PB: { type: 'number', default: 50 },
        PL: { type: 'number', default: 15 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { BGColor, PT, PR, PB, PL }, setAttributes } = props;

        const sectionStyle = {
            backgroundColor: '#dbd0ff', padding: `${PT}px ${PR}px ${PB}px ${PL}px`, position: 'relative',
            zIndex: '10'
        }

        return ([
            <InspectorControls>
                {/* Section Settings */}
                < PanelBody title="Section Settings" initialOpen={true} >
                    {/* Background Color */}
                    {firstTitle('Background Color:')}
                    < ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

                    {otherTitle('Padding Top:')}
                    < RangeControl value={PT} onChange={cng => setAttributes({ PT: cng })} min={0} max={150} step={1} />

                    {otherTitle('Padding Right:')}
                    < RangeControl value={PR} onChange={cng => setAttributes({ PR: cng })} min={0} max={100} step={1} />

                    {otherTitle('Padding Bottom:')}
                    < RangeControl value={PB} onChange={cng => setAttributes({ PB: cng })} min={0} max={150} step={1} />

                    {otherTitle('Padding Left:')}
                    < RangeControl value={PL} onChange={cng => setAttributes({ PL: cng })} min={0} max={100} step={1} />
                </PanelBody >
            </InspectorControls >,


            <div className="b_blocks_section" style={sectionStyle}>
                <InnerBlocks template={[['b-blocks/section-heading']]} />

                <div style={{ backgroundColor: BGColor, display: 'block', position: 'absolute', top: `${PT}px`, left: `${PL}px`, right: `${PR}px`, bottom: `${PB}px`, zIndex: '-1' }} />
            </div>
        ])
    },

    save: props => {
        const { BGColor, PT, PR, PB, PL } = props.attributes;

        const sectionStyle = { backgroundColor: BGColor, padding: `${PT}px ${PR}px ${PB}px ${PL}px` }

        return (
            <div className="b_blocks_section" style={sectionStyle}>
                <InnerBlocks.Content />
            </div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});