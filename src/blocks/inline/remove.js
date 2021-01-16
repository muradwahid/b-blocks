const { registerFormatType } = wp.richText;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, Button } = wp.components;

const type = 'b-blocks/remove-inline-formats';

registerFormatType(type, {
    title: 'Remove Formatting',
    tagName: 'span',
    className: 'b_blocks_remove',
    edit({ isActive, value, onChange }) {
        return (
            <InspectorControls>
                <PanelBody title="Remove All Inline Formats" initialOpen={false}>
                    <Button isDefault={true} onClick={() => onChange({ ...value, formats: Array(value.formats.length) })}>Remove All Inline Formats</Button>
                </PanelBody>
            </InspectorControls>
        );
    }
});