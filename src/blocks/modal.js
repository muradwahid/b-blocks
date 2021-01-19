const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const { RichText, InspectorControls, ColorPalette, InnerBlocks, BlockControls, AlignmentToolbar } = wp.blockEditor;
const { PanelBody, FontSizePicker, Button, ToggleControl, RangeControl, TabPanel, TextControl, SelectControl } = wp.components;

// Variables
import options from '../Const/options';
const { fontSizes, hTags, colors, aligns, fontWeights, textTransforms } = options;
const modalSizes = [
    { label: 'Small', value: 'modal-sm', icon: 'SM' },
    { label: 'Default', value: '', icon: 'DF' },
    { label: 'Large', value: 'modal-lg', icon: 'LG' },
    { label: 'Extra Large', value: 'modal-xl', icon: 'XL' },
];

// Components
import BtnGroup from '../GutenComp/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icon
import icons from '../Const/icons';

registerBlockType('b-blocks/modal', {
    // Build In attributes
    title: 'Modal',
    description: 'Modal',
    icon: icons.modal,
    category: 'bBlocks',
    keywords: ['Modal', 'My Modal', 'Popup'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },
        cId: { type: 'string' },

        modalFade: { type: 'boolean', default: true },
        modalStaticBackdrop: { type: 'boolean', default: false },
        modalScrollable: { type: 'boolean', default: true },
        modalVCenter: { type: 'boolean', default: true },
        modalSize: { type: 'string', default: '' },

        modalBtnLabel: { type: 'string' },
        modalBtnAlign: { type: 'string', default: 'left' },
        modalBtnFontSize: { type: 'number', default: 15 },
        modalBtnTransform: { type: 'string', default: 'uppercase' },
        modalBtnFontWeight: { type: 'string', default: '600' },
        modalBtnPTB: { type: 'number', default: 12 },
        modalBtnPLR: { type: 'number', default: 30 },
        modalBtnRadius: { type: 'number', default: 3 },
        modalBtnColor: { type: 'string', default: '#fff' },
        modalBtnBGColor: { type: 'string', default: '#4527a4' },
        modalBtnHovColor: { type: 'string', default: '#fff' },
        modalBtnHovBGColor: { type: 'string', default: '#8344c5' },

        modalHead: { type: 'boolean', default: true },
        modalHeadClose: { type: 'boolean', default: true },
        modalFoot: { type: 'boolean', default: false },
        modalFootClose: { type: 'boolean', default: false },

        headingShow: { type: 'boolean', default: true },
        heading: { type: 'string', source: 'html', selector: '.b_blocks_modal_heading' },
        headingTag: { type: 'string', default: 'h2' },
        headingFontSize: { type: 'number', default: 25 },
        headingColor: { type: 'string', default: '#4527a4' },

        footerTextShow: { type: 'boolean', default: true },
        footerText: { type: 'string', source: 'html', selector: '.b_blocks_modal_footer_text' },
        footerTextFontSize: { type: 'number', default: 15 },
        footerTextColor: { type: 'string', default: '#000' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { cId, modalFade, modalStaticBackdrop, modalScrollable, modalVCenter, modalSize, modalBtnLabel, modalBtnAlign, modalBtnFontSize, modalBtnTransform, modalBtnFontWeight, modalBtnPTB, modalBtnPLR, modalBtnRadius, modalBtnColor, modalBtnBGColor, modalBtnHovColor, modalBtnHovBGColor, modalHead, modalHeadClose, modalFoot, modalFootClose, headingShow, heading, headingTag, headingFontSize, headingColor, footerTextShow, footerText, footerTextFontSize, footerTextColor }, setAttributes, clientId, isSelected } = props;

        // Styles
        const headingStyle = { fontSize: `${headingFontSize}px`, color: headingColor, margin: 0 };
        const footerTextStyle = { fontSize: `${footerTextFontSize}px`, color: footerTextColor, margin: 0 };

        const modalBtnStyle = { fontSize: `${modalBtnFontSize}px`, textTransform: modalBtnTransform, fontWeight: modalBtnFontWeight, padding: `${modalBtnPTB}px ${modalBtnPLR}px`, borderRadius: `${modalBtnRadius}px`, color: modalBtnColor, backgroundColor: modalBtnBGColor };

        // Functions
        useEffect(() => {
            clientId && setAttributes({ cId: clientId });
        }, [clientId]);

        const modalBtnHov = e => {
            e.target.style.color = modalBtnHovColor;
            e.target.style.backgroundColor = modalBtnHovBGColor;
        }
        const modalBtnHovLeave = e => {
            e.target.style.color = modalBtnColor;
            e.target.style.backgroundColor = modalBtnBGColor;
        }

        return ([
            <InspectorControls>
                {/* Modal Settings */}
                <PanelBody title="Modal Settings" initialOpen={true}>
                    {/* Fade Effect */}
                    {firstTitle('Fade Effect:')}
                    <ToggleControl label={modalFade ? 'Disable Fade Effect' : 'Enable Fade Effect'} checked={modalFade} onChange={cng => setAttributes({ modalFade: cng })} />

                    {/* Static Backdrop */}
                    {otherTitle('Static Backdrop:')}
                    <ToggleControl label={modalStaticBackdrop ? 'Disable Static Backdrop' : 'Enable Static Backdrop'} help={modalStaticBackdrop ? 'The modal will not close when clicking outside' : 'The modal will close when clicking outside'} checked={modalStaticBackdrop} onChange={cng => setAttributes({ modalStaticBackdrop: cng })} />

                    {/* Scrollable */}
                    {otherTitle('Scrollable:')}
                    <ToggleControl label={modalScrollable ? 'Disable Modal Dialog Scrollable' : 'Enable Modal Dialog Scrollable'} checked={modalScrollable} onChange={cng => setAttributes({ modalScrollable: cng })} />

                    {/* Vertically Center */}
                    {otherTitle('Vertically Center:')}
                    <ToggleControl label={modalVCenter ? 'Disable Vertically Centered' : 'Enable Vertically Centered'} checked={modalVCenter} onChange={cng => setAttributes({ modalVCenter: cng })} />

                    {/* Modal Size */}
                    {otherTitle('Modal Size:')}
                    <BtnGroup options={modalSizes} myValue={modalSize} setState={cng => setAttributes({ modalSize: cng })} />
                </PanelBody>


                <PanelBody title="Modal Button Settings" initialOpen={false}>
                    {/* Button Align */}
                    {firstTitle('Button Align:')}
                    <BtnGroup options={aligns} myValue={modalBtnAlign} setState={cng => setAttributes({ modalBtnAlign: cng })} icon={true} />

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={modalBtnFontSize} onChange={cng => setAttributes({ modalBtnFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <BtnGroup options={textTransforms} myValue={modalBtnTransform} setState={cng => setAttributes({ modalBtnTransform: cng })} />

                    {/* Font Weight */}
                    {otherTitle('Font Weight:')}
                    <SelectControl value={modalBtnFontWeight} onChange={cng => setAttributes({ modalBtnFontWeight: cng })} options={fontWeights} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={modalBtnPTB} onChange={cng => setAttributes({ modalBtnPTB: cng })} min={0} max={100} step={1} />

                    {/* Left Right Padding */}
                    {otherTitle('Left Right Padding:')}
                    <RangeControl value={modalBtnPLR} onChange={cng => setAttributes({ modalBtnPLR: cng })} min={0} max={150} step={1} />

                    {/* Border Radius */}
                    {otherTitle('Border Radius:')}
                    <RangeControl value={modalBtnRadius} onChange={cng => setAttributes({ modalBtnRadius: cng })} min={0} max={50} step={1} />

                    {otherTitle('Colors:')}
                    <TabPanel className="b_blocks_tab_panel" activeClass="active-tab"
                        tabs={[{ name: 'normal', title: 'Normal', className: 'normal-tab' }, { name: 'hover', title: 'Hover', className: 'hover-tab', }]}>
                        {tab => {
                            return <span>
                                {'normal' == tab.name && <span>
                                    {/* Color */}
                                    {otherTitle('Color:')}
                                    <ColorPalette value={modalBtnColor} onChange={cng => setAttributes({ modalBtnColor: cng })} colors={colors} />

                                    {/* Background Color */}
                                    {otherTitle('Background Color:')}
                                    <ColorPalette value={modalBtnBGColor} onChange={cng => setAttributes({ modalBtnBGColor: cng })} colors={colors} />
                                </span>}

                                {'hover' == tab.name && <span>
                                    {/* Hover Color */}
                                    {otherTitle('Hover Color:')}
                                    <ColorPalette value={modalBtnHovColor} onChange={cng => setAttributes({ modalBtnHovColor: cng })} colors={colors} />

                                    {/* Hover Background Color */}
                                    {otherTitle('Hover Background Color:')}
                                    <ColorPalette value={modalBtnHovBGColor} onChange={cng => setAttributes({ modalBtnHovBGColor: cng })} colors={colors} />
                                </span>}
                            </span>
                        }}
                    </TabPanel>
                </PanelBody>


                <PanelBody title="Header Settings" initialOpen={false}>
                    <ToggleControl label={modalHead ? 'Hide Header' : 'Show Header'} checked={modalHead} onChange={cng => setAttributes({ modalHead: cng })} />

                    {modalHead && <span>
                        {/* Close Button in Header */}
                        {otherTitle('Close Button in Header:')}
                        <ToggleControl label={modalHeadClose ? 'Hide Close Button in Header' : 'Show Close Button in Header'} checked={modalHeadClose} onChange={cng => setAttributes({ modalHeadClose: cng })} />

                        {/* Heading */}
                        {otherTitle('Heading:')}
                        <ToggleControl label={headingShow ? 'Hide Heading' : 'Show Heading'} checked={headingShow} onChange={cng => setAttributes({ headingShow: cng })} />

                        {headingShow && <span>
                            {/* Heading Tag */}
                            {firstTitle('Heading Tag:')}
                            <BtnGroup options={hTags} myValue={headingTag} setState={(cng, def) => setAttributes({ headingTag: cng, headingFontSize: def })} />

                            {/* Heading Font Size */}
                            {otherTitle('Heading Font Size:')}
                            <FontSizePicker fontSizes={fontSizes} fallbackFontSize={25} value={headingFontSize} onChange={cng => setAttributes({ headingFontSize: 'undefined' === typeof cng ? 25 : cng })} />

                            {/* Heading Color */}
                            {otherTitle('Heading Color:')}
                            <ColorPalette value={headingColor} onChange={cng => setAttributes({ headingColor: cng })} colors={colors} />
                        </span>}
                    </span>}
                </PanelBody>

                <PanelBody title="Footer Settings" initialOpen={false}>
                    <ToggleControl label={modalFoot ? 'Hide Footer' : 'Show Footer'} checked={modalFoot} onChange={cng => setAttributes({ modalFoot: cng })} />

                    {modalFoot && <span>
                        {/* Footer Text Font Size */}
                        {otherTitle('Footer Text Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={footerTextFontSize} onChange={cng => setAttributes({ footerTextFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                        {/* Footer Text Color */}
                        {otherTitle('Footer Text Color:')}
                        <ColorPalette value={footerTextColor} onChange={cng => setAttributes({ footerTextColor: cng })} colors={colors} />

                        {/* Close Button in Footer */}
                        {otherTitle('Close Button in Footer:')}
                        <ToggleControl label={modalFootClose ? 'Hide Close Button in Footer' : 'Show Close Button in Footer'} checked={modalFootClose} onChange={cng => setAttributes({ modalFootClose: cng })} />
                    </span>}
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_modal">
                <BlockControls>
                    <AlignmentToolbar value={modalBtnAlign} onChange={cng => setAttributes({ modalBtnAlign: cng })} />
                </BlockControls>

                {/* Button trigger modal */}
                <div style={{ textAlign: modalBtnAlign, position: 'relative' }}>
                    <button className="b_blocks_btn" type="button" data-toggle="modal" data-target={`#bBlocksModal-${clientId}`} style={modalBtnStyle} onMouseEnter={modalBtnHov} onMouseLeave={modalBtnHovLeave}>{modalBtnLabel}</button>

                    {isSelected && <div className="b_blocks_btn_text_control" style={{ left: `${modalBtnAlign === 'left' ? '0%' : modalBtnAlign === 'center' ? '50%' : modalBtnAlign === 'right' && '100%'}`, transform: `${modalBtnAlign === 'left' ? 'translateX(0)' : modalBtnAlign === 'center' ? 'translateX(-50%)' : modalBtnAlign === 'right' && 'translateX(-100%)'}` }}>

                        <TextControl id="bBlocksModalBtnLabel" value={modalBtnLabel} onChange={cng => setAttributes({ modalBtnLabel: cng })} placeholder="Modal Button Label" />
                    </div>}
                </div>


                {/* Modal */}
                <div className={`modal ${modalFade ? 'fade' : ''}`} id={`bBlocksModal-${clientId}`} data-backdrop={`${modalStaticBackdrop ? 'static' : 'dynamic'}`} data-keyboard={`${modalStaticBackdrop ? 'false' : 'true'}`} tabindex="-1" aria-labelledby="bBlocksModalLabel" aria-hidden="true" style={{ zIndex: 99999 }}>

                    <div className={`modal-dialog ${modalScrollable ? 'modal-dialog-scrollable' : ''} ${modalVCenter ? 'modal-dialog-centered' : ''} ${modalSize}`}>
                        <div className="modal-content">
                            {modalHead && <div className="modal-header" style={{ display: 'block', position: 'relative' }}>
                                {headingShow && <RichText className="b_blocks_modal_heading" key="editable" tagName={headingTag} placeholder="Write Modal Heading" value={heading} onChange={cng => { setAttributes({ heading: cng }) }} inlineToolbar style={headingStyle} />}

                                {modalHeadClose && <Button icon="no-alt" className="b_blocks_close_modal_btn close" title="Remove this slide" data-dismiss="modal" aria-label="Close" style={{ position: "absolute", top: '12px', right: '12px' }} />}
                            </div>}

                            <div className="modal-body">
                                <InnerBlocks />
                            </div>

                            {modalFoot && <div className="modal-footer" style={{ display: 'block' }}>
                                {footerTextShow && <RichText className="b_blocks_modal_footer_text" key="editable" tagName="p" placeholder="Write Modal Footer Text" value={footerText} onChange={cng => { setAttributes({ footerText: cng }) }} inlineToolbar style={footerTextStyle} />}

                                {modalFootClose && <div style={{ textAlign: 'right' }}><button type="button" className="b_blocks_btn b_blocks_btn_small" data-dismiss="modal">Close</button></div>}
                            </div>}
                        </div>
                    </div>

                </div>
            </div>
        ])
    },

    save: props => {
        const { cId, modalFade, modalStaticBackdrop, modalScrollable, modalVCenter, modalSize, modalBtnLabel, modalBtnAlign, modalBtnFontSize, modalBtnTransform, modalBtnFontWeight, modalBtnPTB, modalBtnPLR, modalBtnRadius, modalBtnColor, modalBtnBGColor, modalBtnHovColor, modalBtnHovBGColor, modalHead, modalHeadClose, modalFoot, modalFootClose, headingShow, heading, headingTag, headingFontSize, headingColor, footerTextShow, footerText, footerTextFontSize, footerTextColor } = props.attributes;

        // Styles
        const headingStyle = { fontSize: `${headingFontSize}px`, color: headingColor, margin: 0 };
        const footerTextStyle = { fontSize: `${footerTextFontSize}px`, color: footerTextColor, margin: 0 };

        const modalBtnStyle = { fontSize: `${modalBtnFontSize}px`, textTransform: modalBtnTransform, fontWeight: modalBtnFontWeight, padding: `${modalBtnPTB}px ${modalBtnPLR}px`, borderRadius: `${modalBtnRadius}px`, color: modalBtnColor, backgroundColor: modalBtnBGColor };

        // Functions
        const modalBtnHov = e => {
            e.target.style.color = modalBtnHovColor;
            e.target.style.backgroundColor = modalBtnHovBGColor;
        }
        const modalBtnHovLeave = e => {
            e.target.style.color = modalBtnColor;
            e.target.style.backgroundColor = modalBtnBGColor;
        }

        return (
            <div className="b_blocks_modal" style={{ textAlign: 'inherit' }}>
                {/* Button trigger modal */}
                <div style={{ textAlign: modalBtnAlign }}>
                    <button className="b_blocks_btn" type="button" data-toggle="modal" data-target={`#bBlocksModal-${cId}`} style={modalBtnStyle} onMouseEnter={modalBtnHov} onMouseLeave={modalBtnHovLeave}>{modalBtnLabel}</button>
                </div>


                {/* Modal */}
                <div className={`modal ${modalFade ? 'fade' : ''}`} id={`bBlocksModal-${cId}`} data-backdrop={`${modalStaticBackdrop ? 'static' : 'dynamic'}`} data-keyboard={`${modalStaticBackdrop ? 'false' : 'true'}`} tabindex="-1" aria-labelledby="bBlocksModalLabel" aria-hidden="true" style={{ zIndex: 99999 }}>

                    <div className={`modal-dialog ${modalScrollable ? 'modal-dialog-scrollable' : ''} ${modalVCenter ? 'modal-dialog-centered' : ''} ${modalSize}`}>
                        <div className="modal-content">
                            {modalHead && <div className="modal-header" style={{ display: 'block', position: 'relative' }}>
                                {headingShow && <RichText.Content className="b_blocks_modal_heading" tagName={headingTag} value={heading} style={headingStyle} />}

                                {modalHeadClose && <Button icon="no-alt" className="b_blocks_close_modal_btn close" data-dismiss="modal" aria-label="Close" style={{ position: "absolute", top: '12px', right: '12px' }} />}
                            </div>}

                            <div className="modal-body">
                                <InnerBlocks.Content />
                            </div>

                            {modalFoot && <div className="modal-footer" style={{ display: 'block' }}>
                                {footerTextShow && <RichText.Content className="b_blocks_modal_footer_text" tagName="p" value={footerText} style={footerTextStyle} />}

                                {modalFootClose && <div style={{ textAlign: 'right' }}><button type="button" className="b_blocks_btn b_blocks_btn_small" data-dismiss="modal">Close</button></div>}
                            </div>}
                        </div>
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