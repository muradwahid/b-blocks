import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooProductCarousel';

export const productTypeOptions = [
	{ label: __( 'All', 'b-blocks' ), value: 'all' },
	{ label: __( 'Featured', 'b-blocks' ), value: 'featured' },
	{ label: __( 'On Sale', 'b-blocks' ), value: 'on_sale' },
	{ label: __( 'Best Selling', 'b-blocks' ), value: 'best_selling' },
	{ label: __( 'Top Rated', 'b-blocks' ), value: 'top_rated' }
];

export const orderByOptions = [
	{ label: __( 'Newest', 'b-blocks' ), value: 'date' },
	{ label: __( 'Popularity', 'b-blocks' ), value: 'popularity' },
	{ label: __( 'Rating', 'b-blocks' ), value: 'rating' },
	{ label: __( 'Price (low–high)', 'b-blocks' ), value: 'price' },
	{ label: __( 'Price (high–low)', 'b-blocks' ), value: 'price-desc' },
	{ label: __( 'Title', 'b-blocks' ), value: 'title' },
	{ label: __( 'Random', 'b-blocks' ), value: 'rand' }
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

export const contentAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' }
];

export const cardShadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'sm' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'md' },
	{ label: __( 'Large', 'b-blocks' ), value: 'lg' }
];

export const titleWeightOptions = [
	{ label: '400', value: 400 },
	{ label: '500', value: 500 },
	{ label: '600', value: 600 },
	{ label: '700', value: 700 },
	{ label: '800', value: 800 }
];
