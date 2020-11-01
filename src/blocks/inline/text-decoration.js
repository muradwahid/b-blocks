const { InspectorControls } = wp.blockEditor;
const { PanelBody, FormToggle, PanelRow } = wp.components;
const { registerFormatType, unregisterFormatType, toggleFormat } = wp.richText;


const allOptions = [
    { name: 'underline', title: 'Text Underline' },
    { name: 'overline', title: 'Text Overline' },
    { name: 'line-through', title: 'Text Line Through' }
];

allOptions.forEach(({ name, title }) => {
    const type = `b-blocks/text-${name}`;

    registerFormatType(type, {
        title,
        tagName: 'span',
        className: `b_blocks_text_${name}`,

        attributes: {
            style: 'style',
        },

        edit: (props) => {
            const { isActive, value, onChange } = props;

            const onToggle = () => {
                onChange(toggleFormat(value, {
                    type,
                    attributes: {
                        style: `text-decoration: ${name};`,
                    },
                }))
            }

            return [
                <InspectorControls>
                    <PanelBody icon='minus' title={title}>
                        <PanelRow>
                            <label htmlFor={`b_blocks_text_${name}_toggle`}>{isActive ? `Remove ${title}` : title}</label>

                            <FormToggle id={`b_blocks_text_${name}_toggle`} checked={isActive} onChange={onToggle} />
                        </PanelRow>
                    </PanelBody>
                </InspectorControls>
            ];
        }
    }
    );
});