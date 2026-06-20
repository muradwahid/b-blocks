import { __ } from '@wordpress/i18n';

/**
 * Static option lists for the Timeline block.
 *
 * Kept in one module so Edit, Settings, and Utilities all agree on
 * the canonical set of allowed values.
 */

export const LAYOUT_OPTIONS = [
	{ label: __( 'Alternating (left & right)', 'b-blocks' ), value: 'alternating' },
	{ label: __( 'Left side only', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right side only', 'b-blocks' ), value: 'right' },
];

export const LAYOUT_VALUES = LAYOUT_OPTIONS.map( ( o ) => o.value );

export const VARIANT_OPTIONS = [
	{ label: __( 'Modern', 'b-blocks' ), value: 'modern' },
	{ label: __( 'Classic', 'b-blocks' ), value: 'classic' },
	{ label: __( 'Minimal', 'b-blocks' ), value: 'minimal' },
];

export const VARIANT_VALUES = VARIANT_OPTIONS.map( ( o ) => o.value );

export const THEME_COLORS = [
	{ name: __( 'Blue', 'b-blocks' ), color: '#0d6efd' },
	{ name: __( 'Indigo', 'b-blocks' ), color: '#6610f2' },
	{ name: __( 'Purple', 'b-blocks' ), color: '#6f42c1' },
	{ name: __( 'Pink', 'b-blocks' ), color: '#d63384' },
	{ name: __( 'Red', 'b-blocks' ), color: '#dc3545' },
	{ name: __( 'Orange', 'b-blocks' ), color: '#fd7e14' },
	{ name: __( 'Yellow', 'b-blocks' ), color: '#ffc107' },
	{ name: __( 'Green', 'b-blocks' ), color: '#198754' },
	{ name: __( 'Teal', 'b-blocks' ), color: '#20c997' },
	{ name: __( 'Cyan', 'b-blocks' ), color: '#0dcaf0' },
	{ name: __( 'Gray', 'b-blocks' ), color: '#6c757d' },
	{ name: __( 'Dark', 'b-blocks' ), color: '#212529' },
	{ name: __( 'Light Gray', 'b-blocks' ), color: '#dee2e6' },
];

export const DEFAULT_ITEM = {
	date: '',
	title: '',
	description: '',
	icon: '',
	accentColor: '#0d6efd',
};
