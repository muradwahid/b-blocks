const { registerFormatType } = wp.richText;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, Button } = wp.components;

const type = 'b-blocks/remove-inline-formate';

registerFormatType('b-blocks/remove-inline-formate', {
    title: 'Remove formatting',
    tagName: 'span',
    className: 'b_blocks_remove',
    edit({ isActive, value, onChange }) {
        return (
            <InspectorControls>
                <PanelBody title="Remove All Inline Format" initialOpen={false}>
                    <Button isDefault={true} onClick={() => onChange({ ...value, formats: Array(value.formats.length) })}>Remove All Inline format</Button>
                </PanelBody>
            </InspectorControls>
        );
    }
});