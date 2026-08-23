import { __ } from '@wordpress/i18n';

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') }
];

// Ordered light → heavy so the picker reads as a spectrum of density.
export const themeOptions = [
	{ label: __('Default — classic grid', 'b-blocks'), value: 'default' },
	{ label: __('Clean — borderless, airy', 'b-blocks'), value: 'clean' },
	{ label: __('Striped — zebra rows', 'b-blocks'), value: 'striped' },
	{ label: __('Bordered — full grid', 'b-blocks'), value: 'bordered' },
	{ label: __('Cards — columns as cards', 'b-blocks'), value: 'cards' },
	{ label: __('Ribbon — tabbed headers on a panel', 'b-blocks'), value: 'ribbon' },
	{ label: __('Stacked — elevated coloured cards', 'b-blocks'), value: 'stacked' }
];

export const alignmentOptions = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const checkIconOptions = [
	{ label: __('Check', 'b-blocks'), value: 'check' },
	{ label: __('Check in circle', 'b-blocks'), value: 'check-circle' }
];

export const crossIconOptions = [
	{ label: __('Cross', 'b-blocks'), value: 'times' },
	{ label: __('Cross in circle', 'b-blocks'), value: 'times-circle' }
];

export const cellTypeOptions = [
	{ label: __('Icon', 'b-blocks'), value: 'icon' },
	{ label: __('Text', 'b-blocks'), value: 'text' }
];

export const cellTypeSelect = [
	{ label: __('Icon (yes/no)', 'b-blocks'), value: 'icon' },
	{ label: __('Text', 'b-blocks'), value: 'text' }
];

export const defaultCell = () => ({ type: 'icon', value: false, text: '' });

export const addNewColumn = (makeKey) => ({
	_key: makeKey('col'),
	label: __('New Plan', 'b-blocks'),
	subtitle: '',
	badge: '',
	isFeatured: false,
	accent: '',
	icon: '',
	iconColor: '',
	ctaUrl: '',
	ctaLabel: ''
});

export const addNewRow = (makeKey, columnCount = 0) => ({
	_key: makeKey('row'),
	label: __('New feature', 'b-blocks'),
	tooltip: '',
	cells: Array.from({ length: columnCount }, () => ({ type: 'icon', value: true, text: '' }))
});

export const EMPTY_BOX = { top: '', right: '', bottom: '', left: '' };
