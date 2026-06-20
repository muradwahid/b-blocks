import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooSingleProduct';

export const layoutOptions = [
	{ label: __( 'Horizontal (gallery + summary)', 'b-blocks' ), value: 'horizontal' },
	{ label: __( 'Vertical (gallery on top)', 'b-blocks' ), value: 'vertical' }
];

export const blockAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const mobileStackOptions = [
	{ label: __( 'Gallery First', 'b-blocks' ), value: 'gallery-first' },
	{ label: __( 'Summary First', 'b-blocks' ), value: 'summary-first' }
];
