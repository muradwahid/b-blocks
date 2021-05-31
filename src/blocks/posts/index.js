import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Deprecated
import deprecated from './deprecated';

// Custom Attributes
const attributes = {
    align: { type: 'string', default: 'wide' },
    cId: { type: 'string' },

    layout: { type: 'string', default: 'grid' },
    columns: {
        type: 'object',
        default: {
            desktop: 3,
            tablet: 2,
            mobile: 1
        }
    },
    columnGap: { type: 'number', default: 15 },
    rowGap: { type: 'number', default: 15 },
    isContentEqualHight: { type: 'string', default: 'true' },

    selectedCategories: { type: 'array', default: [] },
    isPostsPerPageAll: { type: 'string', default: 'false' },
    postsPerPage: { type: 'number', default: 12 },
    postsOrderBy: { type: 'string', default: 'date' },
    postsOrder: { type: 'string', default: 'desc' },

    contentAlign: { type: 'string', default: 'left' },
    contentBGColor: { type: 'string', default: '#f4f2fc' },
    postTextPTB: { type: 'number', default: 20 },
    postTextPLR: { type: 'number', default: 20 },
    borderColor: { type: 'string', default: '#4427a500' },

    isFImg: { type: 'string', default: 'true' },
    isFImgLink: { type: 'string', default: 'false' },

    isTitle: { type: 'string', default: 'true' },
    isTitleLink: { type: 'string', default: 'true' },
    titleFontSize: { type: 'number', default: 25 },
    titleColor: { type: 'string', default: '#4527a4' },
    titleMB: { type: 'number', default: 15 },

    isMeta: { type: 'string', default: 'true' },
    isMetaAuthor: { type: 'string', default: 'true' },
    isMetaDate: { type: 'string', default: 'true' },
    isMetaCategory: { type: 'string', default: 'true' },
    metaCategoryIn: { type: 'string', default: 'content' },
    isMetaComment: { type: 'string', default: 'false' },
    metaFontSize: { type: 'number', default: 13 },
    metaTransform: { type: 'string', default: 'uppercase' },
    metaTextColor: { type: 'string', default: '#333' },
    metaLinkColor: { type: 'string', default: '#8344c5' },
    metaIconColor: { type: 'string', default: '#4527a4' },
    metaMB: { type: 'number', default: 15 },

    isExcerpt: { type: 'string', default: 'true' },
    excerptLength: { type: 'number', default: 25 },
    excerptAlign: { type: 'string', default: 'justify' },
    excerptFontSize: { type: 'number', default: 15 },
    excerptColor: { type: 'string', default: '#333' },
    excerptMB: { type: 'number', default: 10 },

    isReadMore: { type: 'string', default: 'true' },
    readMoreLabel: { type: 'string', default: 'Read More' },
    isLinkNewTab: { type: 'string', default: 'false' },
    readMoreAlign: { type: 'string', default: 'left' },
    readMoreFontSize: { type: 'number', default: 14 },
    readMoreTransform: { type: 'string', default: 'uppercase' },
    readMoreColor: { type: 'string', default: '#4527a4' },
    readMoreHovColor: { type: 'string', default: '#8344c5' },
}

registerBlockType('b-blocks/posts', {
    // Build In attributes
    title: __('Posts', 'b-blocks'),
    description: __('Display blog posts', 'b-blocks'),
    icon: icons.article,
    category: 'bBlocks',
    keywords: [__('Show Posts', 'b-blocks'), __('Blog Posts', 'b-blocks'), __('Category Posts', 'b-blocks')],
    supports: {
        align: ['wide', 'full']
    },

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: () => null,

    deprecated,

    example: {
        attributes: {
            'preview': true,
            columns: {
                desktop: 1,
                tablet: 1,
                mobile: 1
            },
        },
    }
});