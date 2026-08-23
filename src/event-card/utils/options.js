import { __ } from '@wordpress/i18n';

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') },
];

export const UNITS = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
	{ label: '%', value: '%' },
];

export const EMPTY_BOX = { top: '', right: '', bottom: '', left: '' };

export const TIMEZONES = [
	'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
	'America/Toronto', 'America/Sao_Paulo', 'America/Mexico_City', 'Europe/London', 'Europe/Paris',
	'Europe/Berlin', 'Europe/Madrid', 'Europe/Rome', 'Europe/Amsterdam', 'Europe/Moscow',
	'Africa/Cairo', 'Africa/Johannesburg', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Bangkok',
	'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore', 'Asia/Tokyo', 'Asia/Seoul',
	'Australia/Sydney', 'Australia/Perth', 'Pacific/Auckland',
];

export const FONT_WEIGHTS = [
	{ label: '400', value: '400' },
	{ label: '500', value: '500' },
	{ label: '600', value: '600' },
	{ label: '700', value: '700' },
	{ label: '800', value: '800' },
];
