import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { Dashicon } from '@wordpress/components';

import './parent';
import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    layout: { type: 'string', default: 'vertical' },
    teamStyle: { type: 'string', default: 'default' },

    contentAlign: { type: 'string', default: 'center' },
    contentBGColor: { type: 'string', default: '#ffffff00' },
    contentPTB: { type: 'number', default: 50 },
    contentPLR: { type: 'number', default: 20 },

    imgId: { type: 'number' },
    imgUrl: { type: 'string', source: 'attribute', selector: 'img.memberPhoto', attribute: 'src' },
    imgAlt: { type: 'string', source: 'attribute', selector: 'img.memberPhoto', attribute: 'alt', default: '' },
    imgWidth: { type: 'number', default: 170 },
    imgMB: { type: 'number', default: 20 },
    imgBorderWidth: { type: 'number', default: 0 },
    imgBorderStyle: { type: 'string', default: 'solid' },
    imgBorderColor: { type: 'string', default: '#00000000' },
    imgBorderRadius: { type: 'number', default: 50 },
    imgRadiusType: { type: 'number', default: '%' },

    name: { type: 'string', source: 'html', selector: 'h4.memberName' },
    nameFontSize: { type: 'number', default: 20 },
    nameTransform: { type: 'string', default: 'none' },
    nameColor: { type: 'string', default: '#333' },
    nameMB: { type: 'number', default: 10 },

    isDes: { type: 'boolean', default: true },
    des: { type: 'string', source: 'html', selector: 'p.memberDes' },
    desFontSize: { type: 'number', default: 16 },
    desTransform: { type: 'string', default: 'none' },
    desColor: { type: 'string', default: '#333' },
    desMB: { type: 'number', default: 10 },

    isSep: { type: 'boolean', default: true },
    sepWidth: { type: 'number', default: 20 },
    sepThick: { type: 'number', default: 3 },
    sepStyle: { type: 'string', default: 'solid' },
    sepColor: { type: 'string', default: '#777' },
    sepMB: { type: 'number', default: 15 },

    isBio: { type: 'boolean', default: true },
    bio: { type: 'string', source: 'html', selector: 'span.memberBio' },
    bioFontSize: { type: 'number', default: 15 },
    bioColor: { type: 'string', default: '#333' },
    bioMB: { type: 'number', default: 15 },

    isSocial: { type: 'boolean', default: true },
    social: {
        type: 'array', source: 'query', selector: '.memberSocial ul li', query: {
            icon: { source: 'attribute', attribute: 'data-icon' },
            link: { source: 'attribute', selector: 'a', attribute: 'href' }
        }, default: [
            { link: 'https://facebook.com', icon: 'facebook-alt' },
            { link: 'https://twitter.com', icon: 'twitter' }
        ]
    },
    iconSize: { type: 'number', default: 22 },
    iconPadding: { type: 'number', default: 8 },
    iconMargin: { type: 'number', default: 10 },
    iconColor: { type: 'string', default: '#fff' },
    iconBGColor: { type: 'string', default: '#4527a4' },

    borderWidth: { type: 'number', default: 1 },
    borderStyle: { type: 'string', default: 'solid' },
    borderColor: { type: 'string', default: '#00000000' },
    borderRadius: { type: 'number', default: 3 },
    radiusType: { type: 'string', default: '%' },

    shadowColor: { type: 'string', default: '#000' },
    shadowHOffset: { type: 'number', default: 0 },
    shadowVOffset: { type: 'number', default: 0 },
    shadowBlur: { type: 'number', default: 0 },
    shadowSpreed: { type: 'number', default: 0 },
}

registerBlockType('b-blocks/team-member', {
    // Build In attributes
    title: __('Team Member', 'b-blocks'),
    description: __('Display Team Member', 'b-blocks'),
    parent: ['b-blocks/team-members'],
    icon: icons.teamMembers,
    category: 'bBlocks',
    keywords: [__('team', 'b-blocks'), __('member', 'b-blocks'), __('team section', 'b-blocks')],
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
        const { layout, contentAlign, contentBGColor, contentPTB, contentPLR, imgId, imgUrl, imgAlt, imgWidth, imgMB, imgBorderWidth, imgBorderStyle, imgBorderColor, imgBorderRadius, imgRadiusType, name, nameFontSize, nameTransform, nameColor, nameMB, isDes, des, desFontSize, desTransform, desColor, desMB, isSep, sepWidth, sepThick, sepStyle, sepColor, sepMB, isBio, bio, bioFontSize, bioColor, bioMB, isSocial, social, iconSize, iconPadding, iconMargin, iconColor, iconBGColor, borderWidth, borderStyle, borderColor, borderRadius, radiusType, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpreed } = props.attributes;


        // Styles
        const containerStyles = { backgroundColor: contentBGColor, border: `${borderWidth}px ${borderStyle} ${borderColor}`, boxShadow: `${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px ${shadowSpreed}px` };

        const containerClasses = `text-${contentAlign} ptb-${contentPTB} plr-${contentPLR} ${'horizontal' === layout ? 'horizontal' : 'vertical'} radius-${borderRadius}-${'%' === radiusType ? 'per' : radiusType}`;

        const imgStyles = { border: `${imgBorderWidth}px ${imgBorderStyle} ${imgBorderColor}` };
        const imgClasses = `memberPhoto w-${imgWidth}-px ${'horizontal' === layout ? `mr-20` : `mb-${imgMB}`} radius-${imgBorderRadius}-${'%' === imgRadiusType ? 'per' : imgRadiusType} ${imgId ? `wp-image-${imgId}` : null}`;

        return (
            <div className={containerClasses} style={containerStyles}>
                {imgUrl && <img className={imgClasses} src={imgUrl} alt={imgAlt} style={imgStyles} />}

                <div className='memberDetails'>
                    {name && <RichText.Content className={`memberName fontSize-${nameFontSize} ttr-${nameTransform} mb-${nameMB}`} style={{ color: nameColor }} tagName='h4' value={name} />}

                    {isDes && des && <RichText.Content className={`memberDes fontSize-${desFontSize} ttr-${desTransform} mb-${desMB}`} style={{ color: desColor }} tagName='p' value={des} />}

                    {isSep && <span className={`teamSeparator w-${sepWidth}-per mb-${sepMB}`} style={{ borderTop: `${sepThick}px ${sepStyle} ${sepColor}` }}></span>}

                    {isBio && bio && <RichText.Content className={`memberBio fontSize-${bioFontSize} mb-${bioMB}`} style={{ color: bioColor }} tagName='span' value={bio} />}

                    {isSocial && social.length > 0 && <div className='memberSocial'>
                        <ul style={{ justifyContent: 'center' === contentAlign ? 'center' : 'right' === contentAlign ? 'flex-end' : 'flex-start' }}>{social.map((item, index) => {
                            return (
                                <li key={index} data-icon={item.icon} className={`mx-${iconMargin / 2}`}>
                                    <a href={item.link} target='_blank' rel='noopener noreferrer'><Dashicon icon={item.icon} size={iconSize} className={`fontSize-${iconSize} p-${iconPadding}`} style={{ color: iconColor, backgroundColor: iconBGColor }} /></a>
                                </li>
                            )
                        })}</ul>
                    </div>}
                </div>
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    }
});