const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, ToggleControl } = wp.components;


// Variables
import options from '../Const/options';
const { hTags, fontSizes, borderStyles, colors } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/note', {
    // Build In attributes
    title: 'Note',
    description: 'Create Note by Block',
    icon: icons.note,
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        BGColor: { type: 'string', default: '#ffff66' },
        padTB: { type: 'number', default: 15 },
        padLR: { type: 'number', default: 15 },
        borderRadius: { type: 'number', default: 5 },

        toggleHead: { type: 'boolean', default: true },
        head: { type: 'string', source: 'html', selector: '.b_blocks_note_head' },
        headTag: { type: 'string', default: 'h2' },
        headFontSize: { type: 'number' },
        headColor: { type: 'string', default: '#333' },
        headPB: { type: 'number', default: 5 },
        headMB: { type: 'number', default: 5 },

        sepThick: { type: 'number', default: 2 },
        sepStyle: { type: 'string', default: 'solid' },
        sepColor: { type: 'string', default: '#777' },

        content: { type: 'string', source: 'html', selector: '.b_blocks_note_content' },
        contentFontSize: { type: 'number' },
        contentColor: { type: 'string', default: '#333' },
        contentMB: { type: 'number', default: 0 }
    },

    // Build In Functions
    edit: props => {
        const { attributes: { BGColor, padTB, padLR, borderRadius, toggleHead, head, headTag, headFontSize, headColor, headPB, headMB, sepThick, sepStyle, sepColor, content, contentFontSize, contentColor, contentMB }, setAttributes } = props;

        const containerStyle = { backgroundColor: BGColor, padding: `${padTB}px ${padLR}px`, borderRadius: `${borderRadius}px` }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, padding: `0 0  ${headPB}px 0`, margin: `0 0 ${headMB}px 0`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` }

        const contentStyle = { fontSize: `${contentFontSize}px`, color: contentColor, margin: `0 0  ${contentMB}px 0` }

        return ([
            <InspectorControls>
                {/* Note Settings */}
                <PanelBody title="Note Settings">
                    {/* Note Background Color */}
                    {firstTitle('Note Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

                    {/* Note Top Bottom Padding */}
                    {otherTitle('Note Top Bottom Padding:')}
                    <RangeControl value={padTB} onChange={cng => setAttributes({ padTB: cng })} min={0} max={50} step={1} />

                    {/* Note Left Right Padding */}
                    {otherTitle('Note Left Right Padding:')}
                    <RangeControl value={padLR} onChange={cng => setAttributes({ padLR: cng })} min={0} max={50} step={1} />

                    {/* Note Border Radius */}
                    {otherTitle('Note Border Radius:')}
                    <RangeControl value={borderRadius} onChange={cng => setAttributes({ borderRadius: cng })} min={0} max={30} step={1} />
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody title="Heading Settings">
                    {/* Enable/Disable Heading */}
                    <ToggleControl label={toggleHead ? 'Disable Heading' : 'Enable Heading'} checked={toggleHead} onChange={cng => setAttributes({ toggleHead: cng })} />

                    {toggleHead && <span>
                        {/* Heading Tag */}
                        {otherTitle('Heading Tag:')}
                        <SelectControl value={headTag} onChange={cng => setAttributes({ headTag: cng })} options={hTags} />

                        {/* Heading Font Size */}
                        {otherTitle('Heading Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={headFontSize} onChange={cng => setAttributes({ headFontSize: cng })} />

                        {/* Heading Color */}
                        {otherTitle('Heading Color:')}
                        <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

                        {/* Empty Space After Heading */}
                        {otherTitle('Empty Space After Heading:')}
                        <RangeControl value={headPB} onChange={cng => setAttributes({ headPB: cng })} min={0} max={50} step={1} />
                    </span>}
                </PanelBody>


                {toggleHead && <span>
                    {/* Separator Settings */}
                    <PanelBody title="Separator Settings">
                        {/* Separator Thickness */}
                        {firstTitle('Separator Thickness:')}
                        <RangeControl value={sepThick} onChange={cng => setAttributes({ sepThick: cng })} min={0} max={20} step={.1} />

                        {/* Separator Style */}
                        {otherTitle('Separator Style:')}
                        <SelectControl value={sepStyle} onChange={cng => setAttributes({ sepStyle: cng })} options={borderStyles} />

                        {/* Separator Color */}
                        {otherTitle('Separator Color:')}
                        <ColorPalette value={sepColor} onChange={cng => setAttributes({ sepColor: cng })} colors={colors} />

                        {/* Empty Space After Separator */}
                        {otherTitle('Empty Space After Separator:')}
                        <RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={50} step={1} />
                    </PanelBody>
                </span>}


                {/* Content Settings */}
                <PanelBody title="Content Settings">
                    {/* Content Font Size */}
                    {firstTitle('Content Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={contentFontSize} onChange={cng => setAttributes({ contentFontSize: cng })} />

                    {/* Content Color */}
                    {otherTitle('Content Color:')}
                    <ColorPalette value={contentColor} onChange={cng => setAttributes({ contentColor: cng })} colors={colors} />

                    {/* Empty Space After Content */}
                    {otherTitle('Empty Space After Content:')}
                    <RangeControl value={contentMB} onChange={cng => setAttributes({ contentMB: cng })} min={0} max={50} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div style={containerStyle}>
                {toggleHead && <span><RichText className="b_blocks_note_head" key="editable" tagName={headTag} placeholder="Write Note Heading" value={head} onChange={cng => { setAttributes({ head: cng }) }} style={headStyle} /></span>}

                < RichText className="b_blocks_note_content" key="editable" tagName="p" placeholder="Write Note Content" value={content} onChange={cng => { setAttributes({ content: cng }) }} style={contentStyle} />
            </div >
        ]);
    },

    save: props => {
        const { BGColor, padTB, padLR, borderRadius, toggleHead, head, headTag, headFontSize, headColor, headPB, headMB, sepThick, sepStyle, sepColor, content, contentFontSize, contentColor, contentMB } = props.attributes;

        const containerStyle = { backgroundColor: BGColor, padding: `${padTB}px ${padLR}px`, borderRadius: `${borderRadius}px` }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, padding: `0 0  ${headPB}px 0`, margin: `0 0 ${headMB}px 0`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` }

        const contentStyle = { fontSize: `${contentFontSize}px`, color: contentColor, margin: `0 0  ${contentMB}px 0` }

        return (
            <div style={containerStyle}>
                {toggleHead && <span><RichText.Content className="b_blocks_note_head" tagName={headTag} value={head} style={headStyle} /></span>}

                <RichText.Content className="b_blocks_note_content" tagName="p" value={content} style={contentStyle} />
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});
