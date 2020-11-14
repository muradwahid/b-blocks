const { registerBlockType } = wp.blocks;
const { InspectorControls, ColorPalette, InnerBlocks } = wp.blockEditor;
const { PanelBody, FontSizePicker, Button, ButtonGroup, RangeControl, Tooltip, TabPanel, TextControl, SelectControl } = wp.components;


// Variables
import options from '../Const/options';
const { fontSizes, colors, aligns, fontWeights, textTransforms } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/collapse', {
    // Build In attributes
    title: 'Collapse',
    description: 'Collapse',
    icon: icons.collapse,
    category: 'bBlocks',
    keywords: ['Collapse', 'Downfall', 'Closing'],

    // Custom Attributes
    attributes: {
        collBtnLabel: { type: 'string', default: 'Collapse' },
        collBtnAlign: { type: 'string', default: 'center' },
        collBtnFontSize: { type: 'number', default: 16 },
        collBtnTransform: { type: 'string', default: 'capitalize' },
        collBtnFontWeight: { type: 'string', default: '600' },
        collBtnPTB: { type: 'number', default: 12 },
        collBtnPLR: { type: 'number', default: 30 },
        collBtnRadius: { type: 'number', default: 3 },
        collBtnTextColor: { type: 'string', default: '#fff' },
        collBtnBGColor: { type: 'string', default: '#4527a4' },
        collBtnTextHovColor: { type: 'string', default: '#fff' },
        collBtnBGHovColor: { type: 'string', default: '#8344c5' },

        contentPTB: { type: 'number', default: 10 },
        contentPLR: { type: 'number', default: 15 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { collBtnLabel, collBtnAlign, collBtnFontSize, collBtnTransform, collBtnFontWeight, collBtnPTB, collBtnPLR, collBtnRadius, collBtnTextColor, collBtnBGColor, collBtnTextHovColor, collBtnBGHovColor, contentPTB, contentPLR }, setAttributes, clientId, isSelected } = props;

        // Styles
        const collBtnStyle = { display: 'inline-block', fontSize: `${collBtnFontSize}px`, textTransform: collBtnTransform, fontWeight: collBtnFontWeight, padding: `${collBtnPTB}px ${collBtnPLR}px`, borderRadius: `${collBtnRadius}px`, color: collBtnTextColor, backgroundColor: collBtnBGColor, border: 'none', outline: 0, transition: 'all .3s ease' };

        const contentStyle = { border: '1px solid #4527a4', borderRadius: '5px', marginTop: '12px', padding: `${contentPTB}px ${contentPLR}px` };

        // Functions
        const collBtnHov = e => {
            e.target.style.color = collBtnTextHovColor;
            e.target.style.backgroundColor = collBtnBGHovColor;
        }
        const collBtnHovLeave = e => {
            e.target.style.color = collBtnTextColor;
            e.target.style.backgroundColor = collBtnBGColor;
        }

        return ([
            <InspectorControls>
                <PanelBody title="Collapse Button Settings" initialOpen={true}>
                    {/* Collapse Button Label */}
                    {firstTitle('Collapse Button Label:')}
                    <TextControl value={collBtnLabel} onChange={cng => setAttributes({ collBtnLabel: cng })} />

                    {/* Collapse Button Alignment */}
                    {otherTitle('Collapse Button Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={collBtnAlign === obj.value} aria-pressed={collBtnAlign === obj.value} onClick={() => setAttributes({ collBtnAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Collapse Button Font Size */}
                    {otherTitle('Collapse Button Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={collBtnFontSize} onChange={cng => setAttributes({ collBtnFontSize: cng })} />

                    {/* Collapse Button Text Transform */}
                    {otherTitle('Collapse Button Text Transform:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(textTransforms).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={collBtnTransform === obj.value} aria-pressed={collBtnTransform === obj.value} onClick={() => setAttributes({ collBtnTransform: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Collapse Button Font Weight */}
                    {otherTitle('Collapse Button Font Weight:')}
                    <SelectControl value={collBtnFontWeight} onChange={cng => setAttributes({ collBtnFontWeight: cng })} options={fontWeights} />

                    {/* Collapse Button Top Bottom Padding */}
                    {otherTitle('Collapse Button Top Bottom Padding:')}
                    <RangeControl value={collBtnPTB} onChange={cng => setAttributes({ collBtnPTB: cng })} min={0} max={50} step={1} />

                    {/* Collapse Button Left Right Padding */}
                    {otherTitle('Collapse Button Left Right Padding:')}
                    <RangeControl value={collBtnPLR} onChange={cng => setAttributes({ collBtnPLR: cng })} min={0} max={150} step={1} />

                    {/* Collapse Button Border Radius */}
                    {otherTitle('Collapse Button Border Radius:')}
                    <RangeControl value={collBtnRadius} onChange={cng => setAttributes({ collBtnRadius: cng })} min={0} max={50} step={1} />

                    {otherTitle('Collapse Button Colors:')}
                    <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                        tabs={[{ name: 'normal', title: 'Normal', className: 'normal-tab' }, { name: 'hover', title: 'Hover', className: 'hover-tab', }]}>
                        {tab => {
                            return <span>
                                {'normal' == tab.name && <span>
                                    {/* Collapse Button Text Color */}
                                    {otherTitle('Collapse Button Text Color:')}
                                    <ColorPalette value={collBtnTextColor} onChange={cng => setAttributes({ collBtnTextColor: cng })} colors={colors} />

                                    {/* Collapse Button Background Color */}
                                    {otherTitle('Collapse Button Background Color:')}
                                    <ColorPalette value={collBtnBGColor} onChange={cng => setAttributes({ collBtnBGColor: cng })} colors={colors} />
                                </span>}

                                {'hover' == tab.name && <span>
                                    {/* Collapse Button Text Hover Color */}
                                    {otherTitle('Collapse Button Text Hover Color:')}
                                    <ColorPalette value={collBtnTextHovColor} onChange={cng => setAttributes({ collBtnTextHovColor: cng })} colors={colors} />

                                    {/* Collapse Button Background Hover Color */}
                                    {otherTitle('Collapse Button Background Hover Color:')}
                                    <ColorPalette value={collBtnBGHovColor} onChange={cng => setAttributes({ collBtnBGHovColor: cng })} colors={colors} />
                                </span>}
                            </span>
                        }}
                    </TabPanel>
                </PanelBody>


                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Content Top Bottom Padding */}
                    {firstTitle('Content Top Bottom Padding:')}
                    <RangeControl value={contentPTB} onChange={cng => setAttributes({ contentPTB: cng })} min={0} max={50} step={1} />

                    {/* Content Left Right Padding */}
                    {otherTitle('Content Left Right Padding:')}
                    <RangeControl value={contentPLR} onChange={cng => setAttributes({ contentPLR: cng })} min={0} max={150} step={1} />
                </PanelBody>
            </InspectorControls >,


            <div className="b_blocks_collapse">
                {/* Button Trigger Collapse */}
                {isSelected && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                    <label htmlFor="bBlocksCollBtnLabel" style={{ marginRight: '20px', fontWeight: 'bold' }}>Collapse Button Label:</label>

                    <TextControl style={{ width: '350px', padding: '8px 15px', borderRadius: '3px', color: '#000' }} id="bBlocksCollBtnLabel" value={collBtnLabel} onChange={cng => setAttributes({ collBtnLabel: cng })} />
                </div>}

                <div style={{ textAlign: collBtnAlign }}>
                    <button type="button" data-toggle="collapse" data-target={`#bBlocksCollapse-${clientId}`} aria-expanded="false" aria-controls={`bBlocksCollapse-${clientId}`} style={collBtnStyle} onMouseEnter={collBtnHov} onMouseLeave={collBtnHovLeave}>{collBtnLabel}</button>
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
        const { attributes: { collBtnLabel, collBtnAlign, collBtnFontSize, collBtnTransform, collBtnFontWeight, collBtnPTB, collBtnPLR, collBtnRadius, collBtnTextColor, collBtnBGColor, collBtnTextHovColor, collBtnBGHovColor, contentPTB, contentPLR }, clientId } = props;

        // Styles
        const collBtnStyle = { display: 'inline-block', fontSize: `${collBtnFontSize}px`, textTransform: collBtnTransform, fontWeight: collBtnFontWeight, padding: `${collBtnPTB}px ${collBtnPLR}px`, borderRadius: `${collBtnRadius}px`, color: collBtnTextColor, backgroundColor: collBtnBGColor, border: 'none', outline: 0, transition: 'all .3s ease' };

        const contentStyle = { border: '1px solid #4527a4', borderRadius: '5px', marginTop: '12px', padding: `${contentPTB}px ${contentPLR}px` };

        // Functions
        const collBtnHov = e => {
            e.target.style.color = collBtnTextHovColor;
            e.target.style.backgroundColor = collBtnBGHovColor;
        }
        const collBtnHovLeave = e => {
            e.target.style.color = collBtnTextColor;
            e.target.style.backgroundColor = collBtnBGColor;
        }

        return (
            <div className="b_blocks_collapse">
                {/* Button Trigger Collapse */}
                <div style={{ textAlign: collBtnAlign }}>
                    <button type="button" data-toggle="collapse" data-target={`#bBlocksCollapse-${clientId}`} aria-expanded="false" aria-controls={`bBlocksCollapse-${clientId}`} style={collBtnStyle} onMouseEnter={collBtnHov} onMouseLeave={collBtnHovLeave}>{collBtnLabel}</button>
                </div>


                {/* Collapse */}
                <div className="collapse" id={`bBlocksCollapse-${clientId}`}>
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