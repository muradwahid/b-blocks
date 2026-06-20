import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooSaleBadge';

export const badgeModeOptions = [
	{ label: __( 'Custom label (e.g. Sale!)', 'b-blocks' ), value: 'sale_label' },
	{ label: __( 'Percentage off (e.g. -20%)', 'b-blocks' ), value: 'percentage' },
	{ label: __( 'Amount saved (e.g. Save $15)', 'b-blocks' ), value: 'amount_saved' }
];

export const badgeShapeOptions = [
	{ label: __( 'Pill', 'b-blocks' ), value: 'pill' },
	{ label: __( 'Square', 'b-blocks' ), value: 'square' },
	{ label: __( 'Circle', 'b-blocks' ), value: 'circle' }
];

export const badgePositionOptions = [
	{ label: __( 'Inline (beside price)', 'b-blocks' ), value: 'inline' },
	{ label: __( 'Above price', 'b-blocks' ), value: 'above' },
	{ label: __( 'Below price', 'b-blocks' ), value: 'below' }
];

export const fontWeightOptions = [
	{ label: __( 'Normal (400)', 'b-blocks' ), value: 400 },
	{ label: __( 'Semi-bold (600)', 'b-blocks' ), value: 600 },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: 700 },
	{ label: __( 'Extra-bold (800)', 'b-blocks' ), value: 800 }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
