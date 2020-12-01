const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls } = wp.blockEditor;
const { Button, PanelBody, RangeControl, ColorPalette, FontSizePicker, ButtonGroup, Tooltip, SelectControl } = wp.components;

// Variables
import options from '../Const/options';
const { colors, fontSizes, aligns, textTransforms } = options;
const tabLayouts = [
    { label: 'Tabs', value: 'tab' },
    { label: 'Pills', value: 'pills' },
    { label: 'Vertical Pills', value: 'vertical-pills' },
]

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/tabs', {
    // Build In attributes
    title: 'Tabs',
    description: 'Tabs',
    icon: icons.tab,
    category: 'bBlocks',
    keywords: ['Tabs', 'Link Tab', 'List Tab'],

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        info: { type: 'array' },
        layout: { type: 'string', default: 'tab' },

        PTB: { type: 'number', default: 15 },
        PLR: { type: 'number', default: 15 },
        color: { type: 'string', default: '#333' },
        BGColor: { type: 'string', default: '#f4f5f6' },

        titleAlign: { type: 'string', default: 'center' },
        titleFontSize: { type: 'number' },
        titleTextTransform: { type: 'string', default: 'uppercase' },

        contentFontSize: { type: 'number' },
    },

    // edit function
    edit: (props) => {
        const { attributes: { info = [], layout, PTB, PLR, color, BGColor, titleAlign, titleFontSize, titleTextTransform, contentFontSize }, setAttributes, isSelected } = props;

        // Styles
        const containerStyle = { padding: `${PTB}px ${PLR}px`, color: color, backgroundColor: BGColor }

        const titleStyle = { position: 'relative', color: color, textAlign: titleAlign, fontSize: `${titleFontSize}px`, textTransform: titleTextTransform };
        // const titleActiveStyle = { color: titleSecondaryColor, backgroundColor: titlePrimaryColor };
        const tabRemoveStyle = { position: 'absolute', right: 0, top: 0, padding: 0, minWidth: '20px', height: '20px' };
        const contentStyle = { color: color, backgroundColor: BGColor, fontSize: `${contentFontSize}px` };

        // Components
        const infoTitle = value => {
            return (
                value.sort((a, b) => a.index - b.index).map(tab => {
                    const { index, title, description } = tab;

                    const active = index == 0 ? true : false;
                    const id = `${title && title.split(" ").join("")}-${index}`;

                    // const activeDOM = document.querySelector('.nav-link.active');
                    // activeDOM && (activeDOM.style.cssText = `color: ${titleSecondaryColor}; background-color: ${titlePrimaryColor}`);

                    return (
                        <a className={`pr-4 nav-item nav-link ${active ? 'active' : ''}`} id={`${id}-tab`} data-toggle="tab" href={`#${id}`} role="tab" aria-controls={id} aria-selected={active} style={titleStyle}>

                            <Button icon="no-alt" className="b_blocks_remove_tab_btn" onClick={() => {
                                const newInfo = info.filter(item => item.index != index).map(i => {
                                    if (i.index > index) i.index -= 1;
                                    return i;
                                });
                                setAttributes({ info: newInfo });
                            }} style={tabRemoveStyle} />

                            <RichText tagName="span" placeholder="Enter the title" value={title} onChange={cng => {
                                const newObject = Object.assign({}, tab, { title: cng });
                                setAttributes({ info: [...info.filter(item => item.index != index), newObject] });
                            }} />

                        </a>
                    )
                })
            )
        }

        const infoDesc = value => {
            return (
                value.sort((a, b) => a.index - b.index).map(tab => {
                    const { index, title, description } = tab;

                    const active = index == 0 ? true : false;
                    const id = `${title && title.split(" ").join("")}-${index}`;

                    return (
                        <div className={`tab-pane fade ${active ? 'show active' : ''}`} id={id} role="tabpanel" aria-labelledby={`${id}-tab`} style={contentStyle}>

                            <RichText tagName="span" placeholder="Enter Content" value={description} onChange={cng => {
                                const newObj = Object.assign({}, tab, { description: cng });
                                setAttributes({ info: [...info.filter(item => item.index != index), newObj] });
                            }} />

                        </div>
                    )
                })
            )
        }

        return ([
            <InspectorControls>
                <PanelBody title="Tabs Settings" initialOpen={true}>
                    {/* Layout */}
                    {firstTitle('Layout:')}
                    <SelectControl value={layout} onChange={cng => setAttributes({ layout: cng })} options={tabLayouts} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={PTB} onChange={cng => setAttributes({ PTB: cng })} min={0} max={100} step={.1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={PLR} onChange={cng => setAttributes({ PLR: cng })} min={0} max={100} step={.1} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={color} onChange={cng => setAttributes({ color: cng })} colors={colors} />

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />
                </PanelBody>


                {/* Title Settings */}
                <PanelBody title="Title Settings" initialOpen={false}>
                    {/* Text Align */}
                    {firstTitle('Text Align:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={titleAlign === obj.value} aria-pressed={titleAlign === obj.value} onClick={() => setAttributes({ titleAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={titleFontSize} onChange={cng => setAttributes({ titleFontSize: cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(textTransforms).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={titleTextTransform === obj.value} aria-pressed={titleTextTransform === obj.value} onClick={() => setAttributes({ titleTextTransform: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>
                </PanelBody>


                {/* Content Settings */}
                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Font Size */}
                    {firstTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={contentFontSize} onChange={cng => setAttributes({ contentFontSize: cng })} />
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_tabs">
                {
                    layout == 'tab' ? <div className="tabs" style={containerStyle}>
                        <nav>
                            <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                                {infoTitle(info)}
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            {infoDesc(info)}
                        </div>
                    </div> :

                        layout == 'pills' ? <div className="pills" style={containerStyle}>
                            <div className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                {infoTitle(info)}
                            </div>
                            <div className="tab-content">
                                {infoDesc(info)}
                            </div>
                        </div> :

                            layout == 'vertical-pills' ? <div className="row vertical-pills" style={containerStyle}>
                                <div className="col-3 pl-0">
                                    <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                                        {infoTitle(info)}
                                    </div>
                                </div>
                                <div className="col-9 pr-0">
                                    <div className="tab-content">
                                        {infoDesc(info)}
                                    </div>
                                </div>
                            </div> : <h3>Select a layout</h3>
                }

                {isSelected && <Button icon="plus-alt" onClick={title => { setAttributes({ info: [...info, { index: info.length }] }) }} style={{ color: '#4527a4', fontSize: '18px' }}>Add New Tab</Button>}
            </div >
        ]);
    },

    // save function
    save: (props) => {
        const { info, layout, PTB, PLR, color, BGColor, titleAlign, titleFontSize, titleTextTransform, contentFontSize } = props.attributes;

        // Styles
        const containerStyle = { padding: `${PTB}px ${PLR}px`, color: color, backgroundColor: BGColor }

        const titleStyle = { color: color, textAlign: titleAlign, fontSize: `${titleFontSize}px`, textTransform: titleTextTransform };
        const contentStyle = { color: color, backgroundColor: BGColor, fontSize: `${contentFontSize}px` };

        // Components
        const infoTitle = value => {
            return (
                value.sort((a, b) => a.index - b.index).map(tab => {
                    const { index, title, description } = tab;

                    const active = index == 0 ? true : false;
                    const id = `${title && title.split(" ").join("")}-${index}`;

                    return (
                        <a className={`nav-item nav-link ${active ? 'active' : ''}`} id={`${id}-tab`} data-toggle="tab" href={`#${id}`} role="tab" aria-controls={id} aria-selected={active} style={titleStyle}>
                            <RichText.Content tagName="span" value={title} />
                        </a>
                    )
                })
            )
        }

        const infoDesc = value => {
            return (
                value.sort((a, b) => a.index - b.index).map(tab => {
                    const { index, title, description } = tab;

                    const active = index == 0 ? true : false;
                    const id = `${title && title.split(" ").join("")}-${index}`;

                    return (
                        <div className={`tab-pane fade ${active ? 'show active' : ''}`} id={id} role="tabpanel" aria-labelledby={`${id}-tab`} style={contentStyle}>
                            <RichText.Content tagName="span" value={description} />
                        </div>
                    )
                })
            )
        }

        return (
            <div className="b_blocks_tabs" style={{ textAlign: 'inherit' }}>
                {
                    layout == 'tab' ? <div className="tabs" style={containerStyle}>
                        <nav>
                            <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                                {infoTitle(info)}
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            {infoDesc(info)}
                        </div>
                    </div> :

                        layout == 'pills' ? <div className="pills" style={containerStyle}>
                            <div className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                {infoTitle(info)}
                            </div>
                            <div className="tab-content">
                                {infoDesc(info)}
                            </div>
                        </div> :

                            layout == 'vertical-pills' ? <div className="row vertical-pills" style={containerStyle}>
                                <div className="col-3 pl-0">
                                    <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                                        {infoTitle(info)}
                                    </div>
                                </div>
                                <div className="col-9 pr-0">
                                    <div className="tab-content">
                                        {infoDesc(info)}
                                    </div>
                                </div>
                            </div> : <h3>Select a layout</h3>
                }
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
})