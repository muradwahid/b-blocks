import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksLogoGrid';

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const labelWeightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' }
];

export const filterDefaultOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Grayscale', 'b-blocks' ), value: 'grayscale' }
];

export const hoverEffectOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Color (grayscale → color)', 'b-blocks' ), value: 'color' },
	{ label: __( 'Opacity (dim → full)', 'b-blocks' ), value: 'opacity' },
	{ label: __( 'Lift (raise with shadow)', 'b-blocks' ), value: 'lift' }
];

export const MAX_ITEMS = 40;

export const newItem = () => ( {
	_key: `lg-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 7 ) }`,
	imageId: 0,
	imageUrl: '',
	imageAlt: '',
	linkUrl: '',
	linkNewTab: false
} );
