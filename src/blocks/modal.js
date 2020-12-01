const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette, InnerBlocks } = wp.blockEditor;
const { PanelBody, FontSizePicker, Button, ButtonGroup, ToggleControl, RangeControl, Tooltip, TabPanel, TextControl, SelectControl } = wp.components;


// Variables
import options from '../Const/options';
const { fontSizes, hTags, colors, aligns, fontWeights, textTransforms, modalSizes } = options;


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

        modalBtnLabel: { type: 'string', default: 'My Modal' },
        modalBtnAlign: { type: 'string', default: 'left' },
        modalBtnFontSize: { type: 'number', default: 16 },
        modalBtnTransform: { type: 'string', default: 'capitalize' },
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
        headingTag: { type: 'string', default: 'h3' },
        headingFontSize: { type: 'number' },
        headingColor: { type: 'string', default: '#4527a4' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { cId, modalFade, modalStaticBackdrop, modalScrollable, modalVCenter, modalSize, modalBtnLabel, modalBtnAlign, modalBtnFontSize, modalBtnTransform, modalBtnFontWeight, modalBtnPTB, modalBtnPLR, modalBtnRadius, modalBtnColor, modalBtnBGColor, modalBtnHovColor, modalBtnHovBGColor, modalHead, modalHeadClose, modalFoot, modalFootClose, headingShow, heading, headingTag, headingFontSize, headingColor }, setAttributes, clientId, isSelected } = props;

        // Styles
        const headingStyle = { fontSize: `${headingFontSize}px`, color: headingColor, margin: 0 };

        const modalBtnStyle = { display: 'inline-block', fontSize: `${modalBtnFontSize}px`, textTransform: modalBtnTransform, fontWeight: modalBtnFontWeight, padding: `${modalBtnPTB}px ${modalBtnPLR}px`, borderRadius: `${modalBtnRadius}px`, color: modalBtnColor, backgroundColor: modalBtnBGColor, border: 'none', outline: 0, transition: 'all .3s ease' };

        // Functions
        clientId && setAttributes({ cId: clientId });

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
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(modalSizes).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={modalSize === obj.value} aria-pressed={modalSize === obj.value} onClick={() => setAttributes({ modalSize: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>
                </PanelBody>


                <PanelBody title="Modal Button Settings" initialOpen={false}>
                    {/* Alignment */}
                    {firstTitle('Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(aligns).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} icon={obj.icon} isMedium isPrimary={modalBtnAlign === obj.value} aria-pressed={modalBtnAlign === obj.value} onClick={() => setAttributes({ modalBtnAlign: obj.value })}></Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Font Size */}
                    {otherTitle('Font Size:')}
                    <FontSizePicker fontSizes={fontSizes} value={modalBtnFontSize} onChange={cng => setAttributes({ modalBtnFontSize: cng })} />

                    {/* Text Transform */}
                    {otherTitle('Text Transform:')}
                    <ButtonGroup className="b_blocks_button_groups">
                        {Object.values(textTransforms).map(obj => (
                            <Tooltip text={obj.label} position="top">
                                <Button key={obj.value} isMedium isPrimary={modalBtnTransform === obj.value} aria-pressed={modalBtnTransform === obj.value} onClick={() => setAttributes({ modalBtnTransform: obj.value })}>{obj.icon}</Button>
                            </Tooltip>
                        ))}
                    </ButtonGroup>

                    {/* Font Weight */}
                    {otherTitle('Font Weight:')}
                    <SelectControl value={modalBtnFontWeight} onChange={cng => setAttributes({ modalBtnFontWeight: cng })} options={fontWeights} />

                    {/* Top Bottom Padding */}
                    {otherTitle('Top Bottom Padding:')}
                    <RangeControl value={modalBtnPTB} onChange={cng => setAttributes({ modalBtnPTB: cng })} min={0} max={50} step={1} />

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


                <PanelBody title="Content Settings" initialOpen={false}>
                    {/* Header */}
                    {firstTitle('Header:')}
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
                            <ButtonGroup className="b_blocks_button_groups">
                                {Object.values(hTags).map(obj => (
                                    <Tooltip text={obj.label} position="top">
                                        <Button key={obj.value} isMedium isPrimary={headingTag === obj.value} aria-pressed={headingTag === obj.value} onClick={() => setAttributes({ headingTag: obj.value })}>{obj.icon}</Button>
                                    </Tooltip>
                                ))}
                            </ButtonGroup>

                            {/* Heading Font Size */}
                            {otherTitle('Heading Font Size:')}
                            <FontSizePicker fontSizes={fontSizes} value={headingFontSize} onChange={cng => setAttributes({ headingFontSize: cng })} />

                            {/* Heading Color */}
                            {otherTitle('Heading Color:')}
                            <ColorPalette value={headingColor} onChange={cng => setAttributes({ headingColor: cng })} colors={colors} />
                        </span>}
                    </span>}


                    {/* Footer */}
                    {otherTitle('Footer:')}
                    <ToggleControl label={modalFoot ? 'Hide Close Button in Footer' : 'Show Close Button in Footer'} checked={modalFoot} onChange={cng => setAttributes({ modalFoot: cng })} />

                    {modalFoot && <span>
                        {/* Close Button in Footer */}
                        {otherTitle('Close Button in Footer:')}
                        <ToggleControl label={modalFootClose ? 'Hide Close Button in Footer' : 'Show Close Button in Footer'} checked={modalFootClose} onChange={cng => setAttributes({ modalFootClose: cng })} />
                    </span>}
                </PanelBody>
            </InspectorControls >,


            <div className="b_blocks_modal">
                {/* Button trigger modal */}
                <div style={{ textAlign: modalBtnAlign }}>
                    <button type="button" data-toggle="modal" data-target={`#bBlocksModal-${clientId}`} style={modalBtnStyle} onMouseEnter={modalBtnHov} onMouseLeave={modalBtnHovLeave}>{modalBtnLabel}</button>
                </div>

                {isSelected && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                    <label htmlFor="bBlocksModalBtnLabel" style={{ marginRight: '20px', fontWeight: 'bold' }}>Modal Button Label:</label>

                    <TextControl style={{ width: '350px', padding: '8px 15px', borderRadius: '3px', color: '#000' }} id="bBlocksModalBtnLabel" value={modalBtnLabel} onChange={cng => setAttributes({ modalBtnLabel: cng })} />
                </div>}


                {/* Modal */}
                <div className={`modal ${modalFade ? 'fade' : ''}`} id={`bBlocksModal-${clientId}`} data-backdrop={`${modalStaticBackdrop ? 'static' : 'dynamic'}`} data-keyboard={`${modalStaticBackdrop ? 'false' : 'true'}`} tabindex="-1" aria-labelledby="bBlocksModalLabel" aria-hidden="true">

                    <div className={`modal-dialog ${modalScrollable ? 'modal-dialog-scrollable' : ''} ${modalVCenter ? 'modal-dialog-centered' : ''} ${modalSize}`}>
                        <div className="modal-content">
                            {modalHead && <div className="modal-header">
                                {headingShow && < RichText className="b_blocks_modal_heading" key="editable" tagName={headingTag} placeholder="Write Modal Heading" value={heading} onChange={cng => { setAttributes({ heading: cng }) }} style={headingStyle} />}

                                {modalHeadClose && <Button icon="no-alt" className="b_blocks_close_modal_btn close" title="Remove this slide" data-dismiss="modal" aria-label="Close" />}
                            </div>}

                            <div className="modal-body">
                                <InnerBlocks />
                            </div>

                            {modalFoot && <div className="modal-footer">
                                {modalFootClose && <button type="button" className="b_blocks_btn" data-dismiss="modal">Close</button>}
                            </div>}
                        </div>
                    </div>

                </div>
            </div>
        ])
    },

    save: props => {
        const { cId, modalFade, modalStaticBackdrop, modalScrollable, modalVCenter, modalSize, modalBtnLabel, modalBtnAlign, modalBtnFontSize, modalBtnTransform, modalBtnFontWeight, modalBtnPTB, modalBtnPLR, modalBtnRadius, modalBtnColor, modalBtnBGColor, modalBtnHovColor, modalBtnHovBGColor, modalHead, modalHeadClose, modalFoot, modalFootClose, headingShow, heading, headingTag, headingFontSize, headingColor } = props.attributes;

        // Styles
        const headingStyle = { fontSize: `${headingFontSize}px`, color: headingColor, margin: 0 };

        const modalBtnStyle = { display: 'inline-block', fontSize: `${modalBtnFontSize}px`, textTransform: modalBtnTransform, fontWeight: modalBtnFontWeight, padding: `${modalBtnPTB}px ${modalBtnPLR}px`, borderRadius: `${modalBtnRadius}px`, color: modalBtnColor, backgroundColor: modalBtnBGColor, border: 'none', outline: 0, transition: 'all .3s ease' };

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
                    <button type="button" data-toggle="modal" data-target={`#bBlocksModal-${cId}`} style={modalBtnStyle} onMouseEnter={modalBtnHov} onMouseLeave={modalBtnHovLeave}>{modalBtnLabel}</button>
                </div>


                {/* Modal */}
                <div className={`modal ${modalFade ? 'fade' : ''}`} id={`bBlocksModal-${cId}`} data-backdrop={`${modalStaticBackdrop ? 'static' : 'dynamic'}`} data-keyboard={`${modalStaticBackdrop ? 'false' : 'true'}`} tabindex="-1" aria-labelledby="bBlocksModalLabel" aria-hidden="true">

                    <div className={`modal-dialog ${modalScrollable ? 'modal-dialog-scrollable' : ''} ${modalVCenter ? 'modal-dialog-centered' : ''} ${modalSize}`}>
                        <div className="modal-content">
                            {modalHead && <div className="modal-header">
                                {headingShow && < RichText.Content className="b_blocks_modal_heading" tagName={headingTag} value={heading} style={headingStyle} />}

                                {modalHeadClose && <Button icon="no-alt" className="b_blocks_close_modal_btn close" data-dismiss="modal" aria-label="Close" />}
                            </div>}

                            <div className="modal-body">
                                <InnerBlocks.Content />
                            </div>

                            {modalFoot && <div className="modal-footer">
                                {modalFootClose && <button type="button" className="b_blocks_btn" data-dismiss="modal">Close</button>}
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