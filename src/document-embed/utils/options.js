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

export const sourceOptions = [
	{ label: __('Media Library', 'b-blocks'), value: 'media' },
	{ label: __('URL', 'b-blocks'), value: 'url' },
	{ label: __('Google Drive', 'b-blocks'), value: 'googleDrive' },
	{ label: __('Dropbox', 'b-blocks'), value: 'dropbox' },
	{ label: __('Box', 'b-blocks'), value: 'box' }
];

export const engineOptions = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Custom PDF', 'b-blocks'), value: 'custom' },
	{ label: __('Flipbook', 'b-blocks'), value: 'flipbook' },
	{ label: __('Slider', 'b-blocks'), value: 'slider' }
];

export const flipStyleOptions = [
	{ label: __('3D (realistic page curl)', 'b-blocks'), value: '3d' },
	{ label: __('Soft (curling pages)', 'b-blocks'), value: 'soft' },
	{ label: __('Flat (rigid page turn)', 'b-blocks'), value: 'flat' }
];

export const zoomOptions = [
	{ label: __('Viewer default', 'b-blocks'), value: '' },
	{ label: __('Automatic', 'b-blocks'), value: 'auto' },
	{ label: __('Page fit', 'b-blocks'), value: 'page-fit' },
	{ label: __('Page width', 'b-blocks'), value: 'page-width' },
	{ label: '50%', value: '50' },
	{ label: '75%', value: '75' },
	{ label: '100%', value: '100' },
	{ label: '125%', value: '125' },
	{ label: '150%', value: '150' },
	{ label: '200%', value: '200' }
];

export const positionOptions = [
	{ label: __('Toolbar (above)', 'b-blocks'), value: 'toolbar' },
	{ label: __('Below embed', 'b-blocks'), value: 'below' }
];

export const themeOptions = [
	{ label: __('Dark', 'b-blocks'), value: 'dark' },
	{ label: __('Light', 'b-blocks'), value: 'light' },
	{ label: __('Custom', 'b-blocks'), value: 'custom' }
];

export const behaviorOptions = [
	{ label: __('Force save dialog', 'b-blocks'), value: 'download' },
	{ label: __('Open in new tab', 'b-blocks'), value: 'newtab' }
];

export const accessOptions = [
	{ label: __('Everyone', 'b-blocks'), value: 'everyone' },
	{ label: __('Logged in users', 'b-blocks'), value: 'loggedin' },
	{ label: __('Specific roles', 'b-blocks'), value: 'roles' }
];

export const triggerOptions = [
	{ label: __('Button', 'b-blocks'), value: 'button' },
	{ label: __('Image', 'b-blocks'), value: 'image' },
	{ label: __('Element on the page (CSS selector)', 'b-blocks'), value: 'selector' }
];

export const sizeOptions = [
	{ label: __('Small', 'b-blocks'), value: 'small' },
	{ label: __('Medium', 'b-blocks'), value: 'medium' },
	{ label: __('Large', 'b-blocks'), value: 'large' }
];

export const fitOptions = [
	{ label: __('Cover', 'b-blocks'), value: 'cover' },
	{ label: __('Contain', 'b-blocks'), value: 'contain' },
	{ label: __('Fill', 'b-blocks'), value: 'fill' }
];

// Default follows the reading direction (left on English sites, right on Arabic or Hebrew ones).
export const alignOptions = [
	{ label: __('Default (start of line)', 'b-blocks'), value: '' },
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const aspectOptions = [
	{ label: __('Fixed height', 'b-blocks'), value: '' },
	{ label: __('A4 portrait (1 : 1.41)', 'b-blocks'), value: '1 / 1.4142' },
	{ label: __('US Letter portrait (8.5 : 11)', 'b-blocks'), value: '8.5 / 11' },
	{ label: __('A4 landscape (1.41 : 1)', 'b-blocks'), value: '1.4142 / 1' },
	{ label: '16 : 9', value: '16 / 9' },
	{ label: '4 : 3', value: '4 / 3' },
	{ label: '1 : 1', value: '1 / 1' }
];

export const pageModeOptions = [
	{ label: __('Automatic (double on wide screens)', 'b-blocks'), value: 'auto' },
	{ label: __('Single page', 'b-blocks'), value: 'single' },
	{ label: __('Double page', 'b-blocks'), value: 'double' }
];

export const overlayTypeOptions = [
	{ label: __('Note', 'b-blocks'), value: 'note' },
	{ label: __('Highlight', 'b-blocks'), value: 'highlight' },
	{ label: __('Link area', 'b-blocks'), value: 'link' },
	{ label: __('Call to action button', 'b-blocks'), value: 'cta' }
];

export const sizeUnits = [
	{ label: '%', value: '%' },
	{ label: 'px', value: 'px' },
	{ label: 'vw', value: 'vw' },
	{ label: 'vh', value: 'vh' }
];

export const documentTypes = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/vnd.oasis.opendocument.text',
	'application/vnd.oasis.opendocument.spreadsheet',
	'application/vnd.oasis.opendocument.presentation',
	'text/plain',
	'text/csv',
	'application/rtf'
];
