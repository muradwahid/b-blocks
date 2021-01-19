const { registerBlockType } = wp.blocks;
const { InspectorControls, ColorPalette, InnerBlocks } = wp.blockEditor;
const { PanelBody, RangeControl } = wp.components;

// Variables
import options from '../Const/options';
const { colors } = options;

const userSelect = [
    { label: 'Auto', value: 'auto', icon: 'AUTO' },
    { label: 'All', value: 'all', icon: 'ALL' },
    { label: 'None', value: 'none', icon: 'NONE' },
];

// Components
import BtnGroup from '../GutenComp/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/selection', {
    // Build In attributes
    title: 'Selection',
    description: 'Selection',
    icon: icons.selection,
    category: 'bBlocks',
    keywords: ['Select', 'Text Selection', 'Block Selection'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        selection: { type: 'string', default: 'auto' },
        BGColor: { type: 'string', default: '#f1f1f1' },
        selectionPTB: { type: 'number', default: 10 },
        selectionPLR: { type: 'number', default: 15 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { selection, BGColor, selectionPTB, selectionPLR }, setAttributes } = props;

        // Styles
        const selectionStyle = { userSelect: `${selection}!important`, backgroundColor: BGColor, padding: `${selectionPTB}px  ${selectionPLR}px` };

        return ([
            <InspectorControls>
                {/* Selection Settings */}
                <PanelBody title="Selection Settings" initialOpen={true}>
                    {/* Selection */}
                    {firstTitle('Selection:')}
                    <BtnGroup options={userSelect} myValue={selection} setState={cng => setAttributes({ selection: cng })} />

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

                    {/* Padding Top Bottom */}
                    {otherTitle('Padding Top Bottom:')}
                    <RangeControl value={selectionPTB} onChange={cng => setAttributes({ selectionPTB: cng })} min={0} max={100} step={1} />

                    {/* Padding Left Right */}
                    {otherTitle('Padding Left Right:')}
                    <RangeControl value={selectionPLR} onChange={cng => setAttributes({ selectionPLR: cng })} min={0} max={150} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_selection">
                <div className="b_blocks_inner_content" style={selectionStyle}>
                    <InnerBlocks />
                </div>
            </div>
        ])
    },

    save: props => {
        const { selection, BGColor, selectionPTB, selectionPLR } = props.attributes;

        // Styles
        const selectionStyle = { userSelect: `${selection}!important`, backgroundColor: BGColor, padding: `${selectionPTB}px  ${selectionPLR}px`, textAlign: 'inherit' };

        return (
            <div className="b_blocks_selection">
                <div className="b_blocks_inner_content" style={selectionStyle}>
                    <InnerBlocks.Content />
                </div>
            </div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});