const { registerBlockType } = wp.blocks;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, RangeControl, ResizableBox } = wp.components;

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
        align: { type: 'string', default: 'full' },

        height: { type: 'number', default: 50 }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { height }, setAttributes, isSelected, toggleSelection } = props;

        return ([
            <InspectorControls>
                {/* Spacer Settings */}
                <PanelBody title="Spacer Settings" initialOpen={true}>
                    {/* Height/Size */}
                    {firstTitle('Height/Size:')}
                    <RangeControl value={height} onChange={cng => setAttributes({ height: cng })} min={0} max={1000} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_spacer">
                <div style={{ height: `${height}px`, color: '#4527a4', backgroundColor: `${isSelected ? '#edf3ff' : ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                    SPACER ---- This content {isSelected && '& background color '}

                    <ResizableBox size={{ height }} enable={{ bottom: true }} onResizeStop={(event, direction, elt, delta) => {
                        setAttributes({ height: parseInt(height + delta.height, 0) });
                        toggleSelection(true);
                    }} onResizeStart={() => {
                        toggleSelection(false);
                    }} />
                    will not show in front End
                </div>
            </div>
        ])
    },

    save: props => {
        const { height } = props.attributes;

        return (
            <div className="b_blocks_spacer">
                <div style={{ height: `${height}px`, textAlign: 'inherit' }}></div>
            </div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});