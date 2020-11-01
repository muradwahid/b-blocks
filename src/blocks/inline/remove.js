const { registerFormatType } = wp.richText;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, Button } = wp.components;

const type = 'b-blocks/remove-formatting';

registerFormatType('b-blocks/remove-formatting', {
    title: 'Remove formatting',
    tagName: 'span',
    className: 'b_blocks_remove',
    edit({ isActive, value, onChange }) {
        return (
            <InspectorControls>
                <PanelBody title="Remove All Formatting">
                    <Button isDefault={true} onClick={() => onChange({ ...value, formats: Array(value.formats.length) })}>Remove All formatting</Button>
                </PanelBody>
            </InspectorControls>
        );
    }
});