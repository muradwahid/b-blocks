const { registerBlockType } = wp.blocks;
const { InspectorControls, ColorPalette, RichText } = wp.blockEditor;
const { PanelBody, FontSizePicker, Button, ButtonGroup, RangeControl, Tooltip, TextControl, SelectControl } = wp.components;

// Variables
import options from '../Const/options';
const { fontSizes, colors, aligns, fontWeights, textTransforms } = options;

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icons
import icons from '../Const/icons';

registerBlockType('b-blocks/mailto', {
    // Build In attributes
    title: 'Mail To',
    description: 'E-mail by on click',
    icon: icons.mail,
    category: 'bBlocks',
    keywords: ['Mail', 'mail to', 'E-mail'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        receiverMail: { type: 'string', default: 'support@bplugins.com' },

        mtBtnLabel: { type: 'string', source: 'html', selector: '.b_blocks_mt_btn_label' },
        mtBtnAlign: { type: 'string', default: 'center' },
        mtBtnFontSize: { type: 'number', default: 16 },
        mtBtnTransform: { type: 'string', default: 'uppercase' },
        mtBtnFontWeight: { type: 'string', default: '600' },
        mtBtnPTB: { type: 'number', default: 12 },
        mtBtnPLR: { type: 'number', default: 30 },
        mtBtnRadius: { type: 'number', default: 3 },
        mtBtnColor: { type: 'string', default: '#fff' },
        mtBtnBGColor: { type: 'string', default: '#4527a4' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { receiverMail, mtBtnLabel, mtBtnAlign, mtBtnFontSize, mtBtnTransform, mtBtnFontWeight, mtBtnPTB, mtBtnPLR, mtBtnRadius, mtBtnColor, mtBtnBGColor }, setAttributes, isSelected } = props;

        // Styles
        const mtBtnStyle = { display: 'inline-block', fontSize: `${mtBtnFontSize}px`, textTransform: mtBtnTransform, fontWeight: mtBtnFontWeight, padding: `${mtBtnPTB}px ${mtBtnPLR}px`, borderRadius: `${mtBtnRadius}px`, color: mtBtnColor, backgroundColor: mtBtnBGColor, border: 'none', outline: 0, transition: 'all .3s ease', textDecoration: 'none' };

        return ([
            <InspectorControls>
                <PanelBody title="Mail to Button Settings" initialOpen={true}>
                    {/* Label */}
                    {firstTitle('Label:')}
                    <TextControl value={mtBtnLabel} onChange={cng => setAttributes({ mtBtnLabel: cng })} />

                    {/* Alignment */}
                    {otherTitle('Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={mtBtnAlign === obj.value} aria-pressed={mtBtnAlign === obj.value} onClick={() => setAttributes({ mtBtnAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Font Size */}
                    {otherTitle('Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={mtBtnFontSize} onChange={cng => setAttributes({ mtBtnFontSize: cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(textTransforms).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={mtBtnTransform === obj.value} aria-pressed={mtBtnTransform === obj.value} onClick={() => setAttributes({ mtBtnTransform: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Font Weight */}
                    {otherTitle('Font Weight:')}
                    <SelectControl value={mtBtnFontWeight} onChange={cng => setAttributes({ mtBtnFontWeight: cng })} options={fontWeights} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={mtBtnPTB} onChange={cng => setAttributes({ mtBtnPTB: cng })} min={0} max={50} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={mtBtnPLR} onChange={cng => setAttributes({ mtBtnPLR: cng })} min={0} max={150} step={1} />

                    {/* Border Radius */}
                    {otherTitle('Border Radius:')}
                    <RangeControl value={mtBtnRadius} onChange={cng => setAttributes({ mtBtnRadius: cng })} min={0} max={50} step={1} />

                    {/* Color */}
                    {otherTitle('Color:')}
                    <ColorPalette value={mtBtnColor} onChange={cng => setAttributes({ mtBtnColor: cng })} colors={colors} />

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={mtBtnBGColor} onChange={cng => setAttributes({ mtBtnBGColor: cng })} colors={colors} />
                </PanelBody>
            </InspectorControls >,


            <div className="b_blocks_mailto" style={{ textAlign: mtBtnAlign }}>
                <a className="mailtoui" href={`mailto:${receiverMail}`} style={mtBtnStyle}>
                    <RichText className="b_blocks_mt_btn_label" key="editable" tagName="span" placeholder="Write Mail to Button Label" value={mtBtnLabel} onChange={cng => { setAttributes({ mtBtnLabel: cng }) }} />
                </a>

                {isSelected && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                    <label htmlFor="bBlocksMtReceiverMail" style={{ marginRight: '20px', fontWeight: 'bold' }}>Receiver Email:</label>

                    <TextControl style={{ width: '350px', padding: '8px 15px', borderRadius: '3px', color: '#000' }} id="bBlocksMtReceiverMail" value={receiverMail} onChange={cng => setAttributes({ receiverMail: cng })} />
                </div>}
            </div>
        ])
    },

    save: props => {
        const { receiverMail, mtBtnLabel, mtBtnAlign, mtBtnFontSize, mtBtnTransform, mtBtnFontWeight, mtBtnPTB, mtBtnPLR, mtBtnRadius, mtBtnColor, mtBtnBGColor } = props.attributes;

        // Styles
        const mtBtnStyle = { display: 'inline-block', fontSize: `${mtBtnFontSize}px`, textTransform: mtBtnTransform, fontWeight: mtBtnFontWeight, padding: `${mtBtnPTB}px ${mtBtnPLR}px`, borderRadius: `${mtBtnRadius}px`, color: mtBtnColor, backgroundColor: mtBtnBGColor, border: 'none', outline: 0, transition: 'all .3s ease', textDecoration: 'none' };

        return (
            <div className="b_blocks_mailto" style={{ textAlign: mtBtnAlign }}>
                <a className="mailtoui" href={`mailto:${receiverMail}`} style={mtBtnStyle}>
                    <RichText.Content className="b_blocks_mt_btn_label" tagName="span" value={mtBtnLabel} />
                </a>
            </div>
        )
    },

    example: {
        attributes: {
            'preview': true,
        },
    },
});