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

export const HEADING_TAG_OPTIONS = [
	{ label: __( 'H2', 'b-blocks' ), value: 'h2' },
	{ label: __( 'H3', 'b-blocks' ), value: 'h3' },
	{ label: __( 'H4', 'b-blocks' ), value: 'h4' },
];

export const LIST_STYLE_OPTIONS = [
	{ label: __( 'Checkmark icons', 'b-blocks' ), value: 'check' },
	{ label: __( 'Numbered (1 2 3 …)', 'b-blocks' ), value: 'numbered' },
	{ label: __( 'Plain bullet', 'b-blocks' ), value: 'bullet' },
];

export const WEIGHT_OPTIONS = [
	{ label: __( 'Regular (400)', 'b-blocks' ), value: '400' },
	{ label: __( 'Medium (500)', 'b-blocks' ), value: '500' },
	{ label: __( 'Semibold (600)', 'b-blocks' ), value: '600' },
	{ label: __( 'Bold (700)', 'b-blocks' ), value: '700' },
];

export const ALIGN_OPTIONS = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
];

// Default per-item icon (check-circle) seeded for new takeaway items.
export const DEFAULT_ITEM_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>';
