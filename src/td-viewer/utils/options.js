import { __ } from '@wordpress/i18n';

export const sourceTypes = [
	{ label: __('Upload', 'b-blocks'), value: 'upload' },
	{ label: __('Link', 'b-blocks'), value: 'link' }
];
export const loadingTypes = [
	{ label: __('Auto', 'b-blocks'), value: 'auto' },
	{ label: __('Lazy', 'b-blocks'), value: 'lazy' },
	{ label: __('Eager', 'b-blocks'), value: 'eager' }
];