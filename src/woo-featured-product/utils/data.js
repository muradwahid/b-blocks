import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksWooFeaturedProduct';

export const layoutOptions = [
	{ label: __( 'Horizontal (image + content)', 'b-blocks' ), value: 'horizontal' },
	{ label: __( 'Vertical (image on top)', 'b-blocks' ), value: 'vertical' }
];

export const imagePositionOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const aspectRatioOptions = [
	{ label: '1:1', value: '1/1' },
	{ label: '4:3', value: '4/3' },
	{ label: '3:4', value: '3/4' },
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

export const verticalAlignOptions = [
	{ label: __( 'Top', 'b-blocks' ), value: 'top' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Bottom', 'b-blocks' ), value: 'bottom' }
];

export const blockAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
