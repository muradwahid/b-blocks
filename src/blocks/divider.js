const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, ToggleControl, Button, ButtonGroup, Tooltip } = wp.components;

// Variables
import options from '../Const/options';
const { fontSizes, aligns, borderStyles, colors, sizeTypes } = options;

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icons
import icons from '../Const/icons';

registerBlockType('b-blocks/divider', {
    // Build In attributes
    title: 'Divider',
    description: 'Divider of your Section',
    icon: icons.minus,
    category: 'bBlocks',
    keywords: ['Divide', 'Divider', 'Divider Line'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'full' },

        divideAlign: { type: 'string', default: 'center' },
        divideWidth: { type: 'number', default: 450 },
        divideWidthType: { type: 'string', default: 'px' },
        divideThick: { type: 'number', default: 3 },
        divideStyle: { type: 'string', default: 'solid' },
        divideColor: { type: 'string', default: '#8344c5' },
        divideMT: { type: 'number', default: 10 },
        divideMB: { type: 'number', default: 15 },

        toggleToTop: { type: 'boolean', default: false },
        toTopLabel: { type: 'string', default: 'Go to top', source: 'html', selector: '.b_blocks_to_top_link' },
        toTopAlign: { type: 'string', default: 'right' },
        toTopFontSize: { type: 'number' },
        toTopColor: { type: 'string', default: '#4527a4' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { divideAlign, divideWidth, divideWidthType, divideThick, divideStyle, divideColor, divideMT, divideMB, toggleToTop, toTopAlign, toTopLabel, toTopFontSize, toTopColor }, setAttributes } = props;

        // Styles
        const containerStyle = { padding: `${divideMT}px 0 ${divideMB}px 0` };
        const dividerStyle = { display: 'inline-block', width: `${divideWidth}${divideWidthType}`, borderBottom: `${divideThick}px ${divideStyle} ${divideColor}` };
        const toTopStyle = { fontSize: `${toTopFontSize}px`, color: toTopColor, textDecoration: 'none' };

        return ([
            <InspectorControls>
                {/* Divider Settings */}
                <PanelBody title="Divider Settings" initialOpen={true}>
                    {/* Alignment */}
                    {firstTitle('Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={divideAlign === obj.value} aria-pressed={divideAlign === obj.value} onClick={() => setAttributes({ divideAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Width */}
                    {otherTitle('Width:')}
                    <ButtonGroup className="b_blocks_button_groups b_blocks_size_type">
                        {Object.values(sizeTypes).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isSmall isPrimary={divideWidthType === obj.value} aria-pressed={divideWidthType === obj.value} onClick={() => setAttributes({ divideWidthType: obj.value, divideWidth: obj.def })}>{obj.value}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>
                    <RangeControl value={divideWidth} onChange={cng => setAttributes({ divideWidth: cng })} min={0} max={("%" == divideWidthType) ? 100 : 960} step={1} />

                    {/* Thickness */}
                    {otherTitle('Thickness:')}
                    <RangeControl value={divideThick} onChange={cng => setAttributes({ divideThick: cng })} min={0} max={20} step={.1} />

                    {/* Style */}
                    {otherTitle('Style:')}
                    <SelectControl value={divideStyle} onChange={cng => setAttributes({ divideStyle: cng })} options={borderStyles} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={divideColor} onChange={cng => setAttributes({ divideColor: cng })} colors={colors} />

                    {/* Margin Top */}
                    {otherTitle('Margin Top:')}
                    <RangeControl value={divideMT} onChange={cng => setAttributes({ divideMT: cng })} min={0} max={100} step={1} />

                    {/* Margin Bottom */}
                    {otherTitle('Margin Bottom:')}
                    <RangeControl value={divideMB} onChange={cng => setAttributes({ divideMB: cng })} min={0} max={100} step={1} />
                </PanelBody>


                <PanelBody title="Go To Top Settings" initialOpen={false}>
                    {/* Enable/Disable Go To Top */}
                    <ToggleControl label={toggleToTop ? "Disable 'Go To Top' link" : "Enable 'Go To Top' link"} checked={toggleToTop} onChange={cng => setAttributes({ toggleToTop: cng })} />

                    {toggleToTop && <span>
                        {/* Text Align */}
                        {firstTitle('Text Align:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(aligns).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={toTopAlign === obj.value} aria-pressed={toTopAlign === obj.value} onClick={() => setAttributes({ toTopAlign: obj.value })}></Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={toTopFontSize} onChange={cng => setAttributes({ toTopFontSize: cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={toTopColor} onChange={cng => setAttributes({ toTopColor: cng })} colors={colors} />
                    </span>}
                </PanelBody>
            </InspectorControls>,


            <div style={containerStyle}>
                {toggleToTop && <div style={{ textAlign: toTopAlign }}>
                    <RichText className="b_blocks_to_top_link" key="editable" tagName="a" href="#" placeholder="Enter Go to top label" value={toTopLabel} onChange={cng => { setAttributes({ toTopLabel: cng }) }} style={toTopStyle} />
                </div>}

                <div style={{ textAlign: divideAlign }}>
                    <div style={dividerStyle}></div>
                </div>
            </div>
        ]);
    },

    save: props => {
        const { divideAlign, divideWidth, divideWidthType, divideThick, divideStyle, divideColor, divideMT, divideMB, toggleToTop, toTopAlign, toTopLabel, toTopFontSize, toTopColor } = props.attributes;

        // Styles
        const containerStyle = { padding: `${divideMT}px 0 ${divideMB}px 0`, textAlign: 'inherit' };
        const dividerStyle = { display: 'inline-block', width: `${divideWidth}${divideWidthType}`, borderBottom: `${divideThick}px ${divideStyle} ${divideColor}` };
        const toTopStyle = { fontSize: `${toTopFontSize}px`, color: toTopColor, textDecoration: 'none' };

        return (
            <div style={containerStyle}>
                {toggleToTop && <div style={{ textAlign: toTopAlign }}>
                    <RichText.Content className="b_blocks_to_top_link" tagName="a" href="#" value={toTopLabel} style={toTopStyle} />
                </div>}

                <div style={{ textAlign: divideAlign }}>
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