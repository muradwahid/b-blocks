const { registerBlockType } = wp.blocks;
const { InspectorControls, ColorPalette, RichText, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { PanelBody, FontSizePicker, RangeControl, TextControl, SelectControl } = wp.components;

// Variables
import options from '../Const/options';
const { fontSizes, colors, aligns, fontWeights, textTransforms } = options;

// Components
import BtnGroup from '../GutenComp/BtnGroup';

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
        align: { type: 'string', default: 'center' },

        receiverMail: { type: 'string' },

        mtBtnLabel: { type: 'string', source: 'html', selector: '.b_blocks_mt_btn_label' },
        mtBtnAlign: { type: 'string', default: 'left' },
        mtBtnFontSize: { type: 'number', default: 15 },
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

                    {/* Button Align */}
                    {otherTitle('Button Align:')}
                    <BtnGroup options={aligns} myValue={mtBtnAlign} setState={cng => setAttributes({ mtBtnAlign: cng })} icon={true} />

                    {/* Font Size */}
                    {otherTitle('Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={mtBtnFontSize} onChange={cng => setAttributes({ mtBtnFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <BtnGroup options={textTransforms} myValue={mtBtnTransform} setState={cng => setAttributes({ mtBtnTransform: cng })} />

                    {/* Font Weight */}
                    {otherTitle('Font Weight:')}
                    <SelectControl value={mtBtnFontWeight} onChange={cng => setAttributes({ mtBtnFontWeight: cng })} options={fontWeights} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={mtBtnPTB} onChange={cng => setAttributes({ mtBtnPTB: cng })} min={0} max={100} step={1} />

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


            <div className="b_blocks_mailto" style={{ textAlign: mtBtnAlign, position: 'relative' }}>
                <BlockControls>
                    <AlignmentToolbar value={mtBtnAlign} onChange={cng => setAttributes({ mtBtnAlign: cng })} />
                </BlockControls>

                <a className="mailtoui" href={`mailto:${receiverMail}`} style={mtBtnStyle} target="_blank">
                    <RichText className="b_blocks_mt_btn_label" key="editable" tagName="span" placeholder="Write Mail to Button Label" value={mtBtnLabel} onChange={cng => { setAttributes({ mtBtnLabel: cng }) }} inlineToolbar />
                </a>

                {isSelected && <div style={{ position: 'absolute', bottom: '-33px', left: `${mtBtnAlign === 'left' ? '0%' : mtBtnAlign === 'center' ? '50%' : mtBtnAlign === 'right' && '100%'}`, transform: `${mtBtnAlign === 'left' ? 'translateX(0)' : mtBtnAlign === 'center' ? 'translateX(-50%)' : mtBtnAlign === 'right' && 'translateX(-100%)'}`, zIndex: 30 }}>
                    <TextControl style={{ width: '350px', padding: '8px 15px', borderRadius: '3px', color: '#000' }} id="bBlocksMtReceiverMail" value={receiverMail} onChange={cng => setAttributes({ receiverMail: cng })} placeholder="Receiver Email" />
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