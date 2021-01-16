const { InspectorControls } = wp.blockEditor;
const { PanelBody, FormToggle, PanelRow } = wp.components;
const { registerFormatType, unregisterFormatType, toggleFormat } = wp.richText;


const type = 'b-blocks/text-highlight';

registerFormatType(type, {
    title: 'Inline Highlight',
    tagName: 'mark',
    className: 'b_blocks_text_highlight',

    attributes: {
        style: 'style',
    },

    edit: ({ isActive, value, onChange }) => {
        const onToggle = () => {
            onChange(toggleFormat(value, {
                type,
                attributes: {
                    style: 'color: #333; background-color: #beff14; padding: .2em; border-radius: 5px;',
                },
            }))
        }

        return [
            <InspectorControls>
                <PanelBody icon='admin-customizer' title="Inline Highlight" initialOpen={false}>
                    <PanelRow>
                        <label htmlFor="b_blocks_text_highlight_toggle">{isActive ? 'Remove Inline Highlight' : 'Inline Highlight'}</label>

                        <FormToggle id="b_blocks_text_highlight_toggle" checked={isActive} onChange={onToggle} />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        ];
    }
});