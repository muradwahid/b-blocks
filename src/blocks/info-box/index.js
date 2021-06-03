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
    contentAlign: { type: 'string', default: 'center' },

    contentBGType: { type: 'string', default: 'color' },

    contentBGColor: { type: 'string', default: '#ffffff00' },

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

    contentPTB: { type: 'number', default: 50 },
    contentPLR: { type: 'number', default: 50 },

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
    imgPos: { type: 'string', default: 'top' },
    imgId: { type: 'number' },
    imgUrl: { type: 'string', source: 'attribute', selector: 'img.infoImage', attribute: 'src' },
    imgAlt: { type: 'string', source: 'attribute', selector: 'img.infoImage', attribute: 'alt', default: '' },
    imgWidth: { type: 'number', default: 200 },
    imgMB: { type: 'number', default: 20 },

    title: { type: 'string', source: 'html', selector: 'h3.infoTitle' },
    titleFontSize: { type: 'number', default: 25 },
    titleColor: { type: 'string', default: '#333' },
    titleMB: { type: 'number', default: 10 },

    isDesc: { type: 'boolean', default: true },
    desc: { type: 'string', source: 'html', selector: 'p.infoDescription' },
    descFontSize: { type: 'number', default: 15 },
    descColor: { type: 'string', default: '#333' },
    descMB: { type: 'number', default: 15 },

    isBtn: { type: 'boolean', default: false },
    btn: { type: 'string', source: 'html', selector: 'a.infoButton' },
    btnLink: { type: 'string', source: 'attribute', selector: 'a.infoButton', attribute: 'href' },
    btnLinkTab: { type: 'string', default: 'new' },
    btnFontSize: { type: 'number', default: 15 },
    btnTextColor: { type: 'string', default: '#fff' },
    btnBGColor: { type: 'string', default: '#4527a4' },
    btnPTB: { type: 'number', default: 8 },
    btnPLR: { type: 'number', default: 15 },
    btnRadius: { type: 'number', default: 5 },
}

registerBlockType('b-blocks/info-box', {
    // Build In attributes
    title: __('Info Box', 'b-blocks'),
    description: __('Display information', 'b-blocks'),
    icon: icons.infoBox,
    category: 'bBlocks',
    keywords: [__('info', 'b-blocks'), __('info box', 'b-blocks'), __('message', 'b-blocks')],
    supports: {
        align: ['wide', 'full']
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { contentAlign, contentBGType, contentBGColor, contentBGImg, isContentBGOpacity, contentBGOpacityColor, contentBGGradType, contentBGGradRadialType, contentBGGradFColor, contentBGGradSColor, contentBGGradFColorPos, contentBGGradSColorPos, contentBGGradAngel, contentBGGradRadialXPos, contentBGGradRadialYPos, contentPTB, contentPLR, borderWidth, borderStyle, borderColor, borderRadius, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpreed, isImg, imgPos, imgId, imgUrl, imgAlt, imgWidth, imgMB, title, titleFontSize, titleColor, titleMB, isDesc, desc, descFontSize, descColor, descMB, isBtn, btn, btnLink, btnLinkTab, btnFontSize, btnTextColor, btnBGColor, btnPTB, btnPLR, btnRadius } = props.attributes;

        return (
            <div className={`text-${contentAlign} ptb-${contentPTB} plr-${contentPLR} radius-${borderRadius}-px`} style={{
                background: 'color' === contentBGType ? contentBGColor :

                    'image' === contentBGType ? `url(${contentBGImg && contentBGImg.url}) center center / cover no-repeat ${isContentBGOpacity && contentBGOpacityColor}` :

                        'gradient' === contentBGType && 'linear' === contentBGGradType ? `linear-gradient(${contentBGGradAngel}deg, ${contentBGGradFColor} ${contentBGGradFColorPos}%, ${contentBGGradSColor} ${contentBGGradSColorPos}%)` :

                            'gradient' === contentBGType && 'radial' === contentBGGradType ? `radial-gradient(${'circle' === contentBGGradRadialType ? 'circle at' : 'at'} ${contentBGGradRadialXPos}% ${contentBGGradRadialYPos}%, ${contentBGGradFColor} ${contentBGGradFColorPos}%, ${contentBGGradSColor} ${contentBGGradSColorPos}%)` : 'none',
                border: `${borderWidth}px ${borderStyle} ${borderColor}`, boxShadow: `${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px ${shadowSpreed}px`
            }}>
                {isImg && 'top' === imgPos && imgUrl && <img className={`infoImage mb-${imgMB} ${imgId ? `wp-image-${imgId}` : null}`} src={imgUrl} alt={imgAlt} style={{ width: `${imgWidth}px` }} />}

                {title && <RichText.Content className={`infoTitle fontSize-${titleFontSize} mb-${titleMB}`} style={{ color: titleColor }} tagName='h3' value={title} />}

                {isDesc && desc && <RichText.Content className={`infoDescription fontSize-${descFontSize} mb-${descMB}`} style={{ color: descColor }} tagName='p' value={desc} />}

                {isImg && 'bottom' === imgPos && imgUrl && <img className={`infoImage mb-${imgMB} ${imgId ? `wp-image-${imgId}` : null}`} src={imgUrl} alt={imgAlt} style={{ width: `${imgWidth}px` }} />}

                {isBtn && btn && <>
                    <div></div>
                    <RichText.Content className={`infoButton fontSize-${btnFontSize} ptb-${btnPTB} plr-${btnPLR} radius-${btnRadius}-px`} style={{ color: btnTextColor, backgroundColor: btnBGColor }} tagName='a' value={btn} href={btnLink} target={'new' === btnLinkTab ? '_blank' : ''} rel='noreferrer noopener' />
                </>}
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});