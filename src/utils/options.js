import { __ } from '@wordpress/i18n';

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') }
];
export const generalStyleAdvancedTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') }
];

export const fontSizes = [
	{ name: 'Small', slug: 'small', size: 13 },
	{ name: 'Normal', slug: 'normal', size: 16 },
	{ name: 'Medium', slug: 'medium', size: 20 },
	{ name: 'Large', slug: 'large', size: 36 },
	{ name: 'Huge', slug: 'huge', size: 48 }
];

export const colors = [
	{ name: 'Black', color: '#000' },
	{ name: 'White', color: '#fff' },
	{ name: 'Purple Heart', color: '#4527a4' },
	{ name: 'Dark Orchid', color: '#8344c5' }
];

export const hTags = [
	{ label: 'Heading 1', value: 'h1', icon: 'H1', def: 32 },
	{ label: 'Heading 2', value: 'h2', icon: 'H2', def: 25 },
	{ label: 'Heading 3', value: 'h3', icon: 'H3', def: 20 },
	{ label: 'Heading 4', value: 'h4', icon: 'H4', def: 16 },
	{ label: 'Heading 5', value: 'h5', icon: 'H5', def: 14 },
	{ label: 'Heading 6', value: 'h6', icon: 'H6', def: 12 }
];

export const aligns = [
	{ label: 'Left', value: 'left', icon: 'editor-alignleft' },
	{ label: 'Center', value: 'center', icon: 'editor-aligncenter' },
	{ label: 'Right', value: 'right', icon: 'editor-alignright' },
	{ label: 'Justify', value: 'justify', icon: 'editor-justify' }
];

export const borderStyles = [
	{ label: 'Solid', value: 'solid' },
	{ label: 'Dashed', value: 'dashed' },
	{ label: 'Dotted', value: 'dotted' },
	{ label: 'Double', value: 'double' },
	{ label: 'Groove', value: 'groove' },
	{ label: 'Inset', value: 'inset' },
	{ label: 'Outset', value: 'outset' },
	{ label: 'Ridge', value: 'ridge' }
];

export const fontWeights = [
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
	{ label: 'Inherit', value: 'inherit' }
];

export const textTransforms = [
	{ label: 'None', value: 'none', icon: 'NO' },
	{ label: 'Capitalize', value: 'capitalize', icon: 'Aa' },
	{ label: 'Uppercase', value: 'uppercase', icon: 'AA' },
	{ label: 'Lowercase', value: 'lowercase', icon: 'aa' }
];

export const sizeTypes = [
	{ label: 'Pixel', value: 'px', icon: 'px', def: 650 },
	{ label: 'Percentage', value: '%', icon: '%', def: 100 }
];

export const postsOrdersBy = [
	{ label: 'Author', value: 'author' },
	{ label: 'Title', value: 'title' },
	{ label: 'Date', value: 'date' },
	{ label: 'Last Modified', value: 'modified' }
];

export const postsOrders = [
	{ label: 'Ascending', value: 'asc' },
	{ label: 'Descending', value: 'desc' }
];

export const sliderEffects = [
	{ label: 'Slide', value: 'slide' },
	{ label: 'Fade', value: 'fade' },
	{ label: 'Creative', value: 'creative' }
];

export const normalHoverTabs = [
	{ name: 'normal', title: __('Normal', 'b-blocks') },
	{ name: 'hover', title: __('Hover', 'b-blocks') }
];

export const flexPos = [
	{ label: 'Start', value: 'flex-start' },
	{ label: 'End', value: 'flex-end' },
	{ label: 'Center', value: 'center' },
	{ label: 'Space Around', value: 'space-around' },
	{ label: 'Space Between', value: 'space-between' },
	{ label: 'Space Evenly', value: 'space-evenly' }
];