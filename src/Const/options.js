// Icon
import icons from './icons';

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
        { label: 'Paragraph', value: 'p', icon: 'P', def: 15 },
        { label: 'Heading 1', value: 'h1', icon: 'H1', def: 32 },
        { label: 'Heading 2', value: 'h2', icon: 'H2', def: 25 },
        { label: 'Heading 3', value: 'h3', icon: 'H3', def: 20 },
        { label: 'Heading 4', value: 'h4', icon: 'H4', def: 16 },
        { label: 'Heading 5', value: 'h5', icon: 'H5', def: 14 },
        { label: 'Heading 6', value: 'h6', icon: 'H6', def: 12 },
        { label: 'Span', value: 'span', icon: 'SPAN', def: 15 },
        { label: 'Div', value: 'div', icon: 'DIV', def: 15 }
    ],

    hTags: [
        { label: 'Heading 1', value: 'h1', icon: 'H1', def: 32 },
        { label: 'Heading 2', value: 'h2', icon: 'H2', def: 25 },
        { label: 'Heading 3', value: 'h3', icon: 'H3', def: 20 },
        { label: 'Heading 4', value: 'h4', icon: 'H4', def: 16 },
        { label: 'Heading 5', value: 'h5', icon: 'H5', def: 14 },
        { label: 'Heading 6', value: 'h6', icon: 'H6', def: 12 }
    ],

    aligns: [
        { label: 'Left', value: 'left', icon: 'editor-alignleft' },
        { label: 'Center', value: 'center', icon: 'editor-aligncenter' },
        { label: 'Right', value: 'right', icon: 'editor-alignright' },
        { label: 'Justify', value: 'justify', icon: 'editor-justify' }
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
        { label: 'Capitalize', value: 'capitalize', icon: 'Tt' },
        { label: 'Uppercase', value: 'uppercase', icon: 'TT' },
        { label: 'Lowercase', value: 'lowercase', icon: 'tt' },
        { label: 'None', value: 'none', icon: 'NO' },
    ],

    sizeTypes: [
        { label: 'Pixel', value: 'px', icon: 'px', def: 650 },
        { label: 'Percentage', value: '%', icon: '%', def: 100 }
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
    ],
}
export default options;