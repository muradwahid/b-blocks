const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, ToggleControl } = wp.components;

// Variables
import options from '../Const/options';
const { hTags, fontSizes, borderStyles, colors } = options;

// Components
import BtnGroup from '../GutenComp/BtnGroup'

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
    keywords: ['Note', 'Note Text', 'Store Text'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'wide' },

        BGColor: { type: 'string', default: '#ffff66' },
        padTB: { type: 'number', default: 15 },
        padLR: { type: 'number', default: 15 },
        borderRadius: { type: 'number', default: 5 },

        toggleHead: { type: 'boolean', default: true },
        head: { type: 'string', source: 'html', selector: '.b_blocks_note_head' },
        headTag: { type: 'string', default: 'h2' },
        headFontSize: { type: 'number', default: 25 },
        headColor: { type: 'string', default: '#4527a4' },
        headPB: { type: 'number', default: 5 },
        headMB: { type: 'number', default: 5 },

        sepThick: { type: 'number', default: 2 },
        sepStyle: { type: 'string', default: 'solid' },
        sepColor: { type: 'string', default: '#8344c5' },

        content: { type: 'string', source: 'html', selector: '.b_blocks_note_content' },
        contentFontSize: { type: 'number', default: 15 },
        contentColor: { type: 'string', default: '#333' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { BGColor, padTB, padLR, borderRadius, toggleHead, head, headTag, headFontSize, headColor, headPB, headMB, sepThick, sepStyle, sepColor, content, contentFontSize, contentColor }, setAttributes } = props;

        // Styles
        const containerStyle = { backgroundColor: BGColor, padding: `${padTB}px ${padLR}px`, borderRadius: `${borderRadius}px` }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, padding: `0 0  ${headPB}px 0`, margin: `0 0 ${headMB}px 0`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` }

        const contentStyle = { fontSize: `${contentFontSize}px`, color: contentColor, margin: `0` }

        return ([
            <InspectorControls>
                {/* Note Settings */}
                <PanelBody title="Note Settings" initialOpen={true}>
                    {/* Background Color */}
                    {firstTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={padTB} onChange={cng => setAttributes({ padTB: cng })} min={0} max={100} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={padLR} onChange={cng => setAttributes({ padLR: cng })} min={0} max={150} step={1} />

                    {/* Border Radius */}
                    {otherTitle('Border Radius:')}
                    <RangeControl value={borderRadius} onChange={cng => setAttributes({ borderRadius: cng })} min={0} max={50} step={1} />
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody title="Heading Settings" initialOpen={false}>
                    {/* Enable/Disable Heading */}
                    <ToggleControl label={toggleHead ? 'Disable Heading' : 'Enable Heading'} checked={toggleHead} onChange={cng => setAttributes({ toggleHead: cng })} />

                    {toggleHead && <span>
                        {/* Heading Tag */}
                        {otherTitle('Heading Tag:')}
                        <BtnGroup options={hTags} myValue={headTag} setState={(cng, def) => setAttributes({ headTag: cng, headFontSize: def })} />

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={25} value={headFontSize} onChange={cng => setAttributes({ headFontSize: 'undefined' === typeof cng ? 25 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

                        {/* Margin Bottom */}
                        {otherTitle('Margin Bottom:')}
                        <RangeControl value={headPB} onChange={cng => setAttributes({ headPB: cng })} min={0} max={100} step={1} />
                    </span>}
                </PanelBody>


                {toggleHead && <span>
                    {/* Separator Settings */}
                    <PanelBody title="Separator Settings" initialOpen={false}>
                        {/* Thickness */}
                        {firstTitle('Thickness:')}
                        <RangeControl value={sepThick} onChange={cng => setAttributes({ sepThick: cng })} min={0} max={50} step={.1} />

                        {/* Style */}
                        {otherTitle('Style:')}
                        <SelectControl value={sepStyle} onChange={cng => setAttributes({ sepStyle: cng })} options={borderStyles} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={sepColor} onChange={cng => setAttributes({ sepColor: cng })} colors={colors} />

                        {/* Margin Bottom */}
                        {otherTitle('Margin Bottom:')}
                        <RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={100} step={1} />
                    </PanelBody>
                </span>}


                {/* Content Settings */}
                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Font Size */}
                    {firstTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={contentFontSize} onChange={cng => setAttributes({ contentFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={contentColor} onChange={cng => setAttributes({ contentColor: cng })} colors={colors} />
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_note" style={containerStyle}>
                {toggleHead && <span><RichText className="b_blocks_note_head" key="editable" tagName={headTag} placeholder="Write Note Heading" value={head} onChange={cng => { setAttributes({ head: cng }) }} inlineToolbar style={headStyle} /></span>}

                <RichText className="b_blocks_note_content" key="editable" tagName="p" placeholder="Write Note Content" value={content} onChange={cng => { setAttributes({ content: cng }) }} inlineToolbar style={contentStyle} />
            </div>
        ]);
    },

    save: props => {
        const { BGColor, padTB, padLR, borderRadius, toggleHead, head, headTag, headFontSize, headColor, headPB, headMB, sepThick, sepStyle, sepColor, content, contentFontSize, contentColor } = props.attributes;

        // Styles
        const containerStyle = { backgroundColor: BGColor, padding: `${padTB}px ${padLR}px`, borderRadius: `${borderRadius}px`, textAlign: 'inherit' }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, padding: `0 0  ${headPB}px 0`, margin: `0 0 ${headMB}px 0`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` }

        const contentStyle = { fontSize: `${contentFontSize}px`, color: contentColor, margin: `0` }

        return (
            <div className="b_blocks_note" style={containerStyle}>
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
