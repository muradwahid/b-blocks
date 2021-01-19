const { registerBlockType } = wp.blocks;
const { Fragment, useEffect } = wp.element;
const { RichText, InspectorControls, ColorPalette, InnerBlocks, BlockControls, AlignmentToolbar, MediaUpload } = wp.blockEditor;
const { PanelBody, FontSizePicker, IconButton, ToggleControl, RangeControl, RadioControl, PanelRow } = wp.components;
const ALLOWED_BLOCKS = ['core/button'];

// Icons
import icons from '../Const/icons';

// Variables
import options from '../Const/options';
const { aligns, fontSizes, colors, tags, hTags, sizeTypes } = options;

const cardLayouts = [
    { label: 'Vertical', value: 'vertical', icon: icons.verticalLine, def: 450 },
    { label: 'Horizontal', value: 'horizontal', icon: icons.horizontalLine, def: 900 }
]

// Components
import BtnGroup from '../GutenComp/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

registerBlockType('b-blocks/card', {
    // Build In attributes
    title: 'Card',
    description: 'Card',
    icon: icons.card,
    category: 'bBlocks',
    keywords: ['Card'],
    supports: {
        align: ['center', 'wide', 'full']
    },

    // Custom Attributes
    attributes: {
        align: { type: 'string', default: 'center' },

        layout: { type: 'string', default: 'vertical' },
        cardAlign: { type: 'string', default: 'left' },
        cardWidth: { type: 'number', default: 450 },
        cardWidthType: { type: 'string', default: 'px' },

        imgShow: { type: 'boolean', default: true },
        img: { type: 'object', default: null },
        imgPos: { type: 'string', default: 'top' },

        headerShow: { type: 'boolean', default: true },
        headerAlign: { type: 'string', default: 'left' },
        headerText: { type: 'string', source: 'html', selector: '.b_blocks_card_header' },
        headerTag: { type: 'string', default: 'h4' },
        headerFontSize: { type: 'number', default: 16 },
        headerColor: { type: 'string', default: '#fff' },
        headerBGColor: { type: 'string', default: '#4527a4' },

        bodyTextAlign: { type: 'string', default: 'left' },
        bodyBGColor: { type: 'string', default: '#f1f1f1' },
        bodyPTB: { type: 'number', default: 15 },
        bodyPLR: { type: 'number', default: 20 },

        bodyHeadShow: { type: 'boolean', default: true },
        bodyHeadText: { type: 'string', source: 'html', selector: '.b_blocks_card_body_head' },
        bodyHeadTag: { type: 'string', default: 'h4' },
        bodyHeadFontSize: { type: 'number', default: 16 },
        bodyHeadColor: { type: 'string', default: '#4527a4' },
        bodyHeadMB: { type: 'number', default: 15 },

        bodyDescShow: { type: 'boolean', default: true },
        bodyDescText: { type: 'string', source: 'html', selector: '.b_blocks_card_body_desc' },
        bodyDescFontSize: { type: 'number', default: 15 },
        bodyDescColor: { type: 'string', default: '#000' },
        bodyDescMB: { type: 'number', default: 15 },

        footerShow: { type: 'boolean', default: true },
        footerAlign: { type: 'string', default: 'left' },
        footerText: { type: 'string', source: 'html', selector: '.b_blocks_card_footer' },
        footerTag: { type: 'string', default: 'div' },
        footerFontSize: { type: 'number', default: 15 },
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

        useEffect(() => {
            const cardImg = document.querySelectorAll('.b_blocks_card .card img');
            cardImg.length && cardImg.forEach(im => {
                img && img.url ? im.style.height = `${(im.clientWidth / 16) * 9}px` : null;
            });
        }, [imgShow, img, imgPos, cardWidth, cardWidthType]);

        // Content
        const cardImg = () => {
            return <div style={{ position: 'relative', minHeight: `${isSelected ? '40px' : 0}`, textAlign: 'center' }}>
                {imgShow && isSelected && <div className="b_blocks_media_upload">
                    <MediaUpload allowedTypes={['image']} value={img} onSelect={cng => setAttributes({ img: cng })} render={({ open }) =>
                        img ? <div className="b_blocks_media_control">
                            <IconButton icon="controls-repeat" onClick={open} style={{ color: '#4527a4', fontWeight: 'bold' }}>Replace Card Image</IconButton>
                            <IconButton icon="exit" onClick={() => setAttributes({ img: null })} style={{ color: 'red', fontWeight: 'bold' }}>Remove Card Image</IconButton>
                        </div> : <div className="b_blocks_media_control">
                                <IconButton icon="upload" onClick={open} style={{ color: '#4527a4', fontWeight: 'bold' }}>Upload Card Image</IconButton>
                            </div>} />
                </div>}

                {imgShow && <img src={img && img.url} className="card-img" alt={img && img.title} style={{ objectFit: 'cover' }} />}
            </div>;
        }

        const cardHeader = () => {
            return <Fragment>
                {headerShow && <span><RichText className="card-header b_blocks_card_header" key="editable" tagName={headerTag} placeholder="Enter Header Text" value={headerText} onChange={cng => { setAttributes({ headerText: cng }) }} inlineToolbar style={headerStyle} /></span>}
            </Fragment>;
        }

        const cardBody = () => {
            return <div className="card-body" style={bodyStyle}>
                <Fragment>
                    {bodyHeadShow && <span><RichText className="card-title b_blocks_card_body_head" key="editable" tagName={bodyHeadTag} placeholder="Enter Body Heading" value={bodyHeadText} onChange={cng => { setAttributes({ bodyHeadText: cng }) }} inlineToolbar style={bodyHeadStyle} /></span>}
                </Fragment>

                <Fragment>
                    {bodyDescShow && <span><RichText className="card-text b_blocks_card_body_desc" key="editable" tagName="p" placeholder="Enter Body Description" value={bodyDescText} onChange={cng => { setAttributes({ bodyDescText: cng }) }} inlineToolbar style={bodyDescStyle} /></span>}
                </Fragment>

                <Fragment>
                    <InnerBlocks allowedBlocks={ALLOWED_BLOCKS} />
                </Fragment>
            </div>
        }

        const cardFooter = () => {
            return <Fragment>
                {footerShow && <span><RichText className="card-footer b_blocks_card_footer" key="editable" tagName={footerTag} placeholder="Enter Footer Text" value={footerText} onChange={cng => { setAttributes({ footerText: cng }) }} inlineToolbar style={footerStyle} /></span>}
            </Fragment>;
        }

        return ([
            <InspectorControls>
                {/* Card Settings */}
                <PanelBody title="Card Settings" initialOpen={true}>
                    {/* Layout */}
                    {firstTitle('Layout:')}
                    <BtnGroup options={cardLayouts} myValue={layout} setState={(cng, def) => setAttributes({ layout: cng, cardWidth: def })} icon={true} />

                    {/* Alignment */}
                    {otherTitle('Alignment:')}
                    <BtnGroup options={aligns} myValue={cardAlign} setState={cng => setAttributes({ cardAlign: cng })} icon={true} />

                    {/* Width */}
                    <PanelRow>
                        {otherTitle('Width:')}
                        <BtnGroup options={sizeTypes} myValue={cardWidthType} setState={(cng, def) => setAttributes({ cardWidthType: cng, cardWidth: def })} classes="b_blocks_size_type" size="small" />
                    </PanelRow>

                    <RangeControl value={cardWidth} onChange={cng => setAttributes({ cardWidth: cng })} min={0} max={("%" == cardWidthType) ? 100 : 1920} step={1} />
                </PanelBody>


                {/* Image Settings */}
                <PanelBody title="Image Settings" initialOpen={false}>
                    {/* Show/Hide Image */}
                    <ToggleControl label={imgShow ? 'Hide Image' : 'Show Image'} checked={imgShow} onChange={cng => setAttributes({ imgShow: cng })} />

                    {imgShow && <Fragment>
                        {/* Position */}
                        {firstTitle('Position:')}
                        <RadioControl selected={imgPos} onChange={cng => setAttributes({ imgPos: cng })} options={[
                            { label: 'vertical' == layout ? 'Top' : 'Left', value: 'top' },
                            { label: 'vertical' == layout ? 'Bottom' : 'Right', value: 'bottom' },
                        ]}
                        />
                    </Fragment>}
                </PanelBody>


                {/* Header Settings */}
                <PanelBody title="Header Settings" initialOpen={false}>
                    {/* Show/Hide Header */}
                    <ToggleControl label={headerShow ? 'Hide Header' : 'Show Header'} checked={headerShow} onChange={cng => setAttributes({ headerShow: cng })} />

                    {headerShow && <Fragment>
                        {/* Header Tag */}
                        {firstTitle('Header Tag:')}
                        <BtnGroup options={hTags} myValue={headerTag} setState={(cng, def) => setAttributes({ headerTag: cng, headerFontSize: def })} />

                        {/* Text Align */}
                        {otherTitle('Text Align:')}
                        <BtnGroup options={aligns} myValue={headerAlign} setState={(cng, def) => setAttributes({ headerAlign: cng, cardWidth: def })} icon={true} />

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={16} value={headerFontSize} onChange={cng => setAttributes({ headerFontSize: 'undefined' === typeof cng ? 16 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={headerColor} onChange={cng => setAttributes({ headerColor: cng })} colors={colors} />

                        {/* Background Color */}
                        {otherTitle('Background Color:')}
                        <ColorPalette value={headerBGColor} onChange={cng => setAttributes({ headerBGColor: cng })} colors={colors} />
                    </Fragment>}
                </PanelBody>


                {/* Body Settings */}
                <PanelBody title="Body Settings" initialOpen={false}>
                    {/* Text Align */}
                    {firstTitle('Text Align:')}
                    <BtnGroup options={aligns} myValue={bodyTextAlign} setState={cng => setAttributes({ bodyTextAlign: cng })} icon={true} />

                    {/* Background Color */}
                    {otherTitle('Background Color:')}
                    <ColorPalette value={bodyBGColor} onChange={cng => setAttributes({ bodyBGColor: cng })} colors={colors} />

                    {/* Padding Top Bottom */}
                    {otherTitle('Padding Top Bottom:')}
                    <RangeControl value={bodyPTB} onChange={cng => setAttributes({ bodyPTB: cng })} min={0} max={100} step={1} />

                    {/* Padding Left Right */}
                    {otherTitle('Padding Left Right:')}
                    <RangeControl value={bodyPLR} onChange={cng => setAttributes({ bodyPLR: cng })} min={0} max={150} step={1} />
                </PanelBody>


                {/* Body Heading Settings */}
                <PanelBody title="Body Heading Settings" initialOpen={false}>
                    {/* Show/Hide Body Heading */}
                    <ToggleControl label={bodyHeadShow ? 'Hide Body Heading' : 'Show Body Heading'} checked={bodyHeadShow} onChange={cng => setAttributes({ bodyHeadShow: cng })} />

                    {bodyHeadShow && <Fragment>
                        {/* Body Heading Tag */}
                        {firstTitle('Body Heading Tag:')}
                        <BtnGroup options={hTags} myValue={bodyHeadTag} setState={(cng, def) => setAttributes({ bodyHeadTag: cng, bodyHeadFontSize: def })} />

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={16} value={bodyHeadFontSize} onChange={cng => setAttributes({ bodyHeadFontSize: 'undefined' === typeof cng ? 16 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={bodyHeadColor} onChange={cng => setAttributes({ bodyHeadColor: cng })} colors={colors} />

                        {/* Margin Bottom */}
                        {otherTitle('Margin Bottom:')}
                        <RangeControl value={bodyHeadMB} onChange={cng => setAttributes({ bodyHeadMB: cng })} min={0} max={100} step={1} />
                    </Fragment>}
                </PanelBody>


                {/* Body Description Settings */}
                <PanelBody title="Body Description Settings" initialOpen={false}>
                    {/* Show/Hide Body Description */}
                    <ToggleControl label={bodyDescShow ? 'Hide Body Description' : 'Show Body Description'} checked={bodyDescShow} onChange={cng => setAttributes({ bodyDescShow: cng })} />

                    {bodyDescShow && <Fragment>
                        {/* Font Size */}
                        {firstTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={bodyDescFontSize} onChange={cng => setAttributes({ bodyDescFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={bodyDescColor} onChange={cng => setAttributes({ bodyDescColor: cng })} colors={colors} />

                        {/* Margin Bottom */}
                        {otherTitle('Margin Bottom:')}
                        <RangeControl value={bodyDescMB} onChange={cng => setAttributes({ bodyDescMB: cng })} min={0} max={100} step={1} />
                    </Fragment>}
                </PanelBody>


                {/* Footer Settings */}
                <PanelBody title="Footer Settings" initialOpen={false}>
                    {/* Show/Hide Footer */}
                    <ToggleControl label={footerShow ? 'Hide Footer' : 'Show Footer'} checked={footerShow} onChange={cng => setAttributes({ footerShow: cng })} />

                    {footerShow && <Fragment>
                        {/* Footer Tag */}
                        {firstTitle('Footer Tag:')}
                        <BtnGroup options={tags} myValue={footerTag} setState={(cng, def) => setAttributes({ footerTag: cng, footerFontSize: def })} />

                        {/* Text Align */}
                        {otherTitle('Text Align:')}
                        <BtnGroup options={aligns} myValue={footerAlign} setState={cng => setAttributes({ footerAlign: cng })} icon={true} />

                        {/* Font Size */}
                        {otherTitle('Font Size:')}
                        <FontSizePicker fontSizes={fontSizes} fallbackFontSize={15} value={footerFontSize} onChange={cng => setAttributes({ footerFontSize: 'undefined' === typeof cng ? 15 : cng })} />

                        {/* Color */}
                        {otherTitle('Color:')}
                        <ColorPalette value={footerColor} onChange={cng => setAttributes({ footerColor: cng })} colors={colors} />

                        {/* Background Color */}
                        {otherTitle('Background Color:')}
                        <ColorPalette value={footerBGColor} onChange={cng => setAttributes({ footerBGColor: cng })} colors={colors} />
                    </Fragment>}
                </PanelBody>
            </InspectorControls>,


            <div className="b_blocks_card" style={{ textAlign: cardAlign }}>
                <div className="card" style={cardStyle}>
                    <BlockControls>
                        <AlignmentToolbar value={cardAlign} onChange={cng => setAttributes({ cardAlign: cng })} />
                    </BlockControls>

                    {'vertical' == layout && <Fragment>
                        {'top' == imgPos && cardImg()}

                        {cardHeader()}

                        {cardBody()}

                        {cardFooter()}

                        {'bottom' == imgPos && cardImg()}
                    </Fragment>}

                    {'horizontal' == layout && <div class="row no-gutters" style={{ backgroundColor: bodyBGColor }}>
                        {'top' == imgPos && <div class="col-md-6">
                            {cardImg()}
                        </div>}

                        <div class="col-md-6 d-flex flex-column justify-content-between">
                            {cardHeader()}

                            {cardBody()}

                            {cardFooter()}
                        </div>

                        {'bottom' == imgPos && <div class="col-md-6">
                            {cardImg()}
                        </div>}
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
            return <Fragment style={{ textAlign: 'center' }}>
                {imgShow && <img src={img && img.url} className="card-img" alt={img && img.title} style={{ objectFit: 'cover' }} />}
            </Fragment>;
        }

        const cardHeader = () => {
            return <Fragment>
                {headerShow && <RichText.Content className="card-header b_blocks_card_header" tagName={headerTag} value={headerText} style={headerStyle} />}
            </Fragment>;
        }

        const cardBody = () => {
            return <div className="card-body" style={bodyStyle}>
                <Fragment>
                    {bodyHeadShow && <RichText.Content className="card-title b_blocks_card_body_head" tagName={bodyHeadTag} value={bodyHeadText} style={bodyHeadStyle} />}
                </Fragment>

                <Fragment>
                    {bodyDescShow && <RichText.Content className="card-text b_blocks_card_body_desc" tagName="p" value={bodyDescText} style={bodyDescStyle} />}
                </Fragment>

                <Fragment>
                    <InnerBlocks.Content />
                </Fragment>
            </div>
        }

        const cardFooter = () => {
            return <Fragment>
                {footerShow && <RichText.Content className="card-footer b_blocks_card_footer" tagName={footerTag} value={footerText} style={footerStyle} />}
            </Fragment>;
        }

        return (
            <div className="b_blocks_card" style={{ textAlign: cardAlign }}>
                <div className="card" style={cardStyle}>
                    {'vertical' == layout && <Fragment>
                        {'top' == imgPos && cardImg()}

                        {cardHeader()}

                        {cardBody()}

                        {cardFooter()}

                        {'bottom' == imgPos && cardImg()}
                    </Fragment>}

                    {'horizontal' == layout && <div class="row no-gutters" style={{ backgroundColor: bodyBGColor }}>
                        {'top' == imgPos && <div class="col-md-6">
                            {cardImg()}
                        </div>}

                        <div class="col-md-6 d-flex flex-column justify-content-between">
                            {cardHeader()}

                            {cardBody()}

                            {cardFooter()}
                        </div>

                        {'bottom' == imgPos && <div class="col-md-6">
                            {cardImg()}
                        </div>}
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