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

export const LAYOUT_OPTIONS = [
	{ label: __('Horizontal (icon left)', 'b-blocks'), value: 'horizontal' },
	{ label: __('Vertical (icon top)', 'b-blocks'), value: 'vertical' },
];

export const ICON_STYLE_OPTIONS = [
	{ label: __('Filled', 'b-blocks'), value: 'filled' },
	{ label: __('Outline', 'b-blocks'), value: 'outline' },
];
