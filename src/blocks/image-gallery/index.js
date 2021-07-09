import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { } from '@wordpress/block-editor';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

// Custom Attributes
const attributes = {
    cId: { type: 'string' },

    images: { type: 'array', default: [] },
    columns: {
        type: 'object', default: {
            desktop: 3,
            tablet: 2,
            mobile: 1
        }
    },

    imgPadding: { type: 'object', default: {} },

    imgBorder: { type: 'object', default: {} },

    imgShadow: { type: 'object', default: {} },

    isCap: { type: 'boolean', default: true },
    capTitleTypo: {
        type: 'object', default: {
            fontSize: 15
        }
    },
    capDescTypo: {
        type: 'object', default: {
            fontSize: 15
        }
    },
    capColor: { type: 'string', default: '#333' },
    capAlign: { type: 'string', default: 'left' },
}

registerBlockType('b-blocks/image-gallery', {
    // Build In attributes
    title: __('Image Gallery', 'b-blocks'),
    description: __('Display Multiple Images as Gallery', 'b-blocks'),
    icon: icons.gallery,
    category: 'bBlocks',
    keywords: [__('images', 'b-blocks'), __('photos', 'b-blocks'), __('gallery', 'b-blocks')],
    supports: {
        align: ['wide', 'full']
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { cId, images, columns, imgPadding = {}, imgBorder = {}, imgShadow = {}, isCap, capAlign, capColor, capTitleTypo = { fontSize: 18 }, capDescTypo = { fontSize: 15 } } = props.attributes;

        return (
            <div id={`bBlocksImageGallery-${cId}`}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @import url(${capTitleTypo?.googleFontLink});
                    @import url(${capDescTypo?.googleFontLink});
                    
                    #bBlocksImageGallery-${cId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImg{
                        padding: ${imgPadding?.styles || '0 0'};
                        ${imgBorder?.styles}
                        filter: drop-shadow(${imgShadow?.styles})
                    }
                    #bBlocksImageGallery-${cId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption{
                        color: ${capColor};
                        margin: ${imgPadding?.styles || '0 0'};
                    }
                    #bBlocksImageGallery-${cId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption h4{
                        ${capTitleTypo?.styles || 'font-size: 18px;'}
                    }
                    #bBlocksImageGallery-${cId} .imgGalleryWrapper .imgGalleryImgLink .imgGalleryImgCaption p{
                        ${capDescTypo?.styles || 'font-size: 15px;'}
                    }
                `}} />

                <div className={`imgGalleryWrapper columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                    {images.map(img => (
                        <a key={img.id} href={img.url} className='imgGalleryImgLink' data-fancybox='gallery'>
                            <img src={img.url} alt='' className='imgGalleryImg' />

                            {(isCap && img.caption) && <div className={`imgGalleryImgCaption text-${capAlign}`}>
                                <div className='captionContent'>
                                    <h4>{img.caption}</h4>
                                    <p>{img.description}</p>
                                </div>
                            </div>}
                        </a>
                    ))}
                </div>
            </div>
        );
    },

    deprecated,

    example: {
        attributes: {
            'preview': true
        },
    },
});