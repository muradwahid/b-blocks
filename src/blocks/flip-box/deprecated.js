const v1 = {
    attributes: {
        cId: { type: 'string' },

        boxHeight: { type: 'number', default: 400 },

        contentAlign: { type: 'string', default: 'center' },

        contentBGType: { type: 'string', default: 'color' },

        contentBGColor: { type: 'string', default: '#000000b3' },

        contentBGImg: { type: 'object', default: null },
        isContentBGOpacity: { type: 'boolean', default: true },
        contentBGOpacityColor: { type: 'string', default: '#000000b3' },

        contentBGGradType: { type: 'string', default: 'linear' },
        contentBGGradRadialType: { type: 'string', default: 'ellipse' },
        contentBGGradFColor: { type: 'string', default: '#4527a4' },
        contentBGGradSColor: { type: 'string', default: '#8344c5' },
        contentBGGradFColorPos: { type: 'number', default: 1 },
        contentBGGradSColorPos: { type: 'number', default: 100 },
        contentBGGradRadialXPos: { type: 'number', default: 50 },
        contentBGGradRadialYPos: { type: 'number', default: 50 },
        contentBGGradAngel: { type: 'number', default: 135 },

        contentPTB: { type: 'number', default: 30 },
        contentPLR: { type: 'number', default: 25 },

        borderWidth: { type: 'number', default: 1 },
        borderStyle: { type: 'string', default: 'solid' },
        borderColor: { type: 'string', default: '#00000000' },
        borderRadius: { type: 'number', default: 0 },

        shadowColor: { type: 'string', default: '#000' },
        shadowHOffset: { type: 'number', default: 0 },
        shadowVOffset: { type: 'number', default: 0 },
        shadowBlur: { type: 'number', default: 0 },
        shadowSpreed: { type: 'number', default: 0 },

        isImg: { type: 'boolean', default: true },
        fImg: { type: 'object', default: null },
        bImg: { type: 'object', default: null },
        imgWidth: { type: 'number', default: 200 },
        imgRadius: { type: 'number', default: 0 },
        imgRadiusType: { type: 'number', default: '%' },
        imgMB: { type: 'number', default: 20 },

        fTitle: { type: 'string', source: 'html', selector: 'h3.flipFrontTitle', default: 'Front Title' },
        bTitle: { type: 'string', source: 'html', selector: 'h3.flipBackTitle', default: 'Back Title' },
        titleFontSize: { type: 'number', default: 25 },
        titleColor: { type: 'string', default: '#fff' },
        titleMB: { type: 'number', default: 20 },

        isDesc: { type: 'boolean', default: true },
        desc: { type: 'string', source: 'html', selector: 'p.flipDescription', default: 'Flip box description' },
        descFontSize: { type: 'number', default: 16 },
        descColor: { type: 'string', default: '#fff' },

        isBtn: { type: 'boolean', default: true },
        btn: { type: 'string', source: 'html', selector: 'a.flipBtn', default: 'Click Me' },
        btnLink: { type: 'string', source: 'attribute', selector: 'a.flipBtn', attribute: 'href' },
        btnFontSize: { type: 'number', default: 16 },
        btnColor: { type: 'string', default: '#fff' },
        btnBGColor: { type: 'string', default: '#ff4500' },
        btnHovColor: { type: 'string', default: '#fff' },
        btnHovBGColor: { type: 'string', default: '#ff7500' },
        btnPTB: { type: 'number', default: 15 },
        btnPLR: { type: 'number', default: 25 },
        btnRadius: { type: 'number', default: 3 },
    },

    save: props => {
        const { cId, boxHeight, contentAlign, contentBGType, contentBGColor, contentBGImg, isContentBGOpacity, contentBGOpacityColor, contentBGGradType, contentBGGradRadialType, contentBGGradFColor, contentBGGradSColor, contentBGGradFColorPos, contentBGGradSColorPos, contentBGGradAngel, contentBGGradRadialXPos, contentBGGradRadialYPos, contentPTB, contentPLR, borderWidth, borderStyle, borderColor, borderRadius, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpreed, isImg, fImg, bImg, imgWidth, imgRadius, imgRadiusType, imgMB, fTitle, bTitle, titleFontSize, titleColor, titleMB, isDesc, desc, descFontSize, descColor, isBtn, btn, btnLink, btnFontSize, btnColor, btnBGColor, btnHovColor, btnHovBGColor, btnPTB, btnPLR, btnRadius } = props.attributes;

        // Styles
        const contentStyles = {
            background: 'color' === contentBGType ? contentBGColor :

                'image' === contentBGType ? `url(${contentBGImg && contentBGImg.url}) center center / cover no-repeat ${isContentBGOpacity && contentBGOpacityColor}` :

                    'gradient' === contentBGType && 'linear' === contentBGGradType ? `linear-gradient(${contentBGGradAngel}deg, ${contentBGGradFColor} ${contentBGGradFColorPos}%, ${contentBGGradSColor} ${contentBGGradSColorPos}%)` :

                        'gradient' === contentBGType && 'radial' === contentBGGradType ? `radial-gradient(${'circle' === contentBGGradRadialType ? 'circle at' : 'at'} ${contentBGGradRadialXPos}% ${contentBGGradRadialYPos}%, ${contentBGGradFColor} ${contentBGGradFColorPos}%, ${contentBGGradSColor} ${contentBGGradSColorPos}%)` : 'none',
            border: `${borderWidth}px ${borderStyle} ${borderColor}`, boxShadow: `${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px ${shadowSpreed}px`
        };

        const contentClasses = `text-${contentAlign} ptb-${contentPTB} plr-${contentPLR} radius-${borderRadius}-px`;

        return (
            <div className='flipBox' data-colors={`{ "btnColor": "${btnColor}", "btnBGColor": "${btnBGColor}", "btnHovColor": "${btnHovColor}", "btnHovBGColor": "${btnHovBGColor}"}`} id={`bBlocksFlipBox-${cId}`} style={{ height: `${boxHeight}px` }}>
                <div className={`front ${contentClasses}`} style={contentStyles}>
                    <div className='frontContent'>
                        {isImg && fImg && <img className={`w-${imgWidth}-px mb-${imgMB} radius-${imgRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType}`} src={fImg.url} alt={fImg.alt} />}

                        {fTitle && <h3 className={`flipFrontTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }}>{fTitle}</h3>}

                        {isDesc && desc && <p className={`flipDescription fontSize-${descFontSize}`} style={{ color: descColor }}>{desc}</p>}
                    </div>
                </div>

                <div className={`back ${contentClasses}`} style={contentStyles}>
                    <div className='backContent'>
                        {isImg && bImg && <img className={`w-${imgWidth}-px mb-${imgMB} radius-${imgRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType}`} src={bImg.url} alt={bImg.alt} />}

                        {bTitle && <h3 className={`flipBackTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }}>{bTitle}</h3>}

                        {isBtn && btn && <a href={btnLink} className={`flipBtn fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} radius-${btnRadius}-px`} style={{ color: btnColor, backgroundColor: btnBGColor }} target='_blank' rel='noreferrer noopener'>{btn}</a>}
                    </div>
                </div>
            </div>
        );
    }
}
const deprecated = [v1];
export default deprecated;