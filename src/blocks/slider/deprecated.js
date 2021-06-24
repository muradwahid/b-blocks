import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

const v1 = {
    supports: {
        align: ['center', 'wide', 'full']
    },

    attributes: {
        align: { type: 'string', default: 'center' },
        cId: { type: 'string' },

        slides: { type: 'array' },

        sliderWidth: { type: 'number', default: 100 },
        sliderWidthType: { type: 'string', default: '%' },
        sliderHeight: { type: 'number', default: 350 },
        BGOverlayColor: { type: 'string', default: '#4527a4' },
        BGOverlayOpacity: { type: 'number', default: .4 },
        slideInterval: { type: 'number', default: 3 },
        slideFade: { type: 'boolean', default: false },

        contentAlign: { type: 'string', default: 'center' },

        titleTag: { type: 'string', default: 'h2' },
        titleColor: { type: 'string', default: '#fff' },
        titleFontSize: { type: 'number', default: 25 },
        titleMB: { type: 'number', default: 15 },

        descColor: { type: 'string', default: '#fff' },
        descFontSize: { type: 'number', default: 15 },
        descMB: { type: 'number', default: 15 },

        indicatorColor: { type: 'string', default: '#fff' },
        indicatorWidth: { type: 'number', default: 15 },
        indicatorHeight: { type: 'number', default: 15 },
        indicatorRadius: { type: 'number', default: 50 },
        indicatorRadiusType: { type: 'string', default: '%' }
    },

    save: props => {
        const { cId, slides, sliderWidth, sliderWidthType, sliderHeight, BGOverlayColor, BGOverlayOpacity, slideInterval, slideFade, contentAlign, titleTag, titleColor, titleFontSize, titleMB, descColor, descFontSize, descMB, indicatorColor, indicatorWidth, indicatorHeight, indicatorRadius, indicatorRadiusType } = props.attributes;

        // Styles
        const sliderStyle = { width: `${sliderWidth}${sliderWidthType}` }

        const slideItemStyle = { position: 'relative', minHeight: `${sliderHeight < 250 ? sliderHeight : 250}px`, height: `${sliderHeight}px` }

        const overlayOpacityStyle = { position: 'absolute', width: '100%', height: '100%', left: 0, right: 0, backgroundColor: BGOverlayColor, opacity: BGOverlayOpacity };

        const captionStyle = { textAlign: contentAlign, bottom: '60px' }

        const sliderIndicatorsStyle = { backgroundColor: indicatorColor, width: `${indicatorWidth}px`, height: `${indicatorHeight}px`, borderRadius: `${indicatorRadius}${indicatorRadiusType}` }

        // Components
        const slideIndicators = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(slide => {
                    const { index } = slide;
                    const active = index == 0 ? true : false;

                    return (
                        <li key={slide.index} data-target={`#bBlocksSlider-${cId}`} data-slide-to={index} className={active ? 'active' : ''} style={sliderIndicatorsStyle}></li>
                    );
                })
            );
        }

        const slideItem = value => {
            return (
                value && value.sort((a, b) => a.index - b.index).map(slide => {
                    const { index, img, title, description } = slide;
                    const active = index == 0 ? true : false;

                    return (
                        <div key={slide.index} className={`carousel-item ${active ? 'active' : ''}`} data-interval={slideInterval * 1000} style={slideItemStyle}>
                            <div style={overlayOpacityStyle}></div>

                            {img && <img src={img} className="w-100" alt="" />}

                            <div className="carousel-caption d-none d-md-block" style={captionStyle}>
                                <RichText.Content tagName={titleTag} value={title} style={{ color: titleColor, fontSize: `${titleFontSize}px`, margin: `0 0 ${titleMB}px 0` }} />
                                <RichText.Content tagName="p" value={description} style={{ color: descColor, fontSize: `${descFontSize}px`, margin: `0 0 ${descMB}px 0` }} />
                            </div>
                        </div>
                    );
                })
            );
        }


        return (
            <div className="b_blocks_slider" style={{ textAlign: 'inherit' }}>
                <div id={`bBlocksSlider-${cId}`} className={`carousel slide ${slideFade ? 'carousel-fade' : ''}`} data-ride="carousel" style={sliderStyle}>
                    <ol className="carousel-indicators" style={{ margin: '0 0 25px 0', padding: 0, listStyleType: 'none' }}>
                        {slideIndicators(slides)}
                    </ol>

                    <div className="carousel-inner">
                        {slideItem(slides)}
                    </div>

                    <a className="carousel-control-prev" href={`#bBlocksSlider-${cId}`} role="button" data-slide="prev" style={{ width: '75px' }}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">{__('Previous', 'b-blocks')}</span>
                    </a>
                    <a className="carousel-control-next" href={`#bBlocksSlider-${cId}`} role="button" data-slide="next" style={{ width: '75px' }}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">{__('Next', 'b-blocks')}</span>
                    </a>
                </div>
            </div>
        )
    }
}
const deprecated = [v1];
export default deprecated;