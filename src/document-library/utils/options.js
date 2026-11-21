import { __ } from '@wordpress/i18n';

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') }
];

export const stateOptions = [
	{ label: __('Normal', 'b-blocks'), value: 'normal' },
	{ label: __('Hover', 'b-blocks'), value: 'hover' }
];

// Page numbers: as they rest, hovered, and the page being shown.
export const pageStateOptions = [
	{ label: __('Normal', 'b-blocks'), value: 'normal' },
	{ label: __('Hover', 'b-blocks'), value: 'hover' },
	{ label: __('Active', 'b-blocks'), value: 'active' }
];

// The search field and selects: as they rest, and while typed in or open.
export const focusStateOptions = [
	{ label: __('Normal', 'b-blocks'), value: 'normal' },
	{ label: __('Focus', 'b-blocks'), value: 'focus' }
];

export const templateOptions = [
	{ label: __('Grid', 'b-blocks'), value: 'grid' },
	{ label: __('List', 'b-blocks'), value: 'list' }
];

export const densityOptions = [
	{ label: __('Comfortable', 'b-blocks'), value: 'comfortable' },
	{ label: __('Compact', 'b-blocks'), value: 'compact' }
];

// Default follows the reading direction (left on English sites, right on Arabic or Hebrew ones).
export const alignOptions = [
	{ label: __('Default (start of line)', 'b-blocks'), value: '' },
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const presetOptions = [
	{ label: __('Ink', 'b-blocks'), value: 'ink' },
	{ label: __('Teal', 'b-blocks'), value: 'teal' },
	{ label: __('Lime', 'b-blocks'), value: 'lime' },
	{ label: __('Paper', 'b-blocks'), value: 'paper' },
	{ label: __('None', 'b-blocks'), value: 'none' }
];

export const viewerOptions = [
	{ label: __('Default (Google / Office viewer)', 'b-blocks'), value: 'default' },
	{ label: __('Built-in PDF viewer for PDFs on this site', 'b-blocks'), value: 'custom' }
];

export const pxUnits = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' }
];

export const pagingOptions = [
	{ label: __('Load more button', 'b-blocks'), value: 'loadMore' },
	{ label: __('Page numbers', 'b-blocks'), value: 'numbers' }
];


export const viewActionOptions = [
	{ label: __('Open in a popup', 'b-blocks'), value: 'modal' },
	{ label: __('Open the file in a new tab', 'b-blocks'), value: 'newtab' }
];

export const filterByOptions = [
	{ label: __('File type', 'b-blocks'), value: 'type' },
	{ label: __('Categories given to the documents', 'b-blocks'), value: 'category' }
];

export const titleTagOptions = ['h2', 'h3', 'h4', 'h5', 'h6', 'p'].map((tag) => ({ label: tag.toUpperCase(), value: tag }));

// Initial order in the sidebar (the values are sortValues in utils/common.js).
export const sortOptions = [
	{ label: __('As arranged in the list', 'b-blocks'), value: 'default' },
	{ label: __('Name (A → Z)', 'b-blocks'), value: 'name-asc' },
	{ label: __('Name (Z → A)', 'b-blocks'), value: 'name-desc' },
	{ label: __('Date (Newest)', 'b-blocks'), value: 'date-desc' },
	{ label: __('Date (Oldest)', 'b-blocks'), value: 'date-asc' },
	{ label: __('Size (Largest)', 'b-blocks'), value: 'size-desc' },
	{ label: __('Size (Smallest)', 'b-blocks'), value: 'size-asc' }
];
