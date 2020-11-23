const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, FontSizePicker, Button, ButtonGroup, RangeControl, Tooltip, TabPanel } = wp.components;


// Variables
import options from '../Const/options';
const { fontSizes, colors, aligns, textTransforms } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/accordion', {
    // Build In attributes
    title: 'Accordion',
    description: 'Accordion',
    icon: icons.accordion,
    category: 'bBlocks',
    keywords: ['Accordion', 'Collapse', 'Closing'],

    // Custom Attributes
    attributes: {
        accordions: { type: 'array' },

        headingAlign: { type: 'string', default: 'left' },
        headingFontSize: { type: 'number' },
        headingTransform: { type: 'string', default: 'uppercase' },
        headingPTB: { type: 'number', default: 12 },
        headingPLR: { type: 'number', default: 30 },
        headingColor: { type: 'string', default: '#4527a4' },
        headingBGColor: { type: 'string', default: '#f1f1f1' },
        headingHovColor: { type: 'string', default: '#fff' },
        headingBGHovColor: { type: 'string', default: '#4527a4' },

        contentPTB: { type: 'number', default: 15 },
        contentPLR: { type: 'number', default: 20 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { accordions = [], headingAlign, headingFontSize, headingTransform, headingPTB, headingPLR, headingColor, headingBGColor, headingHovColor, headingBGHovColor, contentPTB, contentPLR }, setAttributes, clientId, isSelected } = props;

        // Styles
        const titleLinkStyle = { color: headingColor, backgroundColor: headingBGColor, position: 'relative', display: 'block', textDecoration: 'none' };

        const titleStyle = { textAlign: headingAlign, fontSize: `${headingFontSize}px`, textTransform: headingTransform, padding: `${headingPTB}px ${headingPLR}px`, border: '1px solid #4527a4', borderRadius: '3px 3px 0 0', margin: 0, transition: 'all .3s ease' };

        const accRemoveStyle = { position: 'absolute', right: '1px', top: '1px', padding: 0, minWidth: '20px', height: '20px', backgroundColor: '#fff', color: '#4527a4' };

        const contentStyle = { border: '1px solid #4527a4', borderTop: 'none', borderRadius: '0 0 5px 5px' };

        // Functions
        const headingHov = e => {
            e.target.style.color = headingHovColor;
            e.target.style.backgroundColor = headingBGHovColor;
        }
        const headingHovLeave = e => {
            e.target.style.color = headingColor;
            e.target.style.backgroundColor = headingBGColor;
        }

        const accordionItem = value => {
            return (
                value.sort((a, b) => a.index - b.index).map(acc => {
                    const { index, title, description } = acc;
                    const active = index == 0 ? true : false;

                    return (
                        <div className="b_blocks_acc_item">
                            <a data-toggle="collapse" href={`#accCollapse-${index}`} aria-expanded="true" aria-controls={`accCollapse-${index}`} style={titleLinkStyle} onMouseEnter={headingHov} onMouseLeave={headingHovLeave}>

                                <Button icon="no-alt" className="b_blocks_remove_acc_btn" onClick={() => {
                                    const newAcc = accordions.filter(item => item.index != index).map(i => {
                                        if (i.index > index) i.index -= 1;
                                        return i;
                                    });
                                    setAttributes({ accordions: newAcc });
                                }} style={accRemoveStyle} />

                                <RichText tagName="h4" placeholder="Enter the Title" value={title} onChange={cng => {
                                    const newObj = Object.assign({}, acc, { title: cng });
                                    setAttributes({ accordions: [...accordions.filter(item => item.index != index), newObj] });
                                }} style={titleStyle} />
                            </a>

                            <div id={`accCollapse-${index}`} className={`collapse ${active ? 'show' : ''}`} data-parent={`#bBlocksAccordion-${clientId}`} style={contentStyle} >
                                <RichText tagName="p" placeholder="Enter the description" value={description} onChange={cng => {
                                    const newObj = Object.assign({}, acc, { description: cng });
                                    setAttributes({ accordions: [...accordions.filter(item => item.index != index), newObj] });
                                }} style={{ margin: 0, padding: `${contentPTB}px ${contentPLR}px` }} />
                            </div>
                        </div>
                    );
                })
            );
        }

        return ([
            <InspectorControls>
                <PanelBody title="Heading Settings" initialOpen={true}>
                    {/* Text Align */}
                    {otherTitle('Text Align:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={headingAlign === obj.value} aria-pressed={headingAlign === obj.value} onClick={() => setAttributes({ headingAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={headingFontSize} onChange={cng => setAttributes({ headingFontSize: cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(textTransforms).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={headingTransform === obj.value} aria-pressed={headingTransform === obj.value} onClick={() => setAttributes({ headingTransform: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={headingPTB} onChange={cng => setAttributes({ headingPTB: cng })} min={0} max={50} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={headingPLR} onChange={cng => setAttributes({ headingPLR: cng })} min={0} max={150} step={1} />

                    {otherTitle('Colors:')}
                    <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                        tabs={[{ name: 'normal', title: 'Normal', className: 'normal-tab' }, { name: 'hover', title: 'Hover', className: 'hover-tab', }]}>
                        {tab => {
                            return <span>
                                {'normal' == tab.name && <span>
                                    {/* Color */}
                                    {otherTitle('Color:')}
                                    <ColorPalette value={headingColor} onChange={cng => setAttributes({ headingColor: cng })} colors={colors} />

                                    {/* Background Color */}
                                    {otherTitle('Background Color:')}
                                    <ColorPalette value={headingBGColor} onChange={cng => setAttributes({ headingBGColor: cng })} colors={colors} />
                                </span>}

                                {'hover' == tab.name && <span>
                                    {/* Hover Color */}
                                    {otherTitle('Hover Color:')}
                                    <ColorPalette value={headingHovColor} onChange={cng => setAttributes({ headingHovColor: cng })} colors={colors} />

                                    {/* Hover Background Color */}
                                    {otherTitle('Hover Background Color:')}
                                    <ColorPalette value={headingBGHovColor} onChange={cng => setAttributes({ headingBGHovColor: cng })} colors={colors} />
                                </span>}
                            </span>
                        }}
                    </TabPanel>
                </PanelBody>


                {/* Content Settings */}
                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Top Bottom Padding */}
                    {firstTitle('Top Bottom Padding:')}
                    <RangeControl value={contentPTB} onChange={cng => setAttributes({ contentPTB: cng })} min={0} max={50} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={contentPLR} onChange={cng => setAttributes({ contentPLR: cng })} min={0} max={150} step={1} />
                </PanelBody>
            </InspectorControls >,


            <div className="b_blocks_accordion">
                <div className="accordion" id={`bBlocksAccordion-${clientId}`}>
                    {accordionItem(accordions)}
                </div>

                {isSelected && <Button icon="plus-alt" onClick={title => { setAttributes({ accordions: [...accordions, { index: accordions.length }] }) }} style={{ color: '#4527a4', fontSize: '18px' }}>Add New Accordion</Button>}
            </div>
        ])
    },

    save: props => {
        const { attributes: { accordions, headingAlign, headingFontSize, headingTransform, headingPTB, headingPLR, headingColor, headingBGColor, headingHovColor, headingBGHovColor, contentPTB, contentPLR }, clientId } = props;

        // Styles
        const titleLinkStyle = { color: headingColor, backgroundColor: headingBGColor, display: 'block', textDecoration: 'none' };

        const titleStyle = { textAlign: headingAlign, fontSize: `${headingFontSize}px`, textTransform: headingTransform, padding: `${headingPTB}px ${headingPLR}px`, border: '1px solid #4527a4', borderRadius: '3px 3px 0 0', margin: 0, transition: 'all .3s ease' };

        const contentStyle = { border: '1px solid #4527a4', borderTop: 'none', borderRadius: '0 0 5px 5px' };

        // Functions
        const headingHov = e => {
            e.target.style.color = headingHovColor;
            e.target.style.backgroundColor = headingBGHovColor;
        }
        const headingHovLeave = e => {
            e.target.style.color = headingColor;
            e.target.style.backgroundColor = headingBGColor;
        }

        const accordionItem = value => {
            return (
                value.sort((a, b) => a.index - b.index).map(acc => {
                    const { index, title, description } = acc;
                    const active = index == 0 ? true : false;

                    return (
                        <div className="b_blocks_acc_item">
                            <a data-toggle="collapse" href={`#accCollapse-${index}`} aria-expanded="true" aria-controls={`accCollapse-${index}`} style={titleLinkStyle} onMouseEnter={headingHov} onMouseLeave={headingHovLeave}>
                                <RichText.Content tagName="h4" value={title} style={titleStyle} />
                            </a>

                            <div id={`accCollapse-${index}`} className={`collapse ${active ? 'show' : ''}`} data-parent={`#bBlocksAccordion-${clientId}`} style={contentStyle} >
                                <RichText.Content tagName="p" value={description} style={{ margin: 0, padding: `${contentPTB}px ${contentPLR}px` }} />
                            </div>
                        </div>
                    );
                })
            );
        }

        return (
            <div className="b_blocks_accordion">
                <div className="accordion" id={`bBlocksAccordion-${clientId}`}>
                    {accordionItem(accordions)}
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