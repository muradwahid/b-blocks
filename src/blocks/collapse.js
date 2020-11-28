const { registerBlockType } = wp.blocks;
const { InspectorControls, ColorPalette, InnerBlocks, RichText } = wp.blockEditor;
const { PanelBody, FontSizePicker, Button, ButtonGroup, RangeControl, Tooltip, TabPanel, SelectControl } = wp.components;

// Variables
import options from '../Const/options';
const { fontSizes, colors, aligns, fontWeights, textTransforms } = options;

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icons
import icons from '../Const/icons';

registerBlockType('b-blocks/collapse', {
    // Build In attributes
    title: 'Collapse',
    description: 'Collapse',
    icon: icons.collapse,
    category: 'bBlocks',
    keywords: ['Collapse', 'Downfall', 'Closing'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        cId: { type: 'string' },

        collBtnLabel: { type: 'string', source: 'html', selector: '.b_blocks_collapse_btn_label' },
        collBtnAlign: { type: 'string', default: 'center' },
        collBtnFontSize: { type: 'number', default: 16 },
        collBtnTransform: { type: 'string', default: 'uppercase' },
        collBtnFontWeight: { type: 'string', default: '600' },
        collBtnPTB: { type: 'number', default: 12 },
        collBtnPLR: { type: 'number', default: 30 },
        collBtnRadius: { type: 'number', default: 3 },
        collBtnColor: { type: 'string', default: '#fff' },
        collBtnBGColor: { type: 'string', default: '#4527a4' },
        collBtnHovColor: { type: 'string', default: '#fff' },
        collBtnHovBGColor: { type: 'string', default: '#8344c5' },

        contentPTB: { type: 'number', default: 10 },
        contentPLR: { type: 'number', default: 15 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { cId, collBtnLabel, collBtnAlign, collBtnFontSize, collBtnTransform, collBtnFontWeight, collBtnPTB, collBtnPLR, collBtnRadius, collBtnColor, collBtnBGColor, collBtnHovColor, collBtnHovBGColor, contentPTB, contentPLR }, setAttributes, clientId } = props;

        // Styles
        const collBtnStyle = { display: 'inline-block', fontSize: `${collBtnFontSize}px`, textTransform: collBtnTransform, fontWeight: collBtnFontWeight, padding: `${collBtnPTB}px 0`, borderRadius: `${collBtnRadius}px`, color: collBtnColor, backgroundColor: collBtnBGColor, border: 'none', outline: 0, transition: 'all .3s ease' };

        const contentStyle = { border: '1px solid #4527a4', borderRadius: '5px', marginTop: '12px', padding: `${contentPTB}px ${contentPLR}px` };

        // Functions
        clientId && setAttributes({ cId: clientId });

        const collBtnHov = e => {
            e.target.style.color = collBtnHovColor;
            e.target.style.backgroundColor = collBtnHovBGColor;
        }
        const collBtnHovLeave = e => {
            e.target.style.color = collBtnColor;
            e.target.style.backgroundColor = collBtnBGColor;
        }

        return ([
            <InspectorControls>
                <PanelBody title="Collapse Button Settings" initialOpen={true}>
                    {/* Alignment */}
                    {firstTitle('Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={collBtnAlign === obj.value} aria-pressed={collBtnAlign === obj.value} onClick={() => setAttributes({ collBtnAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={collBtnFontSize} onChange={cng => setAttributes({ collBtnFontSize: cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(textTransforms).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={collBtnTransform === obj.value} aria-pressed={collBtnTransform === obj.value} onClick={() => setAttributes({ collBtnTransform: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Font Weight */}
                    {otherTitle('Font Weight:')}
                    <SelectControl value={collBtnFontWeight} onChange={cng => setAttributes({ collBtnFontWeight: cng })} options={fontWeights} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={collBtnPTB} onChange={cng => setAttributes({ collBtnPTB: cng })} min={0} max={50} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={collBtnPLR} onChange={cng => setAttributes({ collBtnPLR: cng })} min={0} max={150} step={1} />

                    {/* Border Radius */}
                    {otherTitle('Border Radius:')}
                    <RangeControl value={collBtnRadius} onChange={cng => setAttributes({ collBtnRadius: cng })} min={0} max={50} step={1} />

                    {/* Colors */}
                    {otherTitle('Colors:')}
                    <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                        tabs={[{ name: 'normal', title: 'Normal', className: 'normal-tab' }, { name: 'hover', title: 'Hover', className: 'hover-tab', }]}>
                        {tab => {
                            return <span>
                                {'normal' == tab.name && <span>
                                    {/* Color */}
                                    {otherTitle('Color:')}
                                    <ColorPalette value={collBtnColor} onChange={cng => setAttributes({ collBtnColor: cng })} colors={colors} />

                                    {/* Background Color */}
                                    {otherTitle('Background Color:')}
                                    <ColorPalette value={collBtnBGColor} onChange={cng => setAttributes({ collBtnBGColor: cng })} colors={colors} />
                                </span>}

                                {'hover' == tab.name && <span>
                                    {/* Hover Color */}
                                    {otherTitle('Hover Color:')}
                                    <ColorPalette value={collBtnHovColor} onChange={cng => setAttributes({ collBtnHovColor: cng })} colors={colors} />

                                    {/* Hover Background Color */}
                                    {otherTitle('Hover Background Color:')}
                                    <ColorPalette value={collBtnHovBGColor} onChange={cng => setAttributes({ collBtnHovBGColor: cng })} colors={colors} />
                                </span>}
                            </span>
                        }}
                    </TabPanel>
                </PanelBody>


                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Top Bottom Padding */}
                    {firstTitle('Top Bottom Padding:')}
                    <RangeControl value={contentPTB} onChange={cng => setAttributes({ contentPTB: cng })} min={0} max={50} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={contentPLR} onChange={cng => setAttributes({ contentPLR: cng })} min={0} max={150} step={1} />
                </PanelBody>
            </InspectorControls >,


            <div className="b_blocks_collapse">
                <div style={{ textAlign: collBtnAlign }}>
                    <button type="button" data-toggle="collapse" data-target={`#bBlocksCollapse-${clientId}`} aria-expanded="false" aria-controls={`bBlocksCollapse-${clientId}`} style={collBtnStyle} onMouseEnter={collBtnHov} onMouseLeave={collBtnHovLeave}>
                        <RichText className="b_blocks_collapse_btn_label" key="editable" tagName="span" placeholder="Enter Collapse Button Text" value={collBtnLabel} onChange={cng => { setAttributes({ collBtnLabel: cng }) }} style={{ padding: `${collBtnPTB}px ${collBtnPLR}px`, borderRadius: `${collBtnRadius}px` }} onMouseEnter={collBtnHov} onMouseLeave={collBtnHovLeave} />
                    </button>
                </div>


                {/* Collapse */}
                <div className="collapse" id={`bBlocksCollapse-${clientId}`}>
                    <div className="collapse_content" style={contentStyle}>
                        <InnerBlocks />
                    </div>
                </div>
            </div>
        ])
    },

    save: props => {
        const { cId, collBtnLabel, collBtnAlign, collBtnFontSize, collBtnTransform, collBtnFontWeight, collBtnPTB, collBtnPLR, collBtnRadius, collBtnColor, collBtnBGColor, collBtnHovColor, collBtnHovBGColor, contentPTB, contentPLR } = props.attributes;

        // Styles
        const collBtnStyle = { display: 'inline-block', fontSize: `${collBtnFontSize}px`, textTransform: collBtnTransform, fontWeight: collBtnFontWeight, padding: `${collBtnPTB}px ${collBtnPLR}px`, borderRadius: `${collBtnRadius}px`, color: collBtnColor, backgroundColor: collBtnBGColor, border: 'none', outline: 0, transition: 'all .3s ease' };

        const contentStyle = { border: '1px solid #4527a4', borderRadius: '5px', marginTop: '12px', padding: `${contentPTB}px ${contentPLR}px` };

        // Functions
        const collBtnHov = e => {
            e.target.style.color = collBtnHovColor;
            e.target.style.backgroundColor = collBtnHovBGColor;
        }
        const collBtnHovLeave = e => {
            e.target.style.color = collBtnColor;
            e.target.style.backgroundColor = collBtnBGColor;
        }

        return (
            <div className="b_blocks_collapse">
                {/* Button Trigger Collapse */}
                <div style={{ textAlign: collBtnAlign }}>
                    <button type="button" className="b_blocks_collapse_btn_label" data-toggle="collapse" data-target={`#bBlocksCollapse-${cId}`} aria-expanded="false" aria-controls={`bBlocksCollapse-${cId}`} style={collBtnStyle} onMouseEnter={collBtnHov} onMouseLeave={collBtnHovLeave}>{collBtnLabel}</button>
                </div>


                {/* Collapse */}
                <div className="collapse" id={`bBlocksCollapse-${cId}`}>
                    <div className="collapse_content" style={contentStyle}>
                        <InnerBlocks.Content />
                    </div>
                </div>
            </div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});