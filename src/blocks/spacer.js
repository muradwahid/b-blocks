const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl } = wp.components;

// Functions
import func from '../Const/functions';
const { firstTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/spacer', {
    // Build In attributes
    title: 'Spacer',
    description: 'Space in content',
    icon: icons.rectangle,
    category: 'bBlocks',
    keywords: ['Spacer', 'Empty Space', 'Empty'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        height: { type: 'number', default: 50 }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { height }, setAttributes, isSelected } = props;

        return ([
            <InspectorControls>
                {/* Spacer Settings */}
                <PanelBody title="Spacer Settings" initialOpen={true}>
                    {/* Height/Size */}
                    {firstTitle('Height/Size:')}
                    <RangeControl value={height} onChange={cng => setAttributes({ height: cng })} min={0} max={500} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div style={{ height: `${height}px`, color: '#4527a4', backgroundColor: `${isSelected ? '#edf3ff' : ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{isSelected && 'This content & background color will not show in front End'}</div>
        ])
    },

    save: props => {
        const { height } = props.attributes;

        return (
            <div style={{ height: `${height}px` }}></div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});