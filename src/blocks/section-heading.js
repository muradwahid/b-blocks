const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, BlockControls, AlignmentToolbar, ColorPalette } = wp.blockEditor;
const { PanelBody, SelectControl, RangeControl, FontSizePicker, ToggleControl, Button, ButtonGroup, Tooltip } = wp.components;


// Variables
import options from '../Const/options';
const { hTags, fontSizes, aligns, borderStyles, colors } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/section-heading', {
    // Build In attributes
    title: 'Section Heading',
    description: 'Awesome Section Heading',
    icon: icons.h,
    category: 'bBlocks',
    keywords: ['Section', 'Section Head', 'Heading'],

    // Custom Attributes
    attributes: {
        alignment: { type: 'string', default: 'center' },

        head: { type: 'string', source: 'html', selector: '.b_blocks_section_head' },
        headTag: { type: 'string', default: 'h2' },
        headFontSize: { type: 'number' },
        headColor: { type: 'string', default: '#4527a4' },
        headMB: { type: 'number', default: 10 },

        sepWidth: { type: 'number', default: 150 },
        sepThick: { type: 'number', default: 3 },
        sepStyle: { type: 'string', default: 'solid' },
        sepColor: { type: 'string', default: '#8344c5' },
        sepMB: { type: 'number', default: 5 },

        toggleDesc: { type: 'boolean', default: true },
        desc: { type: 'string', source: 'html', selector: '.b_blocks_section_description' },
        descFontSize: { type: 'number', default: 16 },
        descColor: { type: 'string', default: '#777' },
        descMB: { type: 'number', default: 15 },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { alignment, head, headTag, headFontSize, headColor, headMB, sepWidth, sepThick, sepStyle, sepColor, sepMB, toggleDesc, desc, descFontSize, descColor, descMB }, setAttributes } = props;

        const containerStyle = { textAlign: alignment }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` };

        const separatorStyle = { display: 'inline-block', width: `${sepWidth}px`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` };

        const descStyle = { fontSize: `${descFontSize}px`, color: descColor, margin: `${sepMB}px 0 ${descMB}px 0` };

        return ([
            <InspectorControls>
                {/* Content Settings */}
                <PanelBody title="Content Settings" initialOpen={true}>
                    {/* Content Alignment */}
                    {firstTitle('Content Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={alignment === obj.value} aria-pressed={alignment === obj.value} onClick={() => setAttributes({ alignment: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody title="Heading Settings" initialOpen={false}>
                    {/* Heading Tag */}
                    {firstTitle('Heading Tag:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(hTags).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={headTag === obj.value} aria-pressed={headTag === obj.value} onClick={() => setAttributes({ headTag: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Heading Font Size */}
                    {otherTitle('Heading Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={headFontSize} onChange={cng => setAttributes({ headFontSize: cng })} />

                    {/* Heading Color */}
                    {otherTitle('Heading Color:')}
                    <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

                    {/* Empty Space After Heading */}
                    {otherTitle('Empty Space After Heading:')}
                    <RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={50} step={1} />
                </PanelBody>


                {/* Separator Settings */}
                <PanelBody title="Separator Settings" initialOpen={false}>
                    {/* Separator Width */}
                    {firstTitle('Separator Width:')}
                    <RangeControl value={sepWidth} onChange={cng => setAttributes({ sepWidth: cng })} min={0} max={1920} step={1} />

                    {/* Separator Thickness */}
                    {firstTitle('Separator Thickness:')}
                    <RangeControl value={sepThick} onChange={cng => setAttributes({ sepThick: cng })} min={0} max={20} step={.1} />

                    {/* Separator Style */}
                    {otherTitle('Separator Style:')}
                    <SelectControl value={sepStyle} onChange={cng => setAttributes({ sepStyle: cng })} options={borderStyles} />

                    {/* Separator Color */}
                    {otherTitle('Separator Color:')}
                    <ColorPalette value={sepColor} onChange={cng => setAttributes({ sepColor: cng })} colors={colors} />

                    {/* Empty Space After Separator */}
                    {otherTitle('Empty Space After Separator:')}
                    <RangeControl value={sepMB} onChange={cng => setAttributes({ sepMB: cng })} min={0} max={75} step={1} />
                </PanelBody>


                {/* Description Settings */}
                <PanelBody title="Description Settings" initialOpen={false}>
                    {/* Enable/Disable Description */}
                    <ToggleControl label={toggleDesc ? 'Disable Description' : 'Enable Description'} checked={toggleDesc} onChange={cng => setAttributes({ toggleDesc: cng })} />

                    {toggleDesc && <span>
                        {/* Description Font Size */}
                        {firstTitle('Description Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={descFontSize} onChange={cng => setAttributes({ descFontSize: cng })} />

                        {/* Description Color */}
                        {otherTitle('Description Color:')}
                        <ColorPalette value={descColor} onChange={cng => setAttributes({ descColor: cng })} colors={colors} />

                        {/* Empty Space After Description */}
                        {otherTitle('Empty Space After Description:')}
                        <RangeControl value={descMB} onChange={cng => setAttributes({ descMB: cng })} min={0} max={100} step={1} />
                    </span>}
                </PanelBody>
            </InspectorControls>,


            <div style={containerStyle}>
                <BlockControls>
                    <AlignmentToolbar value={alignment} onChange={cng => setAttributes({ alignment: cng })} />
                </BlockControls>

                <RichText className="b_blocks_section_head" key="editable" tagName={headTag} placeholder="Write Section Heading" value={head} onChange={cng => { setAttributes({ head: cng }) }} style={headStyle} />

                <div style={separatorStyle}></div>

                {toggleDesc && <span><RichText className="b_blocks_section_description" key="editable" tagName="p" placeholder="Write Section Description" value={desc} onChange={cng => { setAttributes({ desc: cng }) }} style={descStyle} /></span>}
            </div >
        ]);
    },

    save: props => {
        const { alignment, head, headTag, headFontSize, headColor, headMB, sepWidth, sepThick, sepStyle, sepColor, sepMB, toggleDesc, desc, descFontSize, descColor, descMB } = props.attributes;

        const containerStyle = { textAlign: alignment }

        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` };

        const separatorStyle = { display: 'inline-block', width: `${sepWidth}px`, borderBottom: `${sepThick}px ${sepStyle} ${sepColor}` };

        const descStyle = { fontSize: `${descFontSize}px`, color: descColor, margin: `${sepMB}px 0 ${descMB}px 0` };

        return (
            <div style={containerStyle}>
                <RichText.Content className="b_blocks_section_head" tagName={headTag} value={head} style={headStyle} />

                <div style={separatorStyle}></div>

                {toggleDesc && <span><RichText.Content className="b_blocks_section_description" tagName="p" value={desc} style={descStyle} /></span>}
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});