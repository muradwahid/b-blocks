import { RichText, InnerBlocks } from '@wordpress/block-editor';

const v1 = {
    supports: {
        align: ['center', 'wide', 'full']
    },

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
            return <>
                {imgShow && <img src={img && img.url} className="card-img" alt={img && img.title} style={{ objectFit: 'cover' }} />}
            </>;
        }

        const cardHeader = () => {
            return <>
                {headerShow && <RichText.Content className="card-header b_blocks_card_header" tagName={headerTag} value={headerText} style={headerStyle} />}
            </>;
        }

        const cardBody = () => {
            return <div className="card-body" style={bodyStyle}>
                <>
                    {bodyHeadShow && <RichText.Content className="card-title b_blocks_card_body_head" tagName={bodyHeadTag} value={bodyHeadText} style={bodyHeadStyle} />}
                </>

                <>
                    {bodyDescShow && <RichText.Content className="card-text b_blocks_card_body_desc" tagName="p" value={bodyDescText} style={bodyDescStyle} />}
                </>

                <>
                    <InnerBlocks.Content />
                </>
            </div>
        }

        const cardFooter = () => {
            return <>
                {footerShow && <RichText.Content className="card-footer b_blocks_card_footer" tagName={footerTag} value={footerText} style={footerStyle} />}
            </>;
        }

        return (
            <div className="b_blocks_card" style={{ textAlign: cardAlign }}>
                <div className="card" style={cardStyle}>
                    {'vertical' == layout && <div className="vertical_card">
                        {'top' == imgPos && cardImg()}

                        {cardHeader()}

                        {cardBody()}

                        {cardFooter()}

                        {'bottom' == imgPos && cardImg()}
                    </div>}

                    {'horizontal' == layout && <div className="row no-gutters" style={{ backgroundColor: bodyBGColor }}>
                        {'top' == imgPos && <div className="col-md-6">
                            {cardImg()}
                        </div>}

                        <div className="col-md-6 d-flex flex-column justify-content-between">
                            {cardHeader()}

                            {cardBody()}

                            {cardFooter()}
                        </div>

                        {'bottom' == imgPos && <div className="col-md-6">
                            {cardImg()}
                        </div>}
                    </div>}
                </div>
            </div>
        )
    }
}
const deprecated = [v1];
export default deprecated;