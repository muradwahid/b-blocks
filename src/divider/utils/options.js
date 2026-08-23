import { __ } from '@wordpress/i18n';

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

export const TYPE_OPTIONS = [
	{ label: __( 'Plain Line', 'b-blocks' ), value: 'line' },
	{ label: __( 'Line with Icon', 'b-blocks' ), value: 'icon' },
	{ label: __( 'Line with Text Label', 'b-blocks' ), value: 'text' },
];

export const LINE_STYLE_OPTIONS = [
	{ label: __( 'Solid', 'b-blocks' ), value: 'solid' },
	{ label: __( 'Dashed', 'b-blocks' ), value: 'dashed' },
	{ label: __( 'Dotted', 'b-blocks' ), value: 'dotted' },
	{ label: __( 'Double', 'b-blocks' ), value: 'double' },
];

export const ALIGN_OPTIONS = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' },
];
