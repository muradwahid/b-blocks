const { registerFormatType, applyFormat, removeFormat, getActiveFormat } = wp.richText;
const { InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody } = wp.components;
const { Fragment } = wp.element;
const { RichTextToolbarButton } = wp.blockEditor;


// Variables
import options from '../../Const/options';
const { colors } = options;


const allOptions = [
    // { name: 'color', title: 'Inline Color' },
    { name: 'background-color', title: 'Inline Background Color' }
];

allOptions.forEach(({ name, title }) => {
    const type = `b-blocks/${name}`;

    registerFormatType(type, {
        title,
        tagName: 'span',
        className: `b_blocks_${name}`,

        attributes: {
            style: 'style'
        },

        edit({ isActive, value, onChange }) {
            let activeColor;

            if (isActive) {
                const activeFormat = getActiveFormat(value, type)
                const style = activeFormat.attributes.style

                activeColor = style.replace(new RegExp(`^${name}:\\s*`), '');
            }


            return (
                <InspectorControls>
                    <PanelBody icon='admin-customizer' title={title} initialOpen={false}>
                        <ColorPalette value={activeColor} onChange={color => {
                            if (color) {
                                onChange(applyFormat(value, {
                                    type,
                                    attributes: { style: `${name}:${color}` }
                                }))
                                return
                            }

                            onChange(removeFormat(value, type));
                        }} colors={colors} />
                    </PanelBody>
                </InspectorControls>
            );
        }
    });
});