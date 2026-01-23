import { __ } from '@wordpress/i18n';

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name:'advanced', title: __('Advanced', 'b-blocks') }
];

export const scrollTypeOptions = [
	{ label: __('Icon', 'b-blocks'), value: 'icon' },
	{ label: __('Text', 'b-blocks'), value: 'text' },
	{ label: __('Progress', 'b-blocks'), value: 'progress' },
];