import { __ } from '@wordpress/i18n';

export const themes = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Theme 1', 'b-blocks'), value: 'theme1' },
	{ label: __('Theme 2', 'b-blocks'), value: 'theme2' },
	{ label: __('Theme 3', 'b-blocks'), value: 'theme3' }
];
export const iconPositions = [
	{ label: __('Top', 'b-blocks'), value: 'top' },
	{ label: __('Label', 'b-blocks'), value: 'label' }
];
export const sepChars = [
	{ label: __('None', 'b-blocks'), value: '' },
	{ label: __('Coma (1,000)', 'b-blocks'), value: ',' },
	{ label: __('Space (1 000)', 'b-blocks'), value: ' ' }
];