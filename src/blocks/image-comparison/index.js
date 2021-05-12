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
    leftImgId: { type: 'number' },
    leftImgUrl: { type: 'string', source: 'attribute', selector: 'img.leftImg', attribute: 'src' },
    leftImgAtl: { type: 'string', source: 'attribute', selector: 'img.leftImg', attribute: 'alt', default: '' },

    rightImgId: { type: 'number' },
    rightImgUrl: { type: 'string', source: 'attribute', selector: 'img.rightImg', attribute: 'src' },
    rightImgAtl: { type: 'string', source: 'attribute', selector: 'img.rightImg', attribute: 'alt', default: '' },

    isImgFullWidth: { type: 'boolean', default: true },
    imgWidth: { type: 'number', default: 400 },

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
    borderRadius: { type: 'number', default: 0 },
    radiusType: { type: 'string', default: '%' },
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
        const { isLabel, beforeLabel, afterLabel, labelFontSize, labelColor, labelBGColor, labelPTB, labelPLR, isCap, cap, capFontSize, capColor, capBGColor, capPTB, capPLR, borderWidth, borderStyle, borderColor, borderRadius, radiusType } = props.attributes;


        // Styles
        const sliderWrapperStyles = { border: `${borderWidth}px ${borderStyle} ${borderColor}`, borderRadius: `${borderRadius}${radiusType}` };

        const labelStyles = { color: labelColor, backgroundColor: labelBGColor };

        const captionStyles = { color: capColor, backgroundColor: capBGColor };

        return (
            <div>
                <div className='comparison-slider-wrapper' style={sliderWrapperStyles}>

                    <div className='comparison-slider'>
                        {isLabel && afterLabel && <RichText.Content className={`overlay afterLabel fontSize-${labelFontSize} ptb-${labelPTB} plr-${labelPLR}`} tagName='div' value={afterLabel} style={labelStyles} />}

                        <img className='rightImg' src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/751678/marioPhoto-2.jpg' alt='marioPhoto 2' />

                        <div className='resize'>
                            {isLabel && beforeLabel && <RichText.Content className={`overlay beforeLabel fontSize-${labelFontSize} ptb-${labelPTB} plr-${labelPLR}`} tagName='div' value={beforeLabel} style={labelStyles} />}

                            <img className='leftImg' src='https://s3-us-west-2.amazonaws.com/s.cdpn.io/751678/marioPhoto-1.jpg' alt='marioPhoto 1' />
                        </div>

                        <div className='divider'></div>
                    </div>

                    {isCap && cap && <RichText.Content className={`caption fontSize-${capFontSize} ptb-${capPTB} plr-${capPLR}`} tagName='div' value={cap} style={captionStyles} />}
                </div>
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});