import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, InspectorControls, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';
import { Button, PanelBody, RangeControl, ColorPalette, FontSizePicker, SelectControl } from '@wordpress/components';

// Variables
import options from '../Const/options';
const { colors, fontSizes, aligns, textTransforms, sizeTypes } = options;
const tabLayouts = [
    { label: __('Tabs', 'b-blocks'), value: 'tab' },
    { label: __('Pills', 'b-blocks'), value: 'pills' },
    { label: __('Vertical Pills', 'b-blocks'), value: 'vertical-pills' },
]

// Components
import BtnGroup from '../Components/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/tabs', {
    // Build In attributes
    title: __('Tabs', 'b-blocks'),
    description: __('Display beautiful predesigned tabs', 'b-blocks'),
    icon: icons.tab,
    category: 'bBlocks',
    keywords: [__('Tabs', 'b-blocks'), __('Link Tab', 'b-blocks'), __('List Tab', 'b-blocks')],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        tabs: { type: 'array' },
        layout: { type: 'string', default: 'tab' },

        contentAlign: { type: 'string', default: 'left' },
        width: { type: 'number', default: 100 },
        widthType: { type: 'string', default: '%' },

        PTB: { type: 'number', default: 15 },
        PLR: { type: 'number', default: 15 },
        color: { type: 'string', default: '#333' },
        BGColor: { type: 'string', default: '#f4f5f6' },

        titleAlign: { type: 'string', default: 'right' },
        titleFontSize: { type: 'number', default: 16 },
        titleTextTransform: { type: 'string', default: 'uppercase' },

        contentFontSize: { type: 'number', default: 15 },
    },

    // edit function
    edit: (props) => {
        const { attributes: { tabs = [], layout, contentAlign, width, widthType, PTB, PLR, color, BGColor, titleAlign, titleFontSize, titleTextTransform, contentFontSize }, setAttributes, isSelected } = props;

        // Styles
        const containerStyle = { padding: `${PTB}px ${PLR}px`, color, backgroundColor: BGColor }

        const titleStyle = { position: 'relative', color, textAlign: titleAlign, fontSize: `${titleFontSize}px`, textTransform: titleTextTransform, width: `${'vertical-pills' == layout ? '100%' : 'auto'}`, margin: `${'vertical-pills' == layout ? '0 0 5px 0' : 'pills' == layout ? '0 5px 0 0' : '0'}` };

        const tabRemoveStyle = { position: 'absolute', right: 0, top: 0, padding: 0, minWidth: '20px', height: '20px' };

        const contentStyle = { color, backgroundColor: BGColor, fontSize: `${contentFontSize}px`, textAlign: 'initial' };

        // Components
        const tabsTitle = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(tab => {
                    const { index, title } = tab;

                    const active = index == 0 ? true : false;
                    const id = `${title && title.split(" ").join("")}-${index}`;

                    // const activeDOM = document.querySelector('.nav-link.active');
                    // activeDOM && (activeDOM.style.cssText = `color: ${titleSecondaryColor}; background-color: ${titlePrimaryColor}`);

                    return (
                        <a key={tab.index} className={`pr-4 nav-item nav-link ${active ? 'active' : ''}`} id={`${id}-tab`} data-toggle="tab" href={`#${id}`} role="tab" aria-controls={id} aria-selected={active} style={titleStyle}>

                            <Button icon="no-alt" className="b_blocks_remove_tab_btn" onClick={() => {
                                const newTabs = tabs.filter(item => item.index != index).map(i => {
                                    if (i.index > index) i.index -= 1;
                                    return i;
                                });
                                setAttributes({ tabs: newTabs });
                            }} style={tabRemoveStyle} />

                            <RichText tagName="h4" placeholder={__('Enter title', 'b-blocks')} value={title} onChange={cng => {
                                const newObject = Object.assign({}, tab, { title: cng });
                                setAttributes({ tabs: [...tabs.filter(item => item.index != index), newObject] });
                            }} inlineToolbar style={{ margin: 0, color: 'inherit', fontSize: '16px' }} />

                        </a>
                    )
                })
            )
        }

        const tabsDesc = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(tab => {
                    const { index, title, description } = tab;

                    const active = index == 0 ? true : false;
                    const id = `${title && title.split(" ").join("")}-${index}`;

                    return (
                        <div key={tab.index} className={`tab-pane fade ${active ? 'show active' : ''}`} id={id} role="tabpanel" aria-labelledby={`${id}-tab`} style={contentStyle}>

                            <RichText tagName="span" placeholder={__('Enter content', 'b-blocks')} value={description} onChange={cng => {
                                const newObj = Object.assign({}, tab, { description: cng });
                                setAttributes({ tabs: [...tabs.filter(item => item.index != index), newObj] });
                            }} inlineToolbar />

                        </div>
                    )
                })
            )
        }

        return <>
            <InspectorControls>
                <PanelBody className='bBlocksPanelBody' title={__('Tabs Settings', 'b-blocks')} initialOpen={true}>
                    {/* Layout */}
                    {firstTitle('Layout:')}
                    <SelectControl value={layout} onChange={cng => setAttributes({ layout: cng })} options={tabLayouts} />

                    {otherTitle('Width:')}
                    <BtnGroup options={sizeTypes} myValue={widthType} setState={(cng, def) => setAttributes({ widthType: cng, width: def })} classes="bBlocksSizeType" size="small" />

                    <RangeControl value={width} onChange={cng => setAttributes({ width: cng })} min={0} max={("%" == widthType) ? 100 : 1920} step={1} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={PTB} onChange={cng => setAttributes({ PTB: cng })} min={0} max={100} step={.1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={PLR} onChange={cng => setAttributes({ PLR: cng })} min={0} max={150} step={.1} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={color} onChange={cng => setAttributes({ color: cng })} colors={colors} />

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />
                </PanelBody>


                {/* Title Settings */}
                <PanelBody className='bBlocksPanelBody' title={__('Title Settings', 'b-blocks')} initialOpen={false}>
                    {/* Text Align */}
                    {firstTitle('Text Align:')}
                    <BtnGroup options={aligns} myValue={titleAlign} setState={cng => setAttributes({ titleAlign: cng })} icon={true} />

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={16} value={titleFontSize} onChange={cng => setAttributes({ titleFontSize: 'undefined' === typeof cng ? 16 : cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <BtnGroup options={textTransforms} myValue={titleTextTransform} setState={cng => setAttributes({ titleTextTransform: cng })} />
                </PanelBody>


                {/* Content Settings */}
                <PanelBody className='bBlocksPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
                    {/* Font Size */}
                    {firstTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={contentFontSize} onChange={cng => setAttributes({ contentFontSize: 'undefined' === typeof cng ? 15 : cng })} />
                </PanelBody>
            </InspectorControls>


            <div className="b_blocks_tabs" style={{ textAlign: `${contentAlign}` }}>
                <BlockControls>
                    <AlignmentToolbar value={contentAlign} onChange={cng => setAttributes({ contentAlign: cng })} />
                </BlockControls>

                <div style={{ display: 'inline-block', width: `${width}${widthType}`, textAlign: 'initial' }}>
                    {
                        layout == 'tab' ? <div className="tabs" style={containerStyle}>
                            <nav>
                                <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                                    {tabsTitle(tabs)}
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent" style={{ textAlign: `${contentAlign}` }}>
                                {tabsDesc(tabs)}
                            </div>
                        </div> :

                            layout == 'pills' ? <div className="pills" style={containerStyle}>
                                <div className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                    {tabsTitle(tabs)}
                                </div>
                                <div className="tab-content" style={{ textAlign: `${contentAlign}` }}>
                                    {tabsDesc(tabs)}
                                </div>
                            </div> :

                                layout == 'vertical-pills' ? <div className="row vertical-pills" style={containerStyle}>
                                    <div className="col-3 pl-0">
                                        <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                                            {tabsTitle(tabs)}
                                        </div>
                                    </div>
                                    <div className="col-9 pr-0">
                                        <div className="tab-content" style={{ textAlign: `${contentAlign}` }}>
                                            {tabsDesc(tabs)}
                                        </div>
                                    </div>
                                </div> : <h3 style={{ fontSize: '20px' }}>{__('Select a layout', 'b-blocks')}</h3>
                    }

                    {!tabs.length || isSelected ? <div className="b_blocks_add_item"><Button icon="plus-alt" onClick={() => { setAttributes({ tabs: [...tabs, { index: tabs.length }] }) }}>{__('Add New Tab', 'b-blocks')}</Button></div> : null}
                </div>
            </div>
        </>;
    },

    // save function
    save: (props) => {
        const { tabs, layout, contentAlign, width, widthType, PTB, PLR, color, BGColor, titleAlign, titleFontSize, titleTextTransform, contentFontSize } = props.attributes;

        // Styles
        const containerStyle = { padding: `${PTB}px ${PLR}px`, color, backgroundColor: BGColor, width: `${width}${widthType}`, textAlign: 'initial' }

        const titleStyle = { color, textAlign: titleAlign, fontSize: `${titleFontSize}px`, textTransform: titleTextTransform };

        const contentStyle = { color, backgroundColor: BGColor, fontSize: `${contentFontSize}px`, textAlign: 'initial' };

        // Components
        const tabsTitle = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(tab => {
                    const { index, title } = tab;

                    const active = index == 0 ? true : false;
                    const id = `${title && title.split(" ").join("")}-${index}`;

                    return (
                        <a key={tab.index} className={`nav-item nav-link ${active ? 'active' : ''}`} id={`${id}-tab`} data-toggle="tab" href={`#${id}`} role="tab" aria-controls={id} aria-selected={active} style={titleStyle}>
                            <RichText.Content tagName="h4" value={title} style={{ margin: 0, color: 'inherit', fontSize: '16px' }} />
                        </a>
                    )
                })
            )
        }

        const tabsDesc = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(tab => {
                    const { index, title, description } = tab;

                    const active = index == 0 ? true : false;
                    const id = `${title && title.split(" ").join("")}-${index}`;

                    return (
                        <div key={tab.index} className={`tab-pane fade ${active ? 'show active' : ''}`} id={id} role="tabpanel" aria-labelledby={`${id}-tab`} style={contentStyle}>
                            <RichText.Content tagName="span" value={description} />
                        </div>
                    )
                })
            )
        }

        return (
            <div className="b_blocks_tabs" style={{ textAlign: `${contentAlign}` }}>
                {
                    layout == 'tab' ? <div className="tabs" style={containerStyle}>
                        <nav>
                            <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                                {tabsTitle(tabs)}
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            {tabsDesc(tabs)}
                        </div>
                    </div> :

                        layout == 'pills' ? <div className="pills" style={containerStyle}>
                            <div className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                                {tabsTitle(tabs)}
                            </div>
                            <div className="tab-content">
                                {tabsDesc(tabs)}
                            </div>
                        </div> :

                            layout == 'vertical-pills' ? <div className="row vertical-pills" style={containerStyle}>
                                <div className="col-3 pl-0">
                                    <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                                        {tabsTitle(tabs)}
                                    </div>
                                </div>
                                <div className="col-9 pr-0">
                                    <div className="tab-content">
                                        {tabsDesc(tabs)}
                                    </div>
                                </div>
                            </div> : <h3 style={{ fontSize: '20px' }}>{__('Select a layout', 'b-blocks')}</h3>
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