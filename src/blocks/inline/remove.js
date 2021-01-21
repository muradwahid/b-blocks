const { __ } = wp.i18n;
const { registerFormatType } = wp.richText;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, Button } = wp.components;

const type = 'b-blocks/remove-inline-formats';

registerFormatType(type, {
    title: __('Remove Formatting', 'b-blocks'),
    tagName: 'span',
    className: 'b_blocks_remove',
    edit({ isActive, value, onChange }) {
        return (
            <InspectorControls>
                <PanelBody title={__('Remove All Inline Formats', 'b-blocks')} initialOpen={false}>
                    <Button isDefault={true} onClick={() => onChange({ ...value, formats: Array(value.formats.length) })}>{__('Remove All Inline Formats', 'b-blocks')}</Button>
                </PanelBody>
            </InspectorControls>
        );
    }
});