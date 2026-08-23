import { __ } from '@wordpress/i18n';

export const UNITS = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
	{ label: '%', value: '%' },
];

export const EMPTY_BOX = { top: '', right: '', bottom: '', left: '' };

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') },
];

export const MIN_HEIGHT_OPTIONS = [
	{ label: __('Full viewport (100vh)', 'b-blocks'), value: '100vh' },
	{ label: __('Almost full (90vh)', 'b-blocks'), value: '90vh' },
	{ label: __('Three-quarter (75vh)', 'b-blocks'), value: '75vh' },
	{ label: __('Default (60vh)', 'b-blocks'), value: '60vh' },
	{ label: __('Half viewport (50vh)', 'b-blocks'), value: '50vh' },
	{ label: __('Auto (fits content)', 'b-blocks'), value: 'auto' },
	{ label: __('Custom', 'b-blocks'), value: 'custom' },
];

// Preset min-height values (everything except the "custom" sentinel).
export const MIN_HEIGHT_PRESETS = ['100vh', '90vh', '75vh', '60vh', '50vh', 'auto'];

export const VALIGN_OPTIONS = [
	{ label: __('Top', 'b-blocks'), value: 'top' },
	{ label: __('Middle', 'b-blocks'), value: 'middle' },
	{ label: __('Bottom', 'b-blocks'), value: 'bottom' },
];

export const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

export const HEADING_TAG_OPTIONS = [
	{ label: 'H1', value: 'h1' },
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
];
