import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooProductReviews';

export const orderByOptions = [
	{ label: __( 'Newest first', 'b-blocks' ), value: 'newest' },
	{ label: __( 'Highest rating', 'b-blocks' ), value: 'highest_rating' },
	{ label: __( 'Lowest rating', 'b-blocks' ), value: 'lowest_rating' }
];

export const blockAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
