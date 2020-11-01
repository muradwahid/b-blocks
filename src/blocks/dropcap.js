const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, BlockControls, AlignmentToolbar, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, CheckboxControl, ButtonGroup, Button } = wp.components;


// Functions
const firstTitle = title => <p className="panel_single-title">{title}</p>;
const otherTitle = title => <p className="panel_single-title" style={{ marginTop: '25px' }}>{title}</p>;


registerBlockType('b-blocks/dropcap', {
    // Build In attributes
    title: 'Drop Cap',
    description: 'Drop Cap in your page or posts',
    icon: 'editor-textcolor',
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        content: { type: 'string', source: 'html', selector: '.b_blocks_dropcap' },
        alignment: { type: 'string', default: 'left' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { content, alignment }, setAttributes } = props;

        const dropContentAll = document.querySelectorAll('.b_blocks_dropcap');
        for (let i = 0; i < dropContentAll.length; i++) {
            const dropContent = dropContentAll[i].innerHTML;
            const repDropFirstLetter = dropContent.replace(dropContent.charAt(0), '<span class="b_blocks_dropcap_letter">' + dropContent.charAt(0) + '</span>');

            // dropContentAll[i].innerHTML = repDropFirstLetter;
            // console.log(dropContentAll[i]);
        }

        // dropContentAll.forEach(dC => {
        //     const dropContent = dC.innerHTML;
        //     const repDropFirstLetter = dropContent.replace(dropContent.charAt(0), '<span class="b_blocks_dropcap_letter">' + dropContent.charAt(0) + '</span>');

        //     // dC.innerHTML = repDropFirstLetter;

        //     console.log(repDropFirstLetter)
        // });

        return (
            <div>
                <BlockControls>
                    <AlignmentToolbar value={alignment} onChange={cng => setAttributes({ alignment: cng })} />
                </BlockControls>
                <RichText className="b_blocks_dropcap" key="editable" tagName="p" placeholder="Enter Your Content" value={content} onChange={cng => { setAttributes({ content: cng }) }} style={{ textAlign: alignment }} />
            </div>
        );
    },

    save: props => {
        const { content, alignment } = props.attributes;

        return (
            <div>
                <RichText.Content className="b_blocks_dropcap" tagName="p" value={content} style={{ textAlign: alignment }} />
            </div>
        );
    },
});