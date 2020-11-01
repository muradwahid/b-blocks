const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, CheckboxControl, ButtonGroup, Button } = wp.components;


// Variables
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

        toggleToTop: { type: 'boolean', default: false },
        toTopLabel: { type: 'string', default: 'Go to top', source: 'html', selector: '.b_blocks_to_top_link' },
        toTopFontSize: { type: 'number' },
        toTopColor: { type: 'string', default: '#777' },
        toTopPosition: { type: 'string', default: 'right' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { divideWidth, divideWidthType, divideThick, divideStyle, divideColor, divideMT, divideMB, dividePosition, toggleToTop, toTopLabel, toTopFontSize, toTopColor, toTopPosition }, setAttributes } = props;

        const containerStyle = { padding: `${divideMT}px 0 ${divideMB}px 0` };

        const dividerWrapStyle = { textAlign: dividePosition };
        const dividerStyle = { display: 'inline-block', width: `${divideWidth}${divideWidthType}`, borderBottom: `${divideThick}px ${divideStyle} ${divideColor}` };

        const toTopWrapStyle = { textAlign: toTopPosition };
        const toTopStyle = { fontSize: `${toTopFontSize}px`, color: toTopColor };

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

                    {/* Empty Space Before Divider */}
                    {otherTitle('Empty Space Before Divider:')}
                    <RangeControl value={divideMT} onChange={cng => setAttributes({ divideMT: cng })} min={0} max={100} step={1} />

                    {/* Empty Space After Divider */}
                    {otherTitle('Empty Space After Divider:')}
                    <RangeControl value={divideMB} onChange={cng => setAttributes({ divideMB: cng })} min={0} max={100} step={1} />

                    {/* Divider Position */}
                    {otherTitle('Divider Position:')}
                    <SelectControl value={dividePosition} onChange={cng => setAttributes({ dividePosition: cng })} options={alignOptions} />
                </PanelBody>


                <PanelBody title="Go To Top Settings">
                    {/* Enable/Disable Go To Top */}
                    <CheckboxControl label="Enable/Disable Go To Top" help="Checked to enable 'Go To Top' link" checked={toggleToTop} onChange={cng => setAttributes({ toggleToTop: cng })} />

                    {toggleToTop && <span>
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
                {toggleToTop && <div style={toTopWrapStyle}>
                    <RichText className="b_blocks_to_top_link" key="editable" tagName="a" href="#" placeholder="Enter Go to top label" value={toTopLabel} onChange={cng => { setAttributes({ toTopLabel: cng }) }} style={toTopStyle} />
                </div>}

                <div style={dividerWrapStyle}>
                    <div style={dividerStyle}></div>
                </div>
            </div>
        ]);
    },

    save: props => {
        const { divideWidth, divideWidthType, divideThick, divideStyle, divideColor, divideMT, divideMB, dividePosition, toggleToTop, toTopLabel, toTopFontSize, toTopColor, toTopPosition } = props.attributes;

        const containerStyle = { padding: `${divideMT}px 0 ${divideMB}px 0` };

        const dividerWrapStyle = { textAlign: dividePosition };
        const dividerStyle = { display: 'inline-block', width: `${divideWidth}${divideWidthType}`, borderBottom: `${divideThick}px ${divideStyle} ${divideColor}` };

        const toTopWrapStyle = { textAlign: toTopPosition };
        const toTopStyle = { fontSize: `${toTopFontSize}px`, color: toTopColor };

        return (
            <div style={containerStyle}>
                {toggleToTop && <div style={toTopWrapStyle}>
                    <RichText.Content className="b_blocks_to_top_link" tagName="a" href="#" value={toTopLabel} style={toTopStyle} />
                </div>}

                <div style={dividerWrapStyle}>
                    <div style={dividerStyle}></div>
                </div>
            </div>
        );
    },
});