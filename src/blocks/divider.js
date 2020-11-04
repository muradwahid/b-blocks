const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, ToggleControl, ButtonGroup, Button } = wp.components;


// Variables
import options from '../Const/options';
const { fontSizes, aligns, borderStyles, colors } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/divider', {
    // Build In attributes
    title: 'Divider',
    description: 'Divider of your Section',
    icon: icons.minus,
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
                    <SelectControl value={divideStyle} onChange={cng => setAttributes({ divideStyle: cng })} options={borderStyles} />

                    {/* Divider Color */}
                    {otherTitle('Divider Color:')}
                    <ColorPalette value={divideColor} onChange={cng => setAttributes({ divideColor: cng })} colors={colors} />

                    {/* Empty Space Before Divider */}
                    {otherTitle('Empty Space Before Divider:')}
                    <RangeControl value={divideMT} onChange={cng => setAttributes({ divideMT: cng })} min={0} max={100} step={1} />

                    {/* Empty Space After Divider */}
                    {otherTitle('Empty Space After Divider:')}
                    <RangeControl value={divideMB} onChange={cng => setAttributes({ divideMB: cng })} min={0} max={100} step={1} />

                    {/* Divider Position */}
                    {otherTitle('Divider Position:')}
                    <SelectControl value={dividePosition} onChange={cng => setAttributes({ dividePosition: cng })} options={aligns} />
                </PanelBody>


                <PanelBody title="Go To Top Settings">
                    {/* Enable/Disable Go To Top */}
                    <ToggleControl label={toggleToTop ? "Disable 'Go To Top' link" : "Enable 'Go To Top' link"} checked={toggleToTop} onChange={cng => setAttributes({ toggleToTop: cng })} />

                    {toggleToTop && <span>
                        {/* Go To Top Font Size */}
                        {otherTitle('Go To Top Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={toTopFontSize} onChange={cng => setAttributes({ toTopFontSize: cng })} />

                        {/* Go To Top Color */}
                        {otherTitle('Go To Top Color:')}
                        <ColorPalette value={toTopColor} onChange={cng => setAttributes({ toTopColor: cng })} colors={colors} />

                        {/* Go To Top Position */}
                        {otherTitle('Go To Top Position:')}
                        <SelectControl value={toTopPosition} onChange={cng => setAttributes({ toTopPosition: cng })} options={aligns} />
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

    example: {
        attributes: {
            'preview': true,
        },
    },
});