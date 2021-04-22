const { registerBlockType } = wp.blocks;
const { __ } = wp.i18n;
const { RichText } = wp.blockEditor;

import './parent';
import Edit from './edit';

// Import Sass
import './editor.scss';
import './style.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    contentAlign: { type: 'string', default: 'center' },
    contentBGColor: { type: 'string', default: '#ffffff88' },
    contentPTB: { type: 'number', default: 50 },
    contentPLR: { type: 'number', default: 20 },

    imgId: { type: 'number' },
    imgUrl: { type: 'string', source: 'attribute', selector: 'img.featureImage', attribute: 'src' },
    imgAtl: { type: 'string', source: 'attribute', selector: 'img.featureImage', attribute: 'alt', default: '' },
    imgMB: { type: 'number', default: 20 },

    title: { type: 'string', source: 'html', selector: 'h4.featureTitle' },
    titleFontSize: { type: 'number', default: 18 },
    titleColor: { type: 'string', default: '#333' },
    titleMB: { type: 'number', default: 10 },

    sepWidth: { type: 'number', default: 1 },
    sepThick: { type: 'number', default: 20 },
    sepStyle: { type: 'string', default: 'solid' },
    sepColor: { type: 'string', default: '#abb8c3' },

    desc: { type: 'string', source: 'html', selector: 'p.featureDescription' },
    descFontSize: { type: 'number', default: 15 },
    descColor: { type: 'string', default: '#333' },
    descMB: { type: 'number', default: 15 },
}

registerBlockType('b-blocks/feature-box', {
    // Build In attributes
    title: __('Feature Box', 'b-blocks'),
    description: __('Display Feature Box', 'b-blocks'),
    parent: ['b-blocks/feature-boxes'],
    icon: icons.featureBox,
    category: 'bBlocks',
    keywords: [__('feature', 'b-blocks'), __('feature box', 'b-blocks'), __('feature item', 'b-blocks')],
    supports: {
        reusable: false,
        html: false
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgMB, title, titleFontSize, titleColor, titleMB, desc, descFontSize, descColor, descMB } = props.attributes;

        return (
            <div className={`text-${contentAlign} ptb-${contentPTB} plr-${contentPLR}`} style={{ backgroundColor: contentBGColor }}>
                {imgUrl && <img className={`featureImage mb-${imgMB} ${imgId ? `wp-image-${imgId}` : null}`} src={imgUrl} alt={imgAlt} />}

                <div className='featureDetails'>
                    {title && <RichText.Content className={`featureTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h4' value={title} />}

                    {desc && <RichText.Content className={`featureDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} />}
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