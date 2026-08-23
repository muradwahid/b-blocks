import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksStatCards';
export const MAX_ITEMS = 12;

export const UNITS = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
	{ label: '%', value: '%' },
];

export const generalStyleTabs = [
	{ name: 'general', title: __( 'General', 'b-blocks' ) },
	{ name: 'style', title: __( 'Style', 'b-blocks' ) },
	{ name: 'advanced', title: __( 'Advanced', 'b-blocks' ) },
];

export const cardStyleOptions = [
	{ label: __( 'Flat', 'b-blocks' ), value: 'flat' },
	{ label: __( 'Outlined', 'b-blocks' ), value: 'outlined' },
	{ label: __( 'Accent top', 'b-blocks' ), value: 'accent-top' },
];

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' },
];

export const numberWeightOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium', 'b-blocks' ), value: '500' },
	{ label: __( 'Semi-bold', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold', 'b-blocks' ), value: '700' },
	{ label: __( 'Extra-bold', 'b-blocks' ), value: '800' },
	{ label: __( 'Black', 'b-blocks' ), value: '900' },
];

export const orientationOptions = [
	{ label: __( 'Vertical', 'b-blocks' ), value: 'vertical' },
	{ label: __( 'Horizontal', 'b-blocks' ), value: 'horizontal' },
];

export const itemOrientationOptions = [
	{ label: __( 'Default (inherit)', 'b-blocks' ), value: '' },
	...orientationOptions,
];

export const trendDirectionOptions = [
	{ label: __( 'Up', 'b-blocks' ), value: 'up' },
	{ label: __( 'Down', 'b-blocks' ), value: 'down' },
	{ label: __( 'Neutral', 'b-blocks' ), value: 'neutral' },
];

// Default per-item icon (chart-line) seeded for new stat cards.
export const DEFAULT_ITEM_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z"/></svg>';

export const newItem = () => ( {
	icon: DEFAULT_ITEM_ICON,
	orientation: '',
	number: '',
	prefix: '',
	suffix: '',
	label: '',
	description: '',
	trendValue: '',
	trendDirection: 'up',
	trendColor: '',
	linkUrl: '',
	linkTarget: false,
} );
