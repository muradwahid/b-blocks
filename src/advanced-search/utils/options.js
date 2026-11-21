import { __ } from '@wordpress/i18n';

export const stateOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: 'normal' },
	{ label: __( 'Hover', 'b-blocks' ), value: 'hover' }
];

export const presetOptions = [
	{ label: __( 'Preset 1 — Classic (Separate)', 'b-blocks' ), value: 'preset-1' },
	{ label: __( 'Preset 2 — Pill-shaped', 'b-blocks' ), value: 'preset-2' },
	{ label: __( 'Preset 3 — Rounded rectangle', 'b-blocks' ), value: 'preset-3' },
	{ label: __( 'Preset 4 — Minimal underline', 'b-blocks' ), value: 'preset-4' }
];

export const orderByOptions = [
	{ label: __( 'Relevance', 'b-blocks' ), value: 'relevance' },
	{ label: __( 'Newest First', 'b-blocks' ), value: 'date' },
	{ label: __( 'Title (A–Z)', 'b-blocks' ), value: 'title' }
];

export const fieldStateOptions = [
	{ label: __( 'Normal', 'b-blocks' ), value: 'normal' },
	{ label: __( 'Hover', 'b-blocks' ), value: 'hover' },
	{ label: __( 'Focus', 'b-blocks' ), value: 'focus' }
];

export const footerAlignOptions = [
	{ label: __( 'Space Between', 'b-blocks' ), value: 'space-between' },
	{ label: __( 'Start', 'b-blocks' ), value: 'flex-start' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'End', 'b-blocks' ), value: 'flex-end' }
];

export const thumbPositionOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

export const buttonTypeOptions = [
	{ label: __( 'Text', 'b-blocks' ), value: 'text' },
	{ label: __( 'Icon', 'b-blocks' ), value: 'icon' },
	{ label: __( 'Icon & Text', 'b-blocks' ), value: 'both' }
];

export const alignOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];
