const { registerBlockType } = wp.blocks;
const { useEffect, Fragment } = wp.element;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, FontSizePicker, Button, RangeControl, TabPanel } = wp.components;

// Variables
import options from '../Const/options';
const { fontSizes, colors, aligns, textTransforms } = options;

// Components
import BtnGroup from '../GutenComp/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icons
import icons from '../Const/icons';

registerBlockType('b-blocks/accordion', {
    // Build In attributes
    title: 'Accordion',
    description: 'Accordion',
    icon: icons.accordion,
    category: 'bBlocks',
    keywords: ['Accordion', 'Collapse', 'Closing'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },
        cId: { type: 'string' },

        accordions: { type: 'array' },

        headingAlign: { type: 'string', default: 'left' },
        headingFontSize: { type: 'number', default: 20 },
        headingTransform: { type: 'string', default: 'uppercase' },
        headingPTB: { type: 'number', default: 12 },
        headingPLR: { type: 'number', default: 30 },
        headingColor: { type: 'string', default: '#4527a4' },
        headingBGColor: { type: 'string', default: '#f1f1f1' },
        headingHovColor: { type: 'string', default: '#fff' },
        headingHovBGColor: { type: 'string', default: '#4527a4' },

        contentAlign: { type: 'string', default: 'left' },
        contentPTB: { type: 'number', default: 15 },
        contentPLR: { type: 'number', default: 20 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { cId, accordions = [], headingAlign, headingFontSize, headingTransform, headingPTB, headingPLR, headingColor, headingBGColor, headingHovColor, headingHovBGColor, contentAlign, contentPTB, contentPLR }, setAttributes, clientId, isSelected } = props;

        // Styles
        const titleLinkStyle = { color: headingColor, backgroundColor: headingBGColor, position: 'relative', display: 'block', textDecoration: 'none' };

        const titleStyle = { textAlign: headingAlign, fontSize: `${headingFontSize}px`, textTransform: headingTransform, padding: `${headingPTB}px ${headingPLR}px`, border: '1px solid #4527a4', borderRadius: '3px 3px 0 0', margin: 0, transition: 'all .3s ease' };

        const accRemoveStyle = { position: 'absolute', right: '1px', top: '1px', padding: 0, minWidth: '20px', height: '20px', backgroundColor: '#fff', color: '#4527a4' };

        const contentStyle = { textAlign: contentAlign, border: '1px solid #4527a4', borderTop: 'none', borderRadius: '0 0 5px 5px' };

        // Functions
        useEffect(() => {
            clientId && setAttributes({ cId: clientId });
        }, [clientId]);

        const headingHov = e => {
            e.target.style.color = headingHovColor;
            e.target.style.backgroundColor = headingHovBGColor;
        }
        const headingHovLeave = e => {
            e.target.style.color = headingColor;
            e.target.style.backgroundColor = headingBGColor;
        }

        const accordionItem = value => {
            return (
                value && 0 !== value.length && value.sort((a, b) => a.index - b.index).map(acc => {
                    const { index, title, description } = acc;
                    const active = index == 0 ? true : false;

                    return (
                        <div className="b_blocks_acc_item">
                            <a data-toggle="collapse" href={`#accCollapse-${clientId}-${index}`} aria-expanded="true" aria-controls={`accCollapse-${index}`} style={titleLinkStyle} onMouseEnter={headingHov} onMouseLeave={headingHovLeave}>

                                <Button icon="no-alt" className="b_blocks_remove_acc_btn" onClick={() => {
                                    const newAcc = accordions.filter(item => item.index != index).map(i => {
                                        if (i.index > index) i.index -= 1;
                                        return i;
                                    });
                                    setAttributes({ accordions: newAcc });
                                }} style={accRemoveStyle} />

                                <RichText tagName="h3" placeholder="Enter the Title" value={title} onChange={cng => {
                                    const newObj = Object.assign({}, acc, { title: cng });
                                    setAttributes({ accordions: [...accordions.filter(item => item.index != index), newObj] });
                                }} inlineToolbar style={titleStyle} />
                            </a>

                            <div id={`accCollapse-${clientId}-${index}`} className={`collapse ${active ? 'show' : ''}`} data-parent={`#bBlocksAccordion-${clientId}`} style={contentStyle} >
                                <RichText tagName="p" placeholder="Enter the description" value={description} onChange={cng => {
                                    const newObj = Object.assign({}, acc, { description: cng });
                                    setAttributes({ accordions: [...accordions.filter(item => item.index != index), newObj] });
                                }} inlineToolbar style={{ margin: 0, padding: `${contentPTB}px ${contentPLR}px` }} />
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
                    {firstTitle('Text Align:')}
                    <BtnGroup options={aligns} myValue={headingAlign} setState={cng => setAttributes({ headingAlign: cng })} icon={true} />

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={20} value={headingFontSize} onChange={cng => setAttributes({ headingFontSize: 'undefined' === typeof cng ? 20 : cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <BtnGroup options={textTransforms} myValue={headingTransform} setState={cng => setAttributes({ headingTransform: cng })} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={headingPTB} onChange={cng => setAttributes({ headingPTB: cng })} min={0} max={100} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={headingPLR} onChange={cng => setAttributes({ headingPLR: cng })} min={0} max={150} step={1} />

                    {otherTitle('Colors:')}
                    <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                        tabs={[{ name: 'normal', title: 'Normal', className: 'normal-tab' }, { name: 'hover', title: 'Hover', className: 'hover-tab', }]}>
                        {tab => {
                            return <Fragment>
                                {'normal' == tab.name && <Fragment>
                                    {/* Color */}
                                    {firstTitle('Color:')}
                                    <ColorPalette value={headingColor} onChange={cng => setAttributes({ headingColor: cng })} colors={colors} />

                                    {/* Background Color */}
                                    {otherTitle('Background Color:')}
                                    <ColorPalette value={headingBGColor} onChange={cng => setAttributes({ headingBGColor: cng })} colors={colors} />
                                </Fragment>}

                                {'hover' == tab.name && <Fragment>
                                    {/* Hover Color */}
                                    {firstTitle('Hover Color:')}
                                    <ColorPalette value={headingHovColor} onChange={cng => setAttributes({ headingHovColor: cng })} colors={colors} />

                                    {/* Hover Background Color */}
                                    {otherTitle('Hover Background Color:')}
                                    <ColorPalette value={headingHovBGColor} onChange={cng => setAttributes({ headingHovBGColor: cng })} colors={colors} />
                                </Fragment>}
                            </Fragment>
                        }}
                    </TabPanel>
                </PanelBody>


                {/* Content Settings */}
                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Text Align */}
                    {firstTitle('Text Align:')}
                    <BtnGroup options={aligns} myValue={contentAlign} setState={cng => setAttributes({ contentAlign: cng })} icon={true} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={contentPTB} onChange={cng => setAttributes({ contentPTB: cng })} min={0} max={100} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={contentPLR} onChange={cng => setAttributes({ contentPLR: cng })} min={0} max={150} step={1} />
                </PanelBody>
            </InspectorControls >,


            <div className="b_blocks_accordion">
                <div className="accordion" id={`bBlocksAccordion-${clientId}`}>
                    {accordionItem(accordions)}
                </div>

                {!accordions.length || isSelected ? <div style={{ position: 'absolute', bottom: '-25px' }}><Button icon="plus-alt" onClick={title => { setAttributes({ accordions: [...accordions, { index: accordions.length }] }) }} style={{ color: '#fff', fontSize: '18px', backgroundColor: '#4527a4', padding: '20px', borderRadius: '5px', zIndex: 30 }}>Add New Accordion</Button></div> : null}
            </div>
        ])
    },

    save: props => {
        const { cId, accordions, headingAlign, headingFontSize, headingTransform, headingPTB, headingPLR, headingColor, headingBGColor, headingHovColor, headingHovBGColor, contentAlign, contentPTB, contentPLR } = props.attributes;

        // Styles
        const titleLinkStyle = { color: headingColor, backgroundColor: headingBGColor, display: 'block', textDecoration: 'none' };

        const titleStyle = { textAlign: headingAlign, fontSize: `${headingFontSize}px`, textTransform: headingTransform, padding: `${headingPTB}px ${headingPLR}px`, border: '1px solid #4527a4', borderRadius: '3px 3px 0 0', margin: 0, transition: 'all .3s ease' };

        const contentStyle = { textAlign: contentAlign, border: '1px solid #4527a4', borderTop: 'none', borderRadius: '0 0 5px 5px' };

        // Functions
        const headingHov = e => {
            e.target.style.color = headingHovColor;
            e.target.style.backgroundColor = headingHovBGColor;
        }
        const headingHovLeave = e => {
            e.target.style.color = headingColor;
            e.target.style.backgroundColor = headingBGColor;
        }

        const accordionItem = value => {
            return (
                value && 0 !== value.length && value.sort((a, b) => a.index - b.index).map(acc => {
                    const { index, title, description } = acc;
                    const active = index == 0 ? true : false;

                    return (
                        <div className="b_blocks_acc_item">
                            <a data-toggle="collapse" href={`#accCollapse-${cId}${index}`} aria-expanded="true" aria-controls={`accCollapse-${index}`} style={titleLinkStyle} onMouseEnter={headingHov} onMouseLeave={headingHovLeave}>
                                <RichText.Content tagName="h3" value={title} style={titleStyle} />
                            </a>

                            <div id={`accCollapse-${cId}${index}`} className={`collapse ${active ? 'show' : ''}`} data-parent={`#bBlocksAccordion-${cId}`} style={contentStyle} >
                                <RichText.Content tagName="p" value={description} style={{ margin: 0, padding: `${contentPTB}px ${contentPLR}px` }} />
                            </div>
                        </div>
                    );
                })
            );
        }

        return (
            <div className="b_blocks_accordion" style={{ textAlign: 'inherit' }}>
                <div className="accordion" id={`bBlocksAccordion-${cId}`}>
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