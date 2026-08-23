import { __ } from '@wordpress/i18n';

export const UNITS = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
	{ label: '%', value: '%' },
];

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') },
];

export const LAYOUT_OPTIONS = [
	{ label: __('Border — left accent bar', 'b-blocks'), value: 'border' },
	{ label: __('Quotation — large decorative mark', 'b-blocks'), value: 'quotation' },
];

export const ALIGN_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

export const SHAPE_OPTIONS = [
	{ label: __('Circle', 'b-blocks'), value: 'circle' },
	{ label: __('Rounded', 'b-blocks'), value: 'rounded' },
	{ label: __('Square', 'b-blocks'), value: 'square' },
];

// The decorative quotation-mark SVG shared by the editor and the frontend.
export const quoteIconPath = 'm142.6 0.7h-99.6c-23.5 0-42.7 19.2-42.7 42.6v99.7c0 23.4 19.2 42.6 42.7 42.6h60.4c0 47.2-34.6 85.4-81.7 85.4v60.3c86.4 0 156.3-69.9 156.3-156.3v-131.7c0-23.4-19.2-42.6-35.4-42.6zm256 0h-99.6c-23.5 0-42.7 19.2-42.7 42.6v99.7c0 23.4 19.2 42.6 42.7 42.6h60.4c0 47.2-34.6 85.4-81.7 85.4v60.3c86.4 0 156.3-69.9 156.3-156.3v-131.7c0-23.4-19.2-42.6-35.4-42.6z';

export const quoteIconPath2 = 'M9.17 6.5H4.5C3.4 6.5 2.5 7.4 2.5 8.5v4.67c0 1.1.9 2 2 2h2.83c0 2.21-1.62 4-3.83 4v2.83c4.05 0 7.33-3.28 7.33-7.33V8.5c0-1.1-.9-2-1.66-2zm12 0H16.5c-1.1 0-2 .9-2 2v4.67c0 1.1.9 2 2 2h2.83c0 2.21-1.62 4-3.83 4v2.83c4.05 0 7.33-3.28 7.33-7.33V8.5c0-1.1-.9-2-1.66-2z';
