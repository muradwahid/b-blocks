import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksPostFilterGrid';

export const orderByOptions = [
	{ label: __( 'Date', 'b-blocks' ), value: 'date' },
	{ label: __( 'Title', 'b-blocks' ), value: 'title' },
	{ label: __( 'Random', 'b-blocks' ), value: 'rand' },
	{ label: __( 'Menu Order', 'b-blocks' ), value: 'menu_order' }
];

export const orderOptions = [
	{ label: __( 'Descending', 'b-blocks' ), value: 'desc' },
	{ label: __( 'Ascending', 'b-blocks' ), value: 'asc' }
];

export const layoutOptions = [
	{ label: __( 'Grid', 'b-blocks' ), value: 'grid' },
	{ label: __( 'Masonry', 'b-blocks' ), value: 'masonry' }
];

export const cardStyleOptions = [
	{ label: __( 'Boxed', 'b-blocks' ), value: 'boxed' },
	{ label: __( 'Flat', 'b-blocks' ), value: 'flat' }
];

export const cardShadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'sm' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'md' },
	{ label: __( 'Large', 'b-blocks' ), value: 'lg' }
];

export const aspectRatioOptions = [
	{ label: '16:9', value: '16/9' },
	{ label: '4:3', value: '4/3' },
	{ label: '1:1', value: '1/1' },
	{ label: '3:2', value: '3/2' }
];

export const titleTagOptions = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' }
];
