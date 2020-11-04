const options = {
    fontSizes: [
        { name: 'Small', slug: 'small', size: 13 },
        { name: 'Normal', slug: 'normal', size: 16 },
        { name: 'Medium', slug: 'medium', size: 20 },
        { name: 'Large', slug: 'large', size: 36 },
        { name: 'Huge', slug: 'huge', size: 48 }
    ],

    colors: [
        { name: 'Black', color: '#000' },
        { name: 'White', color: '#fff' },
        { name: 'Purple Heart', color: '#4527a4' },
        { name: 'Dark Orchid', color: '#8344c5' },
    ],

    tags: [
        { label: 'Paragraph', value: 'p' },
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
        { label: 'Heading 5', value: 'h5' },
        { label: 'Heading 6', value: 'h6' },
        { label: 'Span', value: 'span' }
    ],

    hTags: [
        { label: 'Heading 1', value: 'h1' },
        { label: 'Heading 2', value: 'h2' },
        { label: 'Heading 3', value: 'h3' },
        { label: 'Heading 4', value: 'h4' },
        { label: 'Heading 5', value: 'h5' },
        { label: 'Heading 6', value: 'h6' }
    ],

    aligns: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Justify', value: 'justify' }
    ],

    borderStyles: [
        { label: 'Solid', value: 'solid' },
        { label: 'Dashed', value: 'dashed' },
        { label: 'Dotted', value: 'dotted' },
        { label: 'Double', value: 'double' },
        { label: 'Groove', value: 'groove' },
        { label: 'Inset', value: 'inset' },
        { label: 'Outset', value: 'outset' },
        { label: 'Ridge', value: 'ridge' }
    ],

    fontWeights: [
        { label: 'Lighter', value: 'lighter' },
        { label: '100', value: '100' },
        { label: '200', value: '200' },
        { label: '300', value: '300' },
        { label: '400', value: '400' },
        { label: '500', value: '500' },
        { label: '600', value: '600' },
        { label: '700', value: '700' },
        { label: '800', value: '800' },
        { label: '900', value: '900' },
        { label: 'Bold', value: 'bold' },
        { label: 'Bolder', value: 'bolder' },
        { label: 'Normal', value: 'normal' },
        { label: 'Inherit', value: 'inherit' },
    ],

    textTransforms: [
        { label: 'None', value: 'none' },
        { label: 'Capitalize', value: 'capitalize' },
        { label: 'Uppercase', value: 'uppercase' },
        { label: 'Lowercase', value: 'lowercase' },
    ],

    layouts: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
    ],

    postsOrdersBy: [
        { label: 'Author', value: 'author' },
        { label: 'Title', value: 'title' },
        { label: 'Date', value: 'date' },
        { label: 'Last Modified', value: 'modified' },
    ],

    postsOrders: [
        { label: 'Ascending', value: 'asc' },
        { label: 'Descending', value: 'desc' }
    ],

    getMonth: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

    shadows: [
        { label: 'None', value: 'shadow-none' },
        { label: 'Small Shadow', value: 'shadow-sm' },
        { label: 'Regular Shadow', value: 'shadow' },
        { label: 'Large Shadow', value: 'shadow-lg' }
    ]
}
export default options;