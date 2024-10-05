import { __ } from '@wordpress/i18n';

export const layouts = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Layout 1', 'b-blocks'), value: 'layout1' },
	{ label: __('Layout 2', 'b-blocks'), value: 'layout2' },
	{ label: __('Layout 3', 'b-blocks'), value: 'layout3' },
];
export const sepTypes = [
	{ label: __('Dotted', 'b-blocks'), value: ':' },
	{ label: __('Dashed', 'b-blocks'), value: '-' },
	{ label: __('Solid', 'b-blocks'), value: '|' },
];
export const flexDirections = [
	{ label: __('Row', 'b-blocks'), value: 'row' },
	{ label: __('Column', 'b-blocks'), value: 'column' }
];