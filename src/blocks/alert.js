const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette } = wp.blockEditor;
const { PanelBody, FontSizePicker, Button, ButtonGroup, ToggleControl, RangeControl, Tooltip } = wp.components;

// Variables
import options from '../Const/options';
const { fontSizes, colors, hTags } = options;

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icons
import icons from '../Const/icons';

registerBlockType('b-blocks/alert', {
    // Build In attributes
    title: 'Alert',
    description: 'Alert',
    icon: icons.alert,
    category: 'bBlocks',
    keywords: ['Alert', 'Alert Text', 'Alert Close'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        BGColor: { type: 'string', default: '#8344c5' },
        dismissShow: { type: 'boolean', default: true },
        dismissColor: { type: 'string', default: '#fff' },

        headShow: { type: 'boolean', default: false },
        head: { type: 'string', source: 'html', selector: '.b_blocks_alert_head' },
        headTag: { type: 'string', default: 'h3' },
        headFontSize: { type: 'number' },
        headColor: { type: 'string', default: '#fff' },
        headMB: { type: 'number', default: 15 },

        text: { type: 'string', source: 'html', selector: '.b_blocks_alert_text' },
        textFontSize: { type: 'number' },
        textColor: { type: 'string', default: '#fff' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { BGColor, dismissShow, dismissColor, headShow, head, headTag, headFontSize, headColor, headMB, text, textFontSize, textColor }, setAttributes } = props;

        // Styles
        const alertStyle = { backgroundColor: BGColor }
        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` }
        const textStyle = { fontSize: `${textFontSize}px`, color: textColor, margin: 0 }

        return ([
            <InspectorControls>
                {/* Alert Settings */}
                <PanelBody title="Alert Settings" initialOpen={true}>
                    {/* Background Color */}
                    {firstTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

                    {/* Show/Hide Dismiss Button */}
                    {otherTitle('Show/Hide Dismiss Button:')}
                    <ToggleControl label={dismissShow ? 'Hide Dismiss Button' : 'Show Dismiss Button'} checked={dismissShow} onChange={cng => setAttributes({ dismissShow: cng })} />

                    {dismissShow && <span>
                        {/* Dismiss Button Color */}
                        {otherTitle('Dismiss Button Color:')}
                        <ColorPalette value={dismissColor} onChange={cng => setAttributes({ dismissColor: cng })} colors={colors} />
                    </span>}
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody title="Heading Settings" initialOpen={false}>
                    {/* Show/Hide Heading */}
                    <ToggleControl label={headShow ? 'Hide Heading' : 'Show Heading'} checked={headShow} onChange={cng => setAttributes({ headShow: cng })} />

                    {headShow && <span>
                        {/* Heading Tag */}
                        {firstTitle('Heading Tag:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(hTags).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} isMedium isPrimary={headTag === obj.value} aria-pressed={headTag === obj.value} onClick={() => setAttributes({ headTag: obj.value })}>{obj.icon}</Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={headFontSize} onChange={cng => setAttributes({ headFontSize: cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

                        {/* Margin Bottom */}
                        {otherTitle('Margin Bottom:')}
                        <RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={50} step={1} />
                    </span>}
                </PanelBody>


                {/* Text Settings */}
                <PanelBody title="Text Settings" initialOpen={false}>
                    {/* Font Size */}
                    {firstTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={textFontSize} onChange={cng => setAttributes({ textFontSize: cng })} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={textColor} onChange={cng => setAttributes({ textColor: cng })} colors={colors} />
                </PanelBody>
            </InspectorControls>,


            <div className="alert alert-dismissible fade show" role="alert" style={alertStyle}>
                <span>{headShow && <RichText className="b_blocks_alert_head" key="editable" tagName={headTag} placeholder="Write Your Alert Heading" value={head} onChange={cng => { setAttributes({ head: cng }) }} style={headStyle} />}</span>

                <RichText className="b_blocks_alert_text" key="editable" tagName="p" placeholder="Write Your Alert Text" value={text} onChange={cng => { setAttributes({ text: cng }) }} style={textStyle} />

                {dismissShow && <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true" style={{ color: dismissColor }}>&times;</span>
                </button>}
            </div>
        ])
    },

    save: props => {
        const { BGColor, dismissShow, dismissColor, headShow, head, headTag, headFontSize, headColor, headMB, text, textFontSize, textColor } = props.attributes;

        // Styles
        const alertStyle = { backgroundColor: BGColor, textAlign: 'inherit' }
        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` }
        const textStyle = { fontSize: `${textFontSize}px`, color: textColor, margin: 0 }

        return (
            <div className="alert alert-dismissible fade show" role="alert" style={alertStyle}>
                {headShow && <RichText.Content className="b_blocks_alert_head" tagName={headTag} value={head} style={headStyle} />}

                <RichText.Content className="b_blocks_alert_text" tagName="p" value={text} style={textStyle} />

                {dismissShow && <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true" style={{ color: dismissColor }}>&times;</span>
                </button>}
            </div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});