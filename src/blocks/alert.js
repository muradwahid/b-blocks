import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, FontSizePicker, ToggleControl, RangeControl } from '@wordpress/components';

// Variables
import options from '../Const/options';
const { aligns, fontSizes, colors, hTags } = options;

// Components
import BtnGroup from '../GutenComp/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icons
import icons from '../Const/icons';

registerBlockType('b-blocks/alert', {
    // Build In attributes
    title: __('Alert', 'b-blocks'),
    description: __('Display dismissible alert', 'b-blocks'),
    icon: icons.alert,
    category: 'bBlocks',
    keywords: [__('Alert', 'b-blocks'), __('Alert Text', 'b-blocks'), __('Alert Close', 'b-blocks')],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        BGColor: { type: 'string', default: '#8344c5' },
        contentAlign: { type: 'string', default: 'left' },
        dismissShow: { type: 'boolean', default: true },
        dismissColor: { type: 'string', default: '#fff' },

        headShow: { type: 'boolean', default: false },
        head: { type: 'string', source: 'html', selector: '.b_blocks_alert_head' },
        headTag: { type: 'string', default: 'h2' },
        headFontSize: { type: 'number', default: 25 },
        headColor: { type: 'string', default: '#fff' },
        headMB: { type: 'number', default: 15 },

        text: { type: 'string', source: 'html', selector: '.b_blocks_alert_text' },
        textFontSize: { type: 'number', default: 15 },
        textColor: { type: 'string', default: '#fff' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { BGColor, contentAlign, dismissShow, dismissColor, headShow, head, headTag, headFontSize, headColor, headMB, text, textFontSize, textColor }, setAttributes } = props;

        // Styles
        const alertStyle = { backgroundColor: BGColor, textAlign: contentAlign }
        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` }
        const textStyle = { fontSize: `${textFontSize}px`, color: textColor, margin: 0 }

        return <>
            <InspectorControls>
                {/* Alert Settings */}
                <PanelBody title={__('Alert Settings', 'b-blocks')} initialOpen={true}>
                    {/* Background Color */}
                    {firstTitle('Background Color:')}
                    <BtnGroup options={aligns} myValue={contentAlign} setState={cng => setAttributes({ contentAlign: cng })} icon={true} />

                    {otherTitle('Background Color:')}
                    <ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

                    {/* Show/Hide Dismiss Button */}
                    {otherTitle('Show/Hide Dismiss Button:')}
                    <ToggleControl label={dismissShow ? 'Hide Dismiss Button' : 'Show Dismiss Button'} checked={dismissShow} onChange={cng => setAttributes({ dismissShow: cng })} />

                    {dismissShow && <>
                        {/* Dismiss Button Color */}
                        {otherTitle('Dismiss Button Color:')}
                        <ColorPalette value={dismissColor} onChange={cng => setAttributes({ dismissColor: cng })} colors={colors} />
                    </>}
                </PanelBody>


                {/* Heading Settings */}
                <PanelBody title={__('Heading Settings', 'b-blocks')} initialOpen={false}>
                    {/* Show/Hide Heading */}
                    <ToggleControl label={headShow ? 'Hide Heading' : 'Show Heading'} checked={headShow} onChange={cng => setAttributes({ headShow: cng })} />

                    {headShow && <>
                        {/* Heading Tag */}
                        {firstTitle('Heading Tag:')}
                        <BtnGroup options={hTags} myValue={headTag} setState={(cng, def) => setAttributes({ headTag: cng, headFontSize: def })} />

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={25} value={headFontSize} onChange={cng => setAttributes({ headFontSize: 'undefined' === typeof cng ? 25 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={headColor} onChange={cng => setAttributes({ headColor: cng })} colors={colors} />

                        {/* Margin Bottom */}
                        {otherTitle('Margin Bottom:')}
                        <RangeControl value={headMB} onChange={cng => setAttributes({ headMB: cng })} min={0} max={100} step={1} />
                    </>}
                </PanelBody>


                {/* Text Settings */}
                <PanelBody title={__('Text Settings', 'b-blocks')} initialOpen={false}>
                    {/* Font Size */}
                    {firstTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={textFontSize} onChange={cng => setAttributes({ textFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={textColor} onChange={cng => setAttributes({ textColor: cng })} colors={colors} />
                </PanelBody>
            </InspectorControls>


            <div className="b_blocks_alert">
                <div className="alert alert-dismissible fade show" role="alert" style={alertStyle}>
                    {headShow && <span><RichText className="b_blocks_alert_head" key="editable" tagName={headTag} placeholder={__('Write Your Alert Heading', 'b-blocks')} value={head} onChange={cng => { setAttributes({ head: cng }) }} inlineToolbar style={headStyle} /></span>}

                    <RichText className="b_blocks_alert_text" key="editable" tagName="p" placeholder={__('Write Your Alert Text', 'b-blocks')} value={text} onChange={cng => { setAttributes({ text: cng }) }} inlineToolbar style={textStyle} />

                    {dismissShow && <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true" style={{ color: dismissColor }}>&times;</span>
                    </button>}
                </div>
            </div>
        </>
    },

    save: props => {
        const { BGColor, contentAlign, dismissShow, dismissColor, headShow, head, headTag, headFontSize, headColor, headMB, text, textFontSize, textColor } = props.attributes;

        // Styles
        const alertStyle = { backgroundColor: BGColor, textAlign: contentAlign }
        const headStyle = { fontSize: `${headFontSize}px`, color: headColor, margin: `0 0 ${headMB}px 0` }
        const textStyle = { fontSize: `${textFontSize}px`, color: textColor, margin: 0 }

        return (
            <div className="b_blocks_alert">
                <div className="alert alert-dismissible fade show" role="alert" style={alertStyle}>
                    {headShow && <RichText.Content className="b_blocks_alert_head" tagName={headTag} value={head} style={headStyle} />}

                    <RichText.Content className="b_blocks_alert_text" tagName="p" value={text} style={textStyle} />

                    {dismissShow && <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true" style={{ color: dismissColor }}>&times;</span>
                    </button>}
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