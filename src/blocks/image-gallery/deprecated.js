const v1 = {
    supports: {
        align: ['center', 'wide', 'full']
    },

    attributes: {
        images: { type: 'array', default: [] },
        columns: {
            type: 'object',
            default: {
                desktop: 3,
                tablet: 2,
                mobile: 1
            }
        },

        imgPTB: { type: 'number', default: 0 },
        imgPLR: { type: 'number', default: 0 },

        borderWidth: { type: 'number', default: 1 },
        borderStyle: { type: 'string', default: 'solid' },
        borderColor: { type: 'string', default: '#00000000' },
        borderRadius: { type: 'number', default: 0 },
        radiusType: { type: 'string', default: '%' },

        shadowColor: { type: 'string', default: '#000' },
        shadowHOffset: { type: 'number', default: 0 },
        shadowVOffset: { type: 'number', default: 0 },
        shadowBlur: { type: 'number', default: 0 },

        isCap: { type: 'boolean', default: true },
        capFontSize: { type: 'number', default: 15 },
        capColor: { type: 'string', default: '#333' },
        capAlign: { type: 'string', default: 'center' },
        capVAlign: { type: 'string', default: 'flex-end' },
        capHAlign: { type: 'string', default: 'center' },
    },

    save: props => {
        const { images, columns, imgPTB, imgPLR, borderWidth, borderStyle, borderColor, borderRadius, radiusType, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, isCap, capFontSize, capColor, capAlign, capVAlign, capHAlign } = props.attributes;

        return (
            <div>
                <div className={`imgGalleryWrapper columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                    {images.map(img => (
                        <a key={img.id} href={img.url} className='imgGalleryImgLink' data-fancybox='gallery'>
                            <img src={img.url} alt='' className={`imgGalleryImg ptb-${imgPTB} plr-${imgPLR} radius-${borderRadius}-${'%' === radiusType ? 'per' : radiusType}`} style={{ border: `${borderWidth}px ${borderStyle} ${borderColor}`, filter: `drop-shadow(${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px)` }} />

                            {isCap && <span className={`imgGalleryImgCaption  fontSize-${capFontSize} text-${capAlign} alignItems-${capVAlign} justifyContent-${capHAlign}`} style={{ color: capColor }}>{img.caption}</span>}
                        </a>
                    ))}
                </div>
            </div>
        );
    }
}
const deprecated = [v1];
export default deprecated;