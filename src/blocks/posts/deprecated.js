const v1 = {
    supports: {
        align: ['center', 'wide', 'full']
    },

    attributes: {
        align: { type: 'string', default: 'full' },
        cId: { type: 'string' },

        selectedCategories: { type: 'array', default: [] },
        postsPerPageAll: { type: 'boolean', default: 'false' },
        postsPerPage: { type: 'number', default: 12 },
        postsOrderBy: { type: 'string', default: 'date' },
        postsOrder: { type: 'string', default: 'desc' },

        layout: { type: 'string', default: 'grid' },
        columns: { type: 'number', default: 3 },
        columnGap: { type: 'number', default: 10 },
        rowGap: { type: 'number', default: 10 },
        contentEqualHight: { type: 'string', default: 'true' },

        contentAlign: { type: 'string', default: 'left' },
        contentBGColor: { type: 'string', default: '#fff' },
        postTextPTB: { type: 'number', default: 20 },
        postTextPLR: { type: 'number', default: 25 },
        shadow: { type: 'string', default: 'shadow' },

        featureImgShow: { type: 'string', default: 'true' },

        titleShow: { type: 'string', default: 'true' },
        titleFontSize: { type: 'number', default: 20 },
        titleColor: { type: 'string', default: '#4527a4' },
        titleMB: { type: 'number', default: 15 },

        metaShow: { type: 'string', default: 'true' },
        metaAuthorShow: { type: 'string', default: 'true' },
        metaDateShow: { type: 'string', default: 'true' },
        metaCategoryShow: { type: 'string', default: 'true' },
        metaCommentShow: { type: 'string', default: 'false' },
        metaFontSize: { type: 'number', default: 13 },
        metaTransform: { type: 'string', default: 'uppercase' },
        metaTextColor: { type: 'string', default: '#333' },
        metaLinkColor: { type: 'string', default: '#8344c5' },
        metaIconColor: { type: 'string', default: '#4527a4' },
        metaMB: { type: 'number', default: 15 },

        excerptShow: { type: 'string', default: 'true' },
        excerptLength: { type: 'number', default: 25 },
        excerptAlign: { type: 'string', default: 'justify' },
        excerptFontSize: { type: 'number', default: 15 },
        excerptColor: { type: 'string', default: '#333' },
        excerptMB: { type: 'number', default: 10 },

        readMoreShow: { type: 'string', default: 'true' },
        readMoreLabel: { type: 'string', default: 'Read More' },
        readMoreAlign: { type: 'string', default: 'left' },
        readMoreFontSize: { type: 'number', default: 14 },
        readMoreTransform: { type: 'string', default: 'uppercase' },
        readMoreFontWeight: { type: 'string', default: '600' },
        readMoreColor: { type: 'string', default: '#4527a4' },
        readMoreHovColor: { type: 'string', default: '#8344c5' },
    }
}

const deprecated = [v1];

export default deprecated;