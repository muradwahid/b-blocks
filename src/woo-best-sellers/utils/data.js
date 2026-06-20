import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooBestSellers';

export const presetOptions = [
	{ label: __( 'Best Selling', 'b-blocks' ), value: 'best_selling' },
	{ label: __( 'Top Rated', 'b-blocks' ), value: 'top_rated' },
	{ label: __( 'Recently Added', 'b-blocks' ), value: 'newest' },
	{ label: __( 'On Sale', 'b-blocks' ), value: 'on_sale' },
	{ label: __( 'Featured', 'b-blocks' ), value: 'featured' }
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
	{ label: __( 'Center', 'b-blocks' ), value: 'center' }
];

export const cardShadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'sm' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'md' },
	{ label: __( 'Large', 'b-blocks' ), value: 'lg' }
];
