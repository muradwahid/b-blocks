const { registerBlockType } = wp.blocks;
const { RichText, InspectorControls, ColorPalette, InnerBlocks, BlockControls, AlignmentToolbar, MediaUpload } = wp.blockEditor;
const { PanelBody, FontSizePicker, IconButton, Button, ButtonGroup, ToggleControl, RangeControl, Tooltip, RadioControl } = wp.components;
const ALLOWED_BLOCKS = ['core/button'];


// Variables
import options from '../Const/options';
const { aligns, fontSizes, colors, tags, hTags, sizeTypes } = options;


// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;


// Icon
import icons from '../Const/icons';


registerBlockType('b-blocks/card', {
    // Build In attributes
    title: 'Card',
    description: 'Card',
    icon: icons.card,
    category: 'bBlocks',
    keywords: ['Alert', 'Alert Text', 'Alert Close'],

    // Custom Attributes
    attributes: {
        layout: { type: 'string', default: 'vertical' },
        cardAlign: { type: 'string', default: 'center' },
        cardWidth: { type: 'number', default: 450 },
        cardWidthType: { type: 'string', default: 'px' },

        imgShow: { type: 'boolean', default: true },
        img: { type: 'object', default: null },
        imgPos: { type: 'string', default: 'top' },

        headerShow: { type: 'boolean', default: true },
        headerAlign: { type: 'string', default: 'left' },
        headerText: { type: 'string', source: 'html', selector: '.b_blocks_card_header' },
        headerTag: { type: 'string', default: 'h5' },
        headerFontSize: { type: 'number' },
        headerColor: { type: 'string', default: '#fff' },
        headerBGColor: { type: 'string', default: '#4527a4' },

        bodyTextAlign: { type: 'string', default: 'left' },
        bodyBGColor: { type: 'string', default: '#f1f1f1' },
        bodyPTB: { type: 'number', default: 15 },
        bodyPLR: { type: 'number', default: 20 },

        bodyHeadShow: { type: 'boolean', default: true },
        bodyHeadText: { type: 'string', source: 'html', selector: '.b_blocks_card_body_head' },
        bodyHeadTag: { type: 'string', default: 'h5' },
        bodyHeadFontSize: { type: 'number' },
        bodyHeadColor: { type: 'string', default: '#4527a4' },
        bodyHeadMB: { type: 'number', default: 15 },

        bodyDescShow: { type: 'boolean', default: true },
        bodyDescText: { type: 'string', source: 'html', selector: '.b_blocks_card_body_desc' },
        bodyDescFontSize: { type: 'number' },
        bodyDescColor: { type: 'string', default: '#000' },
        bodyDescMB: { type: 'number', default: 15 },

        footerShow: { type: 'boolean', default: true },
        footerAlign: { type: 'string', default: 'left' },
        footerText: { type: 'string', source: 'html', selector: '.b_blocks_card_footer' },
        footerTag: { type: 'string', default: 'div' },
        footerFontSize: { type: 'number' },
        footerColor: { type: 'string', default: '#fff' },
        footerBGColor: { type: 'string', default: '#8344c5' },
    },

    // Build In Functions
    edit: props => {
        const { attributes: { layout, cardAlign, cardWidth, cardWidthType, imgShow, img, imgPos, headerShow, headerAlign, headerText, headerTag, headerFontSize, headerColor, headerBGColor, bodyTextAlign, bodyBGColor, bodyPTB, bodyPLR, bodyHeadShow, bodyHeadText, bodyHeadTag, bodyHeadFontSize, bodyHeadColor, bodyHeadMB, bodyDescShow, bodyDescText, bodyDescFontSize, bodyDescColor, bodyDescMB, footerShow, footerAlign, footerText, footerTag, footerFontSize, footerColor, footerBGColor }, setAttributes, isSelected } = props;

        // Styles
        const cardStyle = { display: 'inline-block', maxWidth: '100%', marginTop: 0, width: `${cardWidth}${cardWidthType}`, padding: 0 };

        const headerStyle = { margin: 0, textAlign: headerAlign, fontSize: `${headerFontSize}px`, color: headerColor, backgroundColor: headerBGColor };

        const bodyStyle = { textAlign: bodyTextAlign, backgroundColor: bodyBGColor, padding: `${bodyPTB}px ${bodyPLR}px` };
        const bodyHeadStyle = { margin: 0, fontSize: `${bodyHeadFontSize}px`, color: bodyHeadColor, marginBottom: `${bodyHeadMB}px` };
        const bodyDescStyle = { margin: 0, fontSize: `${bodyDescFontSize}px`, color: bodyDescColor, marginBottom: `${bodyDescMB}px` };

        const footerStyle = { margin: 0, textAlign: footerAlign, fontSize: `${footerFontSize}px`, color: footerColor, backgroundColor: footerBGColor };

        const mediaUpStyle = { position: 'absolute', textAlign: 'center', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: '5px' }

        // Content
        const cardImg = () => {
            return <div style={{ position: 'relative', minHeight: `${isSelected ? '40px' : 0}` }}>
                {imgShow && isSelected && <div style={mediaUpStyle}>
                    <MediaUpload type="image" value={img} onSelect={cng => setAttributes({ img: cng })} render={({ open }) =>
                        img ? <IconButton icon="controls-repeat" onClick={open} style={{ color: '#4527a4' }}>Replace Card Image</IconButton> : <IconButton icon="upload" onClick={open} style={{ color: '#4527a4' }}>Upload Card Image</IconButton>} />
                </div>}

                {imgShow && <img src={img && img.url} className="card-img" alt={img && img.title} />}
            </div >;
        }

        const cardHeader = () => {
            return <div>
                {headerShow && <RichText className="card-header b_blocks_card_header" key="editable" tagName={headerTag} placeholder="Enter Header Text" value={headerText} onChange={cng => { setAttributes({ headerText: cng }) }} style={headerStyle} />}
            </div>;
        }

        const cardBody = () => {
            return <div className="card-body" style={bodyStyle}>
                <div>
                    {bodyHeadShow && <RichText className="card-title b_blocks_card_body_head" key="editable" tagName={bodyHeadTag} placeholder="Enter Body Heading" value={bodyHeadText} onChange={cng => { setAttributes({ bodyHeadText: cng }) }} style={bodyHeadStyle} />}
                </div>

                <div>
                    {bodyDescShow && <RichText className="card-text b_blocks_card_body_desc" key="editable" tagName="p" placeholder="Enter Body Description" value={bodyDescText} onChange={cng => { setAttributes({ bodyDescText: cng }) }} style={bodyDescStyle} />}
                </div>

                <div>
                    <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
                </div>
            </div>
        }

        const cardFooter = () => {
            return <div>
                {footerShow && <RichText className="card-footer b_blocks_card_footer" key="editable" tagName={footerTag} placeholder="Enter Footer Text" value={footerText} onChange={cng => { setAttributes({ footerText: cng }) }} style={footerStyle} />}
            </div>;
        }

        return ([
            <InspectorControls>
                {/* Card Settings */}
                < PanelBody title="Card Settings" initialOpen={true} >
                    {/* Layout */}
                    {firstTitle('Image Position:')}
                    <RadioControl selected={layout} onChange={cng => setAttributes({ layout: cng })} options={[
                        { label: 'Vertical', value: 'vertical' },
                        { label: 'Horizontal', value: 'horizontal' },
                    ]}
                    />

                    {/* Card Align */}
                    {otherTitle('Card Alignment:')}
                    <ButtonGroup className="b_blocks_button_groups" >
                        {
                            Object.values(aligns).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={cardAlign === obj.value} aria-pressed={cardAlign === obj.value} onClick={() => setAttributes({ cardAlign: obj.value })}></Button>
                                </Tooltip>
                            ))
                        }
                    </ButtonGroup>

                    {/* Card Width */}
                    {otherTitle('Card Width:')}
                    < ButtonGroup className="b_blocks_button_groups b_blocks_size_type" >
                        {
                            Object.values(sizeTypes).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} isSmall isPrimary={cardWidthType === obj.value} aria-pressed={cardWidthType === obj.value} onClick={() => setAttributes({ cardWidthType: obj.value, cardWidth: obj.def })}>{obj.value}</Button>
                                </Tooltip>
                            ))
                        }
                    </ButtonGroup >
                    <RangeControl value={cardWidth} onChange={cng => setAttributes({ cardWidth: cng })} min={0} max={("%" == cardWidthType) ? 100 : 1140} step={1} />
                </PanelBody >


                {/* Image Settings */}
                < PanelBody title="Image Settings" initialOpen={false} >
                    {/* Show/Hide Image */}
                    {firstTitle('Show/Hide Image:')}
                    < ToggleControl label={imgShow ? 'Hide Image' : 'Show Image'} checked={imgShow} onChange={cng => setAttributes({ imgShow: cng })} />

                    {imgShow && <span>
                        {/* Image Position */}
                        {otherTitle('Image Position:')}
                        <RadioControl selected={imgPos} onChange={cng => setAttributes({ imgPos: cng })} options={[
                            { label: 'Top', value: 'top' },
                            { label: 'Bottom', value: 'bottom' },
                        ]}
                        />
                    </span>}
                </PanelBody >


                {/* Header Settings */}
                < PanelBody title="Header Settings" initialOpen={false} >
                    {/* Show/Hide Header */}
                    {firstTitle('Show/Hide Header:')}
                    < ToggleControl label={headerShow ? 'Hide Header' : 'Show Header'} checked={headerShow} onChange={cng => setAttributes({ headerShow: cng })} />

                    {headerShow && <span>
                        {/* Header Alignment */}
                        {firstTitle('Header Alignment:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(aligns).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={headerAlign === obj.value} aria-pressed={headerAlign === obj.value} onClick={() => setAttributes({ headerAlign: obj.value })}></Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Header Tag */}
                        {otherTitle('Header Tag:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(hTags).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} isMedium isPrimary={headerTag === obj.value} aria-pressed={headerTag === obj.value} onClick={() => setAttributes({ headerTag: obj.value })}>{obj.icon}</Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Header Font Size */}
                        {otherTitle('Header Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={headerFontSize} onChange={cng => setAttributes({ headerFontSize: cng })} />

                        {/* Header Color */}
                        {otherTitle('Header Color:')}
                        <ColorPalette value={headerColor} onChange={cng => setAttributes({ headerColor: cng })} colors={colors} />

                        {/* Header Background Color */}
                        {otherTitle('Header Background Color:')}
                        <ColorPalette value={headerBGColor} onChange={cng => setAttributes({ headerBGColor: cng })} colors={colors} />
                    </span>}
                </PanelBody >


                {/* Body Settings */}
                < PanelBody title="Body Settings" initialOpen={false} >
                    {/* Content Align */}
                    {firstTitle('Content Alignment:')}
                    < ButtonGroup className="b_blocks_button_groups" >
                        {
                            Object.values(aligns).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={bodyTextAlign === obj.value} aria-pressed={bodyTextAlign === obj.value} onClick={() => setAttributes({ bodyTextAlign: obj.value })}></Button>
                                </Tooltip>
                            ))
                        }
                    </ButtonGroup >

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    < ColorPalette value={bodyBGColor} onChange={cng => setAttributes({ bodyBGColor: cng })} colors={colors} />

                    {/* Padding Top Bottom */}
                    {otherTitle('Padding Top Bottom:')}
                    < RangeControl value={bodyPTB} onChange={cng => setAttributes({ bodyPTB: cng })} min={0} max={50} step={1} />

                    {/* Padding Left Right */}
                    {otherTitle('Padding Left Right:')}
                    < RangeControl value={bodyPLR} onChange={cng => setAttributes({ bodyPLR: cng })} min={0} max={50} step={1} />
                </PanelBody >


                {/* Body Heading Settings */}
                < PanelBody title="Body Heading Settings" initialOpen={false} >
                    {/* Show/Hide Body Heading */}
                    {firstTitle('Show/Hide Body Heading:')}
                    < ToggleControl label={bodyHeadShow ? 'Hide Body Heading' : 'Show Body Heading'} checked={bodyHeadShow} onChange={cng => setAttributes({ bodyHeadShow: cng })} />

                    {bodyHeadShow && <span>
                        {/* Body Heading Tag */}
                        {otherTitle('Body Heading Tag:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(hTags).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} isMedium isPrimary={bodyHeadTag === obj.value} aria-pressed={bodyHeadTag === obj.value} onClick={() => setAttributes({ bodyHeadTag: obj.value })}>{obj.icon}</Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Body Heading Font Size */}
                        {otherTitle('Body Heading Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={bodyHeadFontSize} onChange={cng => setAttributes({ bodyHeadFontSize: cng })} />

                        {/* Body Heading Color */}
                        {otherTitle('Body Heading Color:')}
                        <ColorPalette value={bodyHeadColor} onChange={cng => setAttributes({ bodyHeadColor: cng })} colors={colors} />

                        {/* Body Heading Margin Bottom */}
                        {otherTitle('Body Heading Margin Bottom:')}
                        <RangeControl value={bodyHeadMB} onChange={cng => setAttributes({ bodyHeadMB: cng })} min={0} max={50} step={1} />
                    </span>}
                </PanelBody >


                {/* Body Description Settings */}
                < PanelBody title="Body Description Settings" initialOpen={false} >
                    {/* Show/Hide Body Description */}
                    {firstTitle('Show/Hide Body Description:')}
                    < ToggleControl label={bodyDescShow ? 'Hide Body Description' : 'Show Body Description'} checked={bodyDescShow} onChange={cng => setAttributes({ bodyDescShow: cng })} />

                    {bodyDescShow && <span>
                        {/* Body Description Font Size */}
                        {otherTitle('Body Description Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={bodyDescFontSize} onChange={cng => setAttributes({ bodyDescFontSize: cng })} />

                        {/* Body Description Color */}
                        {otherTitle('Body Description Color:')}
                        <ColorPalette value={bodyDescColor} onChange={cng => setAttributes({ bodyDescColor: cng })} colors={colors} />

                        {/* Body Description Margin Bottom */}
                        {otherTitle('Body Description Margin Bottom:')}
                        <RangeControl value={bodyDescMB} onChange={cng => setAttributes({ bodyDescMB: cng })} min={0} max={50} step={1} />
                    </span>}
                </PanelBody >


                {/* Footer Settings */}
                < PanelBody title="Footer Settings" initialOpen={false} >
                    {/* Show/Hide Footer */}
                    {firstTitle('Show/Hide Footer:')}
                    < ToggleControl label={footerShow ? 'Hide Footer' : 'Show Footer'} checked={footerShow} onChange={cng => setAttributes({ footerShow: cng })} />

                    {footerShow && <span>
                        {/* Footer Alignment */}
                        {firstTitle('Footer Alignment:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(aligns).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} icon={obj.icon} isMedium isPrimary={footerAlign === obj.value} aria-pressed={footerAlign === obj.value} onClick={() => setAttributes({ footerAlign: obj.value })}></Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Footer Tag */}
                        {firstTitle('Footer Tag:')}
                        <ButtonGroup className="b_blocks_button_groups">
                            {Object.values(tags).map(obj => (
                                <Tooltip text={obj.label} position="top">
                                    <Button key={obj.value} isMedium isPrimary={footerTag === obj.value} aria-pressed={footerTag === obj.value} onClick={() => setAttributes({ footerTag: obj.value })} style={{ marginBottom: '5px' }}>{obj.icon}</Button>
                                </Tooltip>
                            ))}
                        </ButtonGroup>

                        {/* Footer Font Size */}
                        {otherTitle('Footer Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} value={footerFontSize} onChange={cng => setAttributes({ footerFontSize: cng })} />

                        {/* Footer Color */}
                        {otherTitle('Footer Color:')}
                        <ColorPalette value={footerColor} onChange={cng => setAttributes({ footerColor: cng })} colors={colors} />

                        {/* Footer Background Color */}
                        {otherTitle('Footer Background Color:')}
                        <ColorPalette value={footerBGColor} onChange={cng => setAttributes({ footerBGColor: cng })} colors={colors} />
                    </span>}
                </PanelBody >
            </InspectorControls >,


            <div className="b_blocks_card" style={{ textAlign: cardAlign }}>
                <div className="card" style={cardStyle}>
                    <BlockControls>
                        <AlignmentToolbar value={cardAlign} onChange={cng => setAttributes({ cardAlign: cng })} />
                    </BlockControls>

                    {'vertical' == layout && <div>
                        {'top' == imgPos && cardImg()}

                        {cardHeader()}

                        {cardBody()}

                        {cardFooter()}

                        {'bottom' == imgPos && cardImg()}
                    </div>}

                    {'horizontal' == layout && <div class="row no-gutters" style={{ backgroundColor: bodyBGColor }}>
                        <div class="col-md-4">
                            {cardImg()}
                        </div>
                        <div class="col-md-8">
                            {cardHeader()}

                            {cardBody()}

                            {cardFooter()}
                        </div>
                    </div>}
                </div>
            </div>
        ])
    },

    save: props => {
        const { layout, cardAlign, cardWidth, cardWidthType, imgShow, img, imgPos, headerShow, headerAlign, headerText, headerTag, headerFontSize, headerColor, headerBGColor, bodyTextAlign, bodyBGColor, bodyPTB, bodyPLR, bodyHeadShow, bodyHeadText, bodyHeadTag, bodyHeadFontSize, bodyHeadColor, bodyHeadMB, bodyDescShow, bodyDescText, bodyDescFontSize, bodyDescColor, bodyDescMB, footerShow, footerAlign, footerText, footerTag, footerFontSize, footerColor, footerBGColor } = props.attributes;

        // Styles
        const cardStyle = { display: 'inline-block', maxWidth: '100%', marginTop: 0, width: `${cardWidth}${cardWidthType}`, padding: 0 };

        const headerStyle = { margin: 0, textAlign: headerAlign, fontSize: `${headerFontSize}px`, color: headerColor, backgroundColor: headerBGColor };

        const bodyStyle = { textAlign: bodyTextAlign, backgroundColor: bodyBGColor, padding: `${bodyPTB}px ${bodyPLR}px` };
        const bodyHeadStyle = { margin: 0, fontSize: `${bodyHeadFontSize}px`, color: bodyHeadColor, marginBottom: `${bodyHeadMB}px` };
        const bodyDescStyle = { margin: 0, fontSize: `${bodyDescFontSize}px`, color: bodyDescColor, marginBottom: `${bodyDescMB}px` };

        const footerStyle = { margin: 0, textAlign: footerAlign, fontSize: `${footerFontSize}px`, color: footerColor, backgroundColor: footerBGColor }

        // Content
        const cardImg = () => {
            return <div>
                {imgShow && <img src={img && img.url} className="card-img" alt={img && img.title} />}
            </div>;
        }

        const cardHeader = () => {
            return <div>
                {headerShow && <RichText.Content className="card-header b_blocks_card_header" tagName={headerTag} value={headerText} style={headerStyle} />}
            </div>;
        }

        const cardBody = () => {
            return <div className="card-body" style={bodyStyle}>
                <div>
                    {bodyHeadShow && <RichText.Content className="card-title b_blocks_card_body_head" tagName={bodyHeadTag} value={bodyHeadText} style={bodyHeadStyle} />}
                </div>

                <div>
                    {bodyDescShow && <RichText.Content className="card-text b_blocks_card_body_desc" tagName="p" value={bodyDescText} style={bodyDescStyle} />}
                </div>

                <div>
                    <InnerBlocks.Content />
                </div>
            </div>
        }

        const cardFooter = () => {
            return <div>
                {footerShow && <RichText.Content className="card-footer b_blocks_card_footer" tagName={footerTag} value={footerText} style={footerStyle} />}
            </div>;
        }

        return (
            <div className="b_blocks_card" style={{ textAlign: cardAlign }}>
                <div className="card" style={cardStyle}>
                    {'vertical' == layout && <div>
                        {'top' == imgPos && cardImg()}

                        {cardHeader()}

                        {cardBody()}

                        {cardFooter()}

                        {'bottom' == imgPos && cardImg()}
                    </div>}

                    {'horizontal' == layout && <div class="row no-gutters" style={{ backgroundColor: bodyBGColor }}>
                        <div class="col-md-4">
                            {cardImg()}
                        </div>
                        <div class="col-md-8">
                            {cardHeader()}

                            {cardBody()}

                            {cardFooter()}
                        </div>
                    </div>}
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