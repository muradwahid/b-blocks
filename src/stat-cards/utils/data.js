import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksStatCards';

export const MAX_ITEMS = 12;

export const cardStyleOptions = [
	{ label: __( 'Flat', 'b-blocks' ), value: 'flat' },
	{ label: __( 'Outlined', 'b-blocks' ), value: 'outlined' },
	{ label: __( 'Accent top', 'b-blocks' ), value: 'accent-top' }
];

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const shadowOptions = [
	{ label: __( 'None', 'b-blocks' ), value: 'none' },
	{ label: __( 'Small', 'b-blocks' ), value: 'sm' },
	{ label: __( 'Medium', 'b-blocks' ), value: 'md' },
	{ label: __( 'Large', 'b-blocks' ), value: 'lg' }
];

export const numberWeightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' },
	{ label: __( 'Extra-bold', 'b-blocks' ), value: '800' },
	{ label: __( 'Black', 'b-blocks' ), value: '900' }
];

export const labelWeightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' }
];

export const trendDirectionOptions = [
	{ label: __( 'Up', 'b-blocks' ), value: 'up' },
	{ label: __( 'Down', 'b-blocks' ), value: 'down' },
	{ label: __( 'Neutral', 'b-blocks' ), value: 'neutral' }
];

export const newItem = () => ( {
	_key: `sc-${ Date.now() }-${ Math.random().toString( 36 ).slice( 2, 7 ) }`,
	icon: 'fa-solid fa-chart-line',
	number: '',
	prefix: '',
	suffix: '',
	label: '',
	description: '',
	trendValue: '',
	trendDirection: 'up',
	trendColor: '',
	linkUrl: '',
	linkTarget: false
} );
