import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooAddToCart';

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const fontWeightOptions = [
	{ label: __( 'Normal (400)', 'b-blocks' ), value: 400 },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: 500 },
	{ label: __( 'Semi Bold (600)', 'b-blocks' ), value: 600 },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: 700 },
	{ label: __( 'Extra Bold (800)', 'b-blocks' ), value: 800 }
];
