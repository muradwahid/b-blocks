const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, BlockControls, AlignmentToolbar, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, ToggleControl } = wp.components;


// Variables
import options from '../Const/options';
const { hTags, fontSizes, aligns, borderStyles, colors } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/section-heading', {
    // Build In attributes
    title: 'Section Heading',
    description: 'Awesome Section Heading',
    icon: icons.h,
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        alignment: { type: 'string', default: 'center' },

        head: { type: 'string', source: 'html', selector: '.b_blocks_section_head' },
        headTag: { type: 'string', default: 'h2' },
        headFontSize: { type: 'number' },
        headColor: { type: 'string', default: '#333' },
        headMB: { type: 'number', default: 10 },

        sepWidth: { type: 'number', default: 150 },
        sepThick: { type: 'number', default: 3 },
        sepStyle: { type: 'string', default: 'solid' },
        sepColor: { type: 'string', default: '#777' },
        sepMB: { type: 'number', default: 5 },

        toggleDesc: { type: 'boolean', default: true },
        desc: { type: 'string', source: 'html', selector: '.b_blocks_section_description' },
        descFontSize: { type: 'number', default: 16 },
        descColor: { type: 'string', default: '#555' },
        descMB: { type: 'number', default: 15 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { alignment, head, headTag, headFontSize, headColor, headMB, sepWidth, sepThick, sepStyle, sepColor, sepMB, toggleDesc, desc, descFontSize, descColor, descMB }, setAttributes } = props;

        const containerStyle = { textAlign: alignment }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` };

        const separatorStyle = { display: 'inline-block', width: `${sepWidth}px`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` };

        const descStyle = { fontSize: `${descFontSize}px`, color: descColor, margin: `${sepMB}px 0 ${descMB}px 0` };

        return ([
            <InspectorControls>
                {/* Content Settings */}
                <PanelBody title="Content Settings">
                    {/* Content Alignment */}
                    {firstTitle('Content Alignment:')}
                    <SelectControl value={alignment} onChange={cng => setAttributes({ alignment: cng })} options={aligns} />
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody title="Heading Settings">
                    {/* Heading Tag */}
                    {firstTitle('Heading Tag:')}
                    <SelectControl value={headTag} onChange={cng => setAttributes({ headTag: cng })} options={hTags} />

                    {/* Heading Font Size */}
                    {otherTitle('Heading Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={headFontSize} onChange={cng => setAttributes({ headFontSize: cng })} />

                    {/* Heading Color */}
                    {otherTitle('Heading Color:')}
                    <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

                    {/* Empty Space After Heading */}
                    {otherTitle('Empty Space After Heading:')}
                    <RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={50} step={1} />
                </PanelBody>


                {/* Separator Settings */}
                <PanelBody title="Separator Settings">
                    {/* Separator Width */}
                    {firstTitle('Separator Width:')}
                    <RangeControl value={sepWidth} onChange={cng => setAttributes({ sepWidth: cng })} min={0} max={1920} step={1} />

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
                    <RangeControl value={sepMB} onChange={cng => setAttributes({ sepMB: cng })} min={0} max={75} step={1} />
                </PanelBody>


                {/* Description Settings */}
                <PanelBody title="Description Settings">
                    {/* Enable/Disable Description */}
                    <ToggleControl label={toggleDesc ? 'Disable Description' : 'Enable Description'} checked={toggleDesc} onChange={cng => setAttributes({ toggleDesc: cng })} />

                    {toggleDesc && <span>
                        {/* Description Font Size */}
                        {firstTitle('Description Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={descFontSize} onChange={cng => setAttributes({ descFontSize: cng })} />

                        {/* Description Color */}
                        {otherTitle('Description Color:')}
                        <ColorPalette value={descColor} onChange={cng => setAttributes({ descColor: cng })} colors={colors} />

                        {/* Empty Space After Description */}
                        {otherTitle('Empty Space After Description:')}
                        <RangeControl value={descMB} onChange={cng => setAttributes({ descMB: cng })} min={0} max={100} step={1} />
                    </span>}
                </PanelBody>
            </InspectorControls>,


            <div style={containerStyle}>
                <BlockControls>
                    <AlignmentToolbar value={alignment} onChange={cng => setAttributes({ alignment: cng })} />
                </BlockControls>

                <RichText className="b_blocks_section_head" key="editable" tagName={headTag} placeholder="Write Section Heading" value={head} onChange={cng => { setAttributes({ head: cng }) }} style={headStyle} />

                <div style={separatorStyle}></div>

                {toggleDesc && <span><RichText className="b_blocks_section_description" key="editable" tagName="p" placeholder="Write Section Description" value={desc} onChange={cng => { setAttributes({ desc: cng }) }} style={descStyle} /></span>}
            </div >
        ]);
    },

    save: props => {
        const { alignment, head, headTag, headFontSize, headColor, headMB, sepWidth, sepThick, sepStyle, sepColor, sepMB, toggleDesc, desc, descFontSize, descColor, descMB } = props.attributes;

        const containerStyle = { textAlign: alignment }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` };

        const separatorStyle = { display: 'inline-block', width: `${sepWidth}px`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` };

        const descStyle = { fontSize: `${descFontSize}px`, color: descColor, margin: `${sepMB}px 0 ${descMB}px 0` };

        return (
            <div style={containerStyle}>
                <RichText.Content className="b_blocks_section_head" tagName={headTag} value={head} style={headStyle} />

                <div style={separatorStyle}></div>

                {toggleDesc && <span><RichText.Content className="b_blocks_section_description" tagName="p" value={desc} style={descStyle} /></span>}
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});