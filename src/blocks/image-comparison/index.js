import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    cId: { type: 'string' },
    contentAlign: { type: 'string', default: 'center' },

    beforeImgId: { type: 'number' },
    beforeImgUrl: { type: 'string', source: 'attribute', selector: 'img.beforeImg', attribute: 'src' },
    beforeImgAlt: { type: 'string', source: 'attribute', selector: 'img.beforeImg', attribute: 'alt', default: '' },

    afterImgId: { type: 'number' },
    afterImgUrl: { type: 'string', source: 'attribute', selector: 'img.afterImg', attribute: 'src' },
    afterImgAlt: { type: 'string', source: 'attribute', selector: 'img.afterImg', attribute: 'alt', default: '' },

    isSwap: { type: 'boolean', default: false },
    imgWidth: { type: 'number', default: 80 },
    imgWidthType: { type: 'string', default: '%' },

    isLabel: { type: 'boolean', default: true },
    beforeLabel: { type: 'string', source: 'html', selector: '.beforeLabel' },
    afterLabel: { type: 'string', source: 'html', selector: '.afterLabel' },
    labelFontSize: { type: 'number', default: 15 },
    labelColor: { type: 'string', default: '#fff' },
    labelBGColor: { type: 'string', default: '#00000080' },
    labelPTB: { type: 'number', default: 10 },
    labelPLR: { type: 'number', default: 15 },

    isCap: { type: 'boolean', default: true },
    cap: { type: 'string', source: 'html', selector: '.caption' },
    capFontSize: { type: 'number', default: 14 },
    capColor: { type: 'string', default: '#333' },
    capBGColor: { type: 'string', default: '#f4f4f4' },
    capPTB: { type: 'number', default: 10 },
    capPLR: { type: 'number', default: 15 },

    borderWidth: { type: 'number', default: 1 },
    borderStyle: { type: 'string', default: 'solid' },
    borderColor: { type: 'string', default: '#00000000' },
}

registerBlockType('b-blocks/image-comparison', {
    // Build In attributes
    title: __('Image Comparison', 'b-blocks'),
    description: __('Compare between two images', 'b-blocks'),
    icon: icons.imageCompare,
    category: 'bBlocks',
    keywords: [__('image slider', 'b-blocks'), __('image compare', 'b-blocks'), __('image filter', 'b-blocks')],
    supports: {
        align: ['wide', 'full']
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { cId, contentAlign, beforeImgId, beforeImgUrl, beforeImgAlt, afterImgId, afterImgUrl, afterImgAlt, imgWidth, imgWidthType, isLabel, beforeLabel, afterLabel, labelFontSize, labelColor, labelBGColor, labelPTB, labelPLR, isCap, cap, capFontSize, capColor, capBGColor, capPTB, capPLR, borderWidth, borderStyle, borderColor } = props.attributes;


        // Styles
        const sliderWrapperStyles = { border: `${borderWidth}px ${borderStyle} ${borderColor}` };

        const labelStyles = { color: labelColor, backgroundColor: labelBGColor };

        const captionStyles = { color: capColor, backgroundColor: capBGColor };

        return (
            <div className={`text-${contentAlign}`} id={`bBlocksImageComparison-${cId}`}>
                {beforeImgUrl && afterImgUrl ? <div className={`comparison-slider-wrapper ${'%' === imgWidthType ? `w-${imgWidth}-per` : `w-${imgWidth}-px`}`} style={sliderWrapperStyles}>

                    <div className='comparison-slider'>
                        {isLabel && afterLabel && <RichText.Content className={`overlay afterLabel fontSize-${labelFontSize} ptb-${labelPTB} plr-${labelPLR}`} tagName='div' value={afterLabel} style={labelStyles} />}

                        <img className={`afterImg ${afterImgId ? `wp-image-${afterImgId}` : null}`} src={afterImgUrl} alt={afterImgAlt} />

                        <div className='resize'>
                            {isLabel && beforeLabel && <RichText.Content className={`overlay beforeLabel fontSize-${labelFontSize} ptb-${labelPTB} plr-${labelPLR}`} tagName='div' value={beforeLabel} style={labelStyles} />}

                            <img className={`beforeImg ${beforeImgId ? `wp-image-${beforeImgId}` : null}`} src={beforeImgUrl} alt={beforeImgAlt} />
                        </div>

                        <div className='divider'></div>
                    </div>

                    {isCap && cap && <RichText.Content className={`caption fontSize-${capFontSize} ptb-${capPTB} plr-${capPLR}`} tagName='div' value={cap} style={captionStyles} />}
                </div> : null}
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});