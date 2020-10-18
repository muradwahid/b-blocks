const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl } = wp.components;


// Functions
const firstTitle = title => <p className="panel_single-title">{title}</p>;


registerBlockType('b-blocks/spacer', {
    // Build In attributes
    title: 'Spacer',
    description: 'Space in content',
    icon: 'button',
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        height: { type: 'number', default: 50 }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { height }, setAttributes } = props;

        return ([
            <InspectorControls>
                {/* Spacer Settings */}
                <PanelBody title="Divider Settings">
                    {/* Spacer Height/Size */}
                    {firstTitle('Spacer Height/Size:')}
                    <RangeControl value={height} onChange={cng => setAttributes({ height: cng })} min={0} max={300} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div style={{ height: `${height}px`, color: '#9a9a9a', backgroundColor: '#edf3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>This content & background color will not show in frontend</div>
        ])
    },

    save: props => {
        const { height } = props.attributes;

        return (
            <div style={{ height: `${height}px` }}></div>
        )
    },
});