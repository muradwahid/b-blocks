const { registerBlockType } = wp.blocks;
const { InspectorControls, ColorPalette, InnerBlocks } = wp.blockEditor;
const { PanelBody, Button, ButtonGroup, RangeControl, Tooltip } = wp.components;

// Variables
import options from '../Const/options';
const { colors, userSelect } = options;

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
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(userSelect).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={selection === obj.value} aria-pressed={selection === obj.value} onClick={() => setAttributes({ selection: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

                    {/* Padding Top Bottom */}
                    {otherTitle('Padding Top Bottom:')}
                    <RangeControl value={selectionPTB} onChange={cng => setAttributes({ selectionPTB: cng })} min={0} max={50} step={1} />

                    {/* Padding Left Right */}
                    {otherTitle('Padding Left Right:')}
                    <RangeControl value={selectionPLR} onChange={cng => setAttributes({ selectionPLR: cng })} min={0} max={100} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_selection" style={selectionStyle}>
                <InnerBlocks />
            </div>
        ])
    },

    save: props => {
        const { selection, BGColor, selectionPTB, selectionPLR } = props.attributes;

        // Styles
        const selectionStyle = { userSelect: `${selection}!important`, backgroundColor: BGColor, padding: `${selectionPTB}px  ${selectionPLR}px` };

        return (
            <div className="b_blocks_selection" style={selectionStyle}>
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