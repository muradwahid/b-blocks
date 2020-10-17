// Import Blocks
// import './section-heading/section-heading.js';
import './block/block.js';

//  Import CSS.
import './editor.scss';
import './style.scss';


const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, BlockControls, AlignmentToolbar, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, CheckboxControl, ButtonGroup, Button } = wp.components;

// Variables
const headingTags = [
    { label: 'Heading 1', value: 'h1' },
    { label: 'Heading 2', value: 'h2' },
    { label: 'Heading 3', value: 'h3' },
    { label: 'Heading 4', value: 'h4' },
    { label: 'Heading 5', value: 'h5' },
    { label: 'Heading 6', value: 'h6' }
];

const fontSizes = [
    { name: 'Small', slug: 'small', size: 13 },
    { name: 'Normal', slug: 'normal', size: 16 },
    { name: 'Medium', slug: 'medium', size: 20 },
    { name: 'Large', slug: 'large', size: 36 },
    { name: 'Huge', slug: 'huge', size: 48 }
];

const borderStyle = [
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
    { label: 'Dotted', value: 'dotted' },
    { label: 'Double', value: 'double' },
    { label: 'Groove', value: 'groove' },
    { label: 'Inset', value: 'inset' },
    { label: 'Outset', value: 'outset' },
    { label: 'Ridge', value: 'ridge' }
];

const alignOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' }
];

// Functions
const firstTitle = title => <p className="panel_single-title">{title}</p>;
const otherTitle = title => <p className="panel_single-title" style={{ marginTop: '25px' }}>{title}</p>;


// Section Heading //////////////////////////////////////////////////////////////////////////////////
registerBlockType('b-blocks/section-heading', {
    // Build In attributes
    title: 'Section Heading',
    description: 'Section Heading',
    icon: 'editor-code',
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        alignment: { type: 'string', default: 'center' },

        head: { type: 'string', source: 'html', selector: '.section_head' },
        headTag: { type: 'string', default: 'h2' },
        headFontSize: { type: 'number' },
        headColor: { type: 'string', default: '#333' },
        headMB: { type: 'number', default: 15 },

        sepWidth: { type: 'number', default: 150 },
        sepThick: { type: 'number', default: 3 },
        sepStyle: { type: 'string', default: 'solid' },
        sepColor: { type: 'string', default: '#777' },
        sepMB: { type: 'number', default: 15 },

        desc: { type: 'string', source: 'html', selector: '.section_description' },
        descFontSize: { type: 'number', default: 16 },
        descColor: { type: 'string', default: '#555' },
        descMB: { type: 'number', default: 15 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { alignment, head, headTag, headFontSize, headColor, headMB, sepWidth, sepThick, sepStyle, sepColor, sepMB, desc, descFontSize, descColor, descMB }, setAttributes } = props;

        const containerStyle = { textAlign: alignment }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` };

        const separatorStyle = { display: 'inline-block', width: `${sepWidth}px`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` };

        const descStyle = { fontSize: `${descFontSize}px`, color: descColor, margin: `${sepMB}px 0 ${descMB}px 0` };

        return ([
            <InspectorControls>
                {/* Content Settings */}
                <PanelBody title="Content Settings">
                    {firstTitle('Content Alignment:')}
                    <SelectControl value={alignment} onChange={cng => setAttributes({ alignment: cng })} options={alignOptions} />
                </PanelBody>


                {/* Headline Settings */}
                <PanelBody title="Headline Settings">
                    {/* Heading Tag */}
                    {firstTitle('Headline Tag:')}
                    <SelectControl value={headTag} onChange={cng => setAttributes({ headTag: cng })} options={headingTags} />

                    {/* Heading Font Size */}
                    {otherTitle('Headline Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={headFontSize} onChange={cng => setAttributes({ headFontSize: cng })} />

                    {/* Heading Color */}
                    {otherTitle('Headline Color:')}
                    <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} />

                    {/* After Heading Spacing */}
                    {otherTitle('After Heading Spacing:')}
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
                    <SelectControl value={sepStyle} onChange={cng => setAttributes({ sepStyle: cng })} options={borderStyle} />

                    {/* Separator Color */}
                    {otherTitle('Separator Color:')}
                    <ColorPalette value={sepColor} onChange={cng => setAttributes({ sepColor: cng })} />

                    {/* After Separator Spacing */}
                    {otherTitle('After Separator Spacing:')}
                    <RangeControl value={sepMB} onChange={cng => setAttributes({ sepMB: cng })} min={0} max={75} step={1} />
                </PanelBody>


                {/* Description Settings */}
                <PanelBody title="Description Settings">
                    {/* Heading Font Size */}
                    {firstTitle('Description Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={descFontSize} onChange={cng => setAttributes({ descFontSize: cng })} />

                    {/* Description Color */}
                    {otherTitle('Description Color:')}
                    <ColorPalette value={descColor} onChange={cng => setAttributes({ descColor: cng })} />

                    {/* After Description Spacing */}
                    {otherTitle('After Description Spacing:')}
                    <RangeControl value={descMB} onChange={cng => setAttributes({ descMB: cng })} min={0} max={100} step={1} />
                </PanelBody>
            </InspectorControls>,


            <div style={containerStyle}>
                <BlockControls>
                    <AlignmentToolbar value={alignment} onChange={cng => setAttributes({ alignment: cng })} />
                </BlockControls>

                <RichText className="section_head" key="editable" tagName={headTag} placeholder="Write a Headline" value={head} onChange={cng => { setAttributes({ head: cng }) }} style={headStyle} />

                <div style={separatorStyle}></div>

                <RichText className="section_description" key="editable" tagName="p" placeholder="Write a Description" value={desc} onChange={cng => { setAttributes({ desc: cng }) }} style={descStyle} />
            </div >
        ]);
    },

    save: props => {
        const { alignment, head, headTag, headFontSize, headColor, headMB, sepWidth, sepThick, sepStyle, sepColor, sepMB, desc, descFontSize, descColor, descMB } = props.attributes;

        const containerStyle = { textAlign: alignment }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` };

        const separatorStyle = { display: 'inline-block', width: `${sepWidth}px`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` };

        const descStyle = { fontSize: `${descFontSize}px`, color: descColor, margin: `${sepMB}px 0 ${descMB}px 0` };

        return (
            <div style={containerStyle}>
                <RichText.Content className="section_head" tagName={headTag} value={head} style={headStyle} />

                <div style={separatorStyle}></div>

                <RichText.Content className="section_description" tagName="p" value={desc} style={descStyle} />
            </div>
        );
    },
});



// Divider
registerBlockType('b-blocks/divider', {
    // Build In attributes
    title: 'Divider',
    description: 'Divider of your Section',
    icon: 'minus',
    category: 'bBlocks',

    // Custom Attributes
    attributes: {
        divideWidth: { type: 'number', default: 450 },
        divideWidthType: { type: 'string', default: 'px' },
        divideThick: { type: 'number', default: 3 },
        divideStyle: { type: 'string', default: 'solid' },
        divideColor: { type: 'string', default: '#777' },
        divideMT: { type: 'number', default: 10 },
        divideMB: { type: 'number', default: 15 },
        dividePosition: { type: 'string', default: 'center' },

        enableToTop: { type: 'boolean', default: false },
        toTopLabel: { type: 'string', default: 'Go to top', source: 'html', selector: '.to_top_link' },
        toTopFontSize: { type: 'number' },
        toTopColor: { type: 'string', default: '#777' },
        toTopPosition: { type: 'string', default: 'right' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { divideWidth, divideWidthType, divideThick, divideStyle, divideColor, divideMT, divideMB, dividePosition, enableToTop, toTopLabel, toTopFontSize, toTopColor, toTopPosition }, setAttributes } = props;

        const containerStyle = { padding: `${divideMT}px 0 ${divideMB}px 0` };

        const dividerWrapStyle = { textAlign: dividePosition };
        const dividerStyle = { display: 'inline-block', width: `${divideWidth}${divideWidthType}`, borderBottom: `${divideThick}px ${divideStyle} ${divideColor}` };

        const toTopWrapStyle = { textAlign: toTopPosition };
        const toTopStyle = { fontSize: `${toTopFontSize}px`, color: toTopColor };

        console.log(divideWidthType)

        return ([
            <InspectorControls>
                {/* Divider Settings */}
                <PanelBody title="Divider Settings">
                    {/* Divider Width */}
                    {firstTitle('Divider Width:')}
                    <ButtonGroup aria-label="Size Type" className="b_blocks_size_type">
                        <Button key="px" isSmall isPrimary={divideWidthType === "px"} aria-pressed={divideWidthType === "px"} onClick={() => setAttributes({ divideWidthType: "px", divideWidth: 450 })}>px</Button>

                        <Button key="%" isSmall isPrimary={divideWidthType === "%"} aria-pressed={divideWidthType === "%"} onClick={() => setAttributes({ divideWidthType: "%", divideWidth: 100 })}>%</Button>
                    </ButtonGroup>
                    <RangeControl value={divideWidth} onChange={cng => setAttributes({ divideWidth: cng })} min={0} max={("%" == divideWidthType) ? 100 : 960} step={1} />

                    {/* Divider Thickness */}
                    {firstTitle('Divider Thickness:')}
                    <RangeControl value={divideThick} onChange={cng => setAttributes({ divideThick: cng })} min={0} max={20} step={.1} />

                    {/* Divider Style */}
                    {otherTitle('Divider Style:')}
                    <SelectControl value={divideStyle} onChange={cng => setAttributes({ divideStyle: cng })} options={borderStyle} />

                    {/* Divider Color */}
                    {otherTitle('Divider Color:')}
                    <ColorPalette value={divideColor} onChange={cng => setAttributes({ divideColor: cng })} />

                    {/* Before Divider Spacing */}
                    {otherTitle('Before Divider Spacing:')}
                    <RangeControl value={divideMT} onChange={cng => setAttributes({ divideMT: cng })} min={0} max={100} step={1} />

                    {/* After Divider Spacing */}
                    {otherTitle('After Divider Spacing:')}
                    <RangeControl value={divideMB} onChange={cng => setAttributes({ divideMB: cng })} min={0} max={100} step={1} />

                    {/* Divider Position */}
                    {otherTitle('Divider Position:')}
                    <SelectControl value={dividePosition} onChange={cng => setAttributes({ dividePosition: cng })} options={alignOptions} />
                </PanelBody>


                <PanelBody title="Go To Top Settings">
                    {/* Enable/Disable Go To Top */}
                    {firstTitle('Enable/Disable Go To Top:')}
                    <CheckboxControl label="Go To Top" help="Enable/Disable Go To Top" checked={enableToTop} onChange={toggle => setAttributes({ enableToTop: toggle })} />

                    {enableToTop && <span>
                        {/* Go To Top Font Size */}
                        {otherTitle('Go To Top Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={toTopFontSize} onChange={cng => setAttributes({ toTopFontSize: cng })} />

                        {/* Go To Top Color */}
                        {otherTitle('Go To Top Color:')}
                        <ColorPalette value={toTopColor} onChange={cng => setAttributes({ toTopColor: cng })} />

                        {/* Go To Top Position */}
                        {otherTitle('Go To Top Position:')}
                        <SelectControl value={toTopPosition} onChange={cng => setAttributes({ toTopPosition: cng })} options={alignOptions} />
                    </span>}
                </PanelBody>
            </InspectorControls>,


            <div style={containerStyle}>
                {enableToTop && <div style={toTopWrapStyle}>
                    <RichText className="to_top_link" key="editable" tagName="a" href="#" placeholder="Enter Go to top label" value={toTopLabel} onChange={cng => { setAttributes({ toTopLabel: cng }) }} style={toTopStyle} />
                </div>}

                <div style={dividerWrapStyle}>
                    <div style={dividerStyle}></div>
                </div>
            </div>
        ]);
    },

    save: props => {
        const { divideWidth, divideWidthType, divideThick, divideStyle, divideColor, divideMT, divideMB, dividePosition, enableToTop, toTopLabel, toTopFontSize, toTopColor, toTopPosition } = props.attributes;

        const containerStyle = { padding: `${divideMT}px 0 ${divideMB}px 0` };

        const dividerWrapStyle = { textAlign: dividePosition };
        const dividerStyle = { display: 'inline-block', width: `${divideWidth}${divideWidthType}`, borderBottom: `${divideThick}px ${divideStyle} ${divideColor}` };

        const toTopWrapStyle = { textAlign: toTopPosition };
        const toTopStyle = { fontSize: `${toTopFontSize}px`, color: toTopColor };

        return (
            <div style={containerStyle}>
                {enableToTop && <div style={toTopWrapStyle}>
                    <RichText.Content className="to_top_link" tagName="a" href="#" value={toTopLabel} style={toTopStyle} />
                </div>}

                <div style={dividerWrapStyle}>
                    <div style={dividerStyle}></div>
                </div>
            </div>
        );
    },
})