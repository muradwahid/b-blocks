import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, InnerBlocks } from '@wordpress/block-editor';

import './parent';
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

    layout: { type: 'string', default: 'vertical' },

    contentAlign: { type: 'string', default: 'left' },
    contentBGColor: { type: 'string', default: '#ffffff00' },
    contentPadding: {
        type: 'object', default: {
            vertical: '20px',
            horizontal: '10px'
        }
    },

    imgId: { type: 'number' },
    imgUrl: { type: 'string', source: 'attribute', selector: '.cardImage img', attribute: 'src' },
    imgAlt: { type: 'string', source: 'attribute', selector: '.cardImage img', attribute: 'alt', default: '' },
    imgHeight: { type: 'number', default: 250 },
    imgPos: { type: 'string', default: 'top' },
    imgBorder: {
        type: 'object', default: {
            radius: '5px'
        }
    },

    isCat: { type: 'boolean', default: true },
    cat: { type: 'string', source: 'html', selector: 'h6.cardCategory', default: 'Category' },
    catTypo: {
        type: 'object', default: {
            fontSize: 15
        }
    },
    catColor: { type: 'string', default: '#0dcaf0' },
    catMargin: {
        type: 'object', default: {
            bottom: '10px'
        }
    },

    isTitle: { type: 'boolean', default: true },
    title: { type: 'string', source: 'html', selector: 'h3.cardTitle', default: 'Card Title' },
    titlePos: { type: 'string', default: 'image' },
    titleTypo: {
        type: 'object', default: {
            fontSize: 22
        }
    },
    titleColor: { type: 'string', default: '#ff7500' },
    titleMargin: {
        type: 'object', default: {
            bottom: '10px'
        }
    }
}

registerBlockType('b-blocks/card', {
    // Build In attributes
    title: __('Card', 'b-blocks'),
    description: __('Design a card', 'b-blocks'),
    parent: ['b-blocks/cards'],
    icon: icons.card,
    category: 'bBlocks',
    keywords: [__('card', 'b-blocks'), __('design card', 'b-blocks'), __('section card', 'b-blocks')],
    supports: { reusable: false, html: false },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { cId, layout = 'vertical', contentAlign = 'left', contentBGColor = '#ffffff00', contentPadding = { vertical: '20px', horizontal: '10px' }, imgId, imgUrl, imgAlt, imgHeight = 250, imgPos, imgBorder = { radius: '5px' }, isCat = true, cat = 'Category', catTypo = { fontSize: 15 }, catColor = '#0dcaf0', catMargin = { bottom: '10px' }, isTitle = true, title = 'Card Title', titlePos = 'image', titleTypo = { fontSize: 22 }, titleColor = '#ff7500', titleMargin = { bottom: '10px' } } = props.attributes;

        const cardTitle = () => isTitle && title && <RichText.Content className='cardTitle' tagName='h3' value={title} />;

        const cardImage = () => imgUrl && <figure className='cardImage'>
            <img className={`${imgId ? `wp-image-${imgId}` : null}`} src={imgUrl} alt={imgAlt} />

            {'image' === titlePos && cardTitle()}
        </figure>

        return <div id={`bBlocksCard-${cId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${catTypo?.googleFontLink});
                @import url(${titleTypo?.googleFontLink});

                #bBlocksCard-${cId} .bBlocksCard{ background-color: ${contentBGColor}; }
                
                #bBlocksCard-${cId} .bBlocksCard .cardImage{${imgBorder?.styles || 'border-radius: 5px;'}}
                #bBlocksCard-${cId} .bBlocksCard .cardImage img{ height: ${imgHeight}px; }

                #bBlocksCard-${cId} .bBlocksCard .cardDetails{ padding: ${contentPadding?.styles || '20px 10px'}; }
                #bBlocksCard-${cId} .bBlocksCard .cardDetails .cardCategory{
                    color: ${catColor};
                    ${catTypo?.styles || 'font-size: 15px;'}
                    margin: ${catMargin?.styles || 'margin: 0 0 10px 0'};
                }
                #bBlocksCard-${cId} .bBlocksCard .cardTitle{
                    color: ${titleColor};
                    ${titleTypo?.styles || 'font-size: 22px;'}
                    margin: ${titleMargin?.styles || 'margin: 0 0 10px 0'};
                }
            `}} />

            <div className={`bBlocksCard ${'horizontal' === layout ? 'horizontal' : 'vertical'} ${'bottom' === imgPos ? 'bottomImg' : 'topImg'}`}>
                {'top' === imgPos && cardImage()}

                <div className={`cardDetails text-${contentAlign}`}>
                    {isCat && cat && <RichText.Content className='cardCategory' tagName='h6' value={cat} />}

                    {'content' === titlePos && cardTitle()}

                    <InnerBlocks.Content />
                </div>

                {'bottom' === imgPos && cardImage()}
            </div>
        </div>;
    },

    deprecated,

    example: {
        attributes: {
            'preview': true
        },
    }
});