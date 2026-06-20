import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksPromoStrip';

export const headlineTagOptions = [
	{ label: __( 'Paragraph', 'b-blocks' ), value: 'p' },
	{ label: __( 'Heading 2', 'b-blocks' ), value: 'h2' },
	{ label: __( 'Heading 3', 'b-blocks' ), value: 'h3' },
	{ label: __( 'Heading 4', 'b-blocks' ), value: 'h4' }
];

export const layoutOptions = [
	{ label: __( 'Horizontal (row)', 'b-blocks' ), value: 'horizontal' },
	{ label: __( 'Stacked (centered column)', 'b-blocks' ), value: 'stacked' }
];

export const onExpireOptions = [
	{ label: __( 'Hide the strip', 'b-blocks' ), value: 'hide' },
	{ label: __( 'Show expired message', 'b-blocks' ), value: 'message' }
];

export const fontWeightOptions = [
	{ label: __( 'Normal (400)', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold (600)', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' },
	{ label: __( 'Extra-bold (800)', 'b-blocks' ), value: '800' }
];
