import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksTestimonialsGrid';

export const MAX_ITEMS = 12;

export const styleOptions = [
	{ label: __( 'Card (shadow box)', 'b-blocks' ), value: 'card' },
	{ label: __( 'Minimal (flat)', 'b-blocks' ), value: 'minimal' }
];

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const textAlignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' }
];

export const avatarShapeOptions = [
	{ label: __( 'Circle', 'b-blocks' ), value: 'circle' },
	{ label: __( 'Rounded', 'b-blocks' ), value: 'rounded' },
	{ label: __( 'Square', 'b-blocks' ), value: 'square' }
];

export const shadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'sm' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'md' },
	{ label: __( 'Large', 'b-blocks' ), value: 'lg' }
];

export const fontWeightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' }
];

export const newItem = () => ( {
	_key: `tg-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 7 ) }`,
	quote: '',
	authorName: '',
	authorRole: '',
	authorCompany: '',
	avatarId: 0,
	avatarUrl: '',
	avatarAlt: '',
	rating: 5
} );
