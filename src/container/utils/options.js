import { __ } from '@wordpress/i18n';

import { alignBaselineIcon, alignCenterIcon, alignEndIcon, alignStartIcon, alignStretchIcon, justifyCenterIcon, justifyEndIcon, justifySpaceAroundIcon, justifySpaceBetweenIcon, justifySpaceEvenlyIcon, justifyStartIcon, noWrapIcon, wrapIcon, wrapReverseIcon } from './icons';

export const heights = [
	{ value: 'initial', label: 'Auto' },
	{ value: 1, label: 'Full' }
];

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

// Items Layout: the blocks inside the container. An empty value keeps what the larger screen has (desktop: the
// container as it always was).
export const itemsDirectionOptions = [
	{ value: 'row', label: __('Row', 'b-blocks'), icon: 'arrow-right-alt' },
	{ value: 'column', label: __('Column', 'b-blocks'), icon: 'arrow-down-alt' },
	{ value: 'row-reverse', label: __('Row reverse', 'b-blocks'), icon: 'arrow-left-alt' },
	{ value: 'column-reverse', label: __('Column reverse', 'b-blocks'), icon: 'arrow-up-alt' }
];

// Click the selected one again to go back to the default.
export const itemsJustifyOptions = [
	{ value: 'flex-start', label: __('Start', 'b-blocks'), icon: justifyStartIcon },
	{ value: 'center', label: __('Center', 'b-blocks'), icon: justifyCenterIcon },
	{ value: 'flex-end', label: __('End', 'b-blocks'), icon: justifyEndIcon },
	{ value: 'space-between', label: __('Space between', 'b-blocks'), icon: justifySpaceBetweenIcon },
	{ value: 'space-around', label: __('Space around', 'b-blocks'), icon: justifySpaceAroundIcon },
	{ value: 'space-evenly', label: __('Space evenly', 'b-blocks'), icon: justifySpaceEvenlyIcon }
];

export const itemsAlignOptions = [
	{ value: 'flex-start', label: __('Start', 'b-blocks'), icon: alignStartIcon },
	{ value: 'center', label: __('Center', 'b-blocks'), icon: alignCenterIcon },
	{ value: 'flex-end', label: __('End', 'b-blocks'), icon: alignEndIcon },
	{ value: 'stretch', label: __('Stretch', 'b-blocks'), icon: alignStretchIcon },
	{ value: 'baseline', label: __('Baseline', 'b-blocks'), icon: alignBaselineIcon }
];

export const itemsWrapOptions = [
	{ value: 'nowrap', label: __('No wrap', 'b-blocks'), icon: noWrapIcon },
	{ value: 'wrap', label: __('Wrap', 'b-blocks'), icon: wrapIcon },
	{ value: 'wrap-reverse', label: __('Wrap reverse', 'b-blocks'), icon: wrapReverseIcon }
];

export const shapeTabs = [
	{ name: 'top', title: __('Top', 'b-blocks') },
	{ name: 'bottom', title: __('Bottom', 'b-blocks') }
];

export const enabledAdvOptions = {
	dimension: ['padding', 'margin', 'width', 'minWidth', 'maxWidth','minHeight','height'],
	transform: true,
	background: ['normal', 'hover', 'overlay'],
	borderShadow: ['normal', 'hover', 'border', 'shadow'],
	mask: true,
	animation: true,
	visibility: ['zIndex', 'overflow'],
	responsive: true,
	css: true
}