import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooProductGrid';

export const orderByOptions = [
	{ label: __( 'Date Added', 'b-blocks' ), value: 'date' },
	{ label: __( 'Price', 'b-blocks' ), value: 'price' },
	{ label: __( 'Rating', 'b-blocks' ), value: 'rating' },
	{ label: __( 'Popularity', 'b-blocks' ), value: 'popularity' },
	{ label: __( 'Random', 'b-blocks' ), value: 'rand' },
	{ label: __( 'Title', 'b-blocks' ), value: 'title' }
];

export const orderOptions = [
	{ label: __( 'Descending', 'b-blocks' ), value: 'desc' },
	{ label: __( 'Ascending', 'b-blocks' ), value: 'asc' }
];

export const aspectRatioOptions = [
	{ label: '3:4', value: '3/4' },
	{ label: '1:1', value: '1/1' },
	{ label: '4:3', value: '4/3' },
	{ label: '16:9', value: '16/9' }
];

export const imageFitOptions = [
	{ label: __( 'Cover', 'b-blocks' ), value: 'cover' },
	{ label: __( 'Contain', 'b-blocks' ), value: 'contain' }
];

export const contentAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const cardShadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'sm' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'md' },
	{ label: __( 'Large', 'b-blocks' ), value: 'lg' }
];
