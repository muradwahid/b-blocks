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

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') }
];
export const revealTypes = [
	{ label: __('Auto', 'b-blocks'), value: '' },
	{ label: __('On click (show poster first)', 'b-blocks'), value: 'interaction' }
];
export const interactionPrompts = [
	{ label: __('Auto', 'b-blocks'), value: '' },
	{ label: __('When focused', 'b-blocks'), value: 'when-focused' },
	{ label: __('None', 'b-blocks'), value: 'none' }
];
export const environmentImages = [
	{ label: __('Default', 'b-blocks'), value: '' },
	{ label: __('Neutral', 'b-blocks'), value: 'neutral' },
	{ label: __('Custom', 'b-blocks'), value: 'custom' }
];
export const arModes = [
	{ label: __('WebXR', 'b-blocks'), value: '' },
	{ label: __('Scene Viewer', 'b-blocks'), value: 'scene-viewer' },
	{ label: __('Quick Look', 'b-blocks'), value: 'quick-look' }
];
export const arPlacements = [
	{ label: __('Floor', 'b-blocks'), value: '' },
	{ label: __('Wall', 'b-blocks'), value: 'wall' }
];