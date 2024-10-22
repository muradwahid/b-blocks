import { __ } from '@wordpress/i18n';

export const shapedOptions = [
	{ value: 'none', label: 'None' },
	{ value: 'ocean-wave', label: 'Ocean Wave' },
	{ value: 'asymmetric-triangle', label: 'Asymmetric Triangle [Left]' },
	{ value: 'abstract-paintbrush', label: 'Abstract Paintbrush' },
	{ value: 'asymmetric-curve', label: 'Asymmetric Curve (Inverted)' },
	// { value: 'cloud', label: 'Cloud' },
	// { value: 'mountain', label: 'Mountain' },
	// { value: 'fire', label: 'Fire' },
	// { value: 'sports', label: 'Sports' },
	// { value: 'travel', label: 'Travel' },
];

export const verticalAlignOptions = [
	{ value: 'start', label: 'Top' },
	{ value: 'center', label: 'Center' },
	{ value: 'end', label: 'Bottom' }
];

export const horizontalAlignOptions = [
	{ value: 'flex-start', label: 'Left' },
	{ value: 'center', label: 'Center' },
	{ value: 'flex-end', label: 'Right' }
];

export const shapeTabs = [
	{ name: 'top', title: __('Top', 'b-blocks') },
	{ name: 'bottom', title: __('Bottom', 'b-blocks') }
];