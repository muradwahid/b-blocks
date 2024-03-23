import { __ } from '@wordpress/i18n';

// eslint-disable-next-line no-unused-vars
import { grid1Icon, gridIcon, masonryIcon, sliderIcon, tickerIcon } from './icons';

export const layouts = [
	{ label: __('Grid', 'b-blocks'), value: 'grid', icon: gridIcon },
	{ label: __('Grid 1', 'b-blocks'), value: 'grid1', icon: grid1Icon },
	{ label: __('Masonry', 'b-blocks'), value: 'masonry', icon: masonryIcon },
	{ label: __('Slider', 'b-blocks'), value: 'slider', icon: sliderIcon },
	{ label: __('Ticker', 'b-blocks'), value: 'ticker', icon: tickerIcon }
];

export const subLayouts = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Title Meta', 'b-blocks'), value: 'title-meta' },
	{ label: __('Left Image', 'b-blocks'), value: 'left-image' },
	{ label: __('Right Image', 'b-blocks'), value: 'right-image' },
	{ label: __('Overlay Content', 'b-blocks'), value: 'overlay-content' },
	{ label: __('Overlay Content Hover', 'b-blocks'), value: 'overlay-content-hover' },
	{ label: __('Overlay Box', 'b-blocks'), value: 'overlay-box' },
	{ label: __('Overlay Content Box', 'b-blocks'), value: 'overlay-content-box' },
	{ label: __('Overlay Half Content', 'b-blocks'), value: 'overlay-half-content' }
];

export const contentHeights = [
	{ label: __('Auto', 'b-blocks'), value: 'auto' },
	{ label: __('Fill Available Space', 'b-blocks'), value: 'fill' }
];
export const categoriesPosition = [
	{ label: __('Content', 'b-blocks'), value: 'content' },
	{ label: __('Image', 'b-blocks'), value: 'image' }
];

export const effects = [
	{ label: __('Slide', 'b-blocks'), value: 'slide' },
	{ label: __('Fade', 'b-blocks'), value: 'fade' },
	{ label: __('Creative', 'b-blocks'), value: 'creative' }
];

export const tickerDirections = [
	{ label: __('Up', 'b-blocks'), value: 'up' },
	{ label: __('Down', 'b-blocks'), value: 'down' }
];

export const postsOrdersBy = [
	{ label: __('Author', 'b-blocks'), value: 'author' },
	{ label: __('Title', 'b-blocks'), value: 'title' },
	{ label: __('Date', 'b-blocks'), value: 'date' },
	{ label: __('Last Modified', 'b-blocks'), value: 'modified' },
];

export const postsOrders = [
	{ label: __('Ascending', 'b-blocks'), value: 'asc' },
	{ label: __('Descending', 'b-blocks'), value: 'desc' }
];

export const passFilters = [
	{ label: __('All Posts', 'b-blocks'), value: 'null' },
	{ label: __('Password Protected', 'b-blocks'), value: 'true' },
	{ label: __('Public', 'b-blocks'), value: 'false' }
];

export const imageFittings = [
	{ label: __('Cover', 'b-blocks'), value: 'cover' },
	{ label: __('Contain', 'b-blocks'), value: 'contain' }
];

export const aligns = [
	{ label: __('Left', 'b-blocks'), value: 'left', icon: 'editor-alignleft' },
	{ label: __('Center', 'b-blocks'), value: 'center', icon: 'editor-aligncenter' },
	{ label: __('Right', 'b-blocks'), value: 'right', icon: 'editor-alignright' },
	{ label: __('Justify', 'b-blocks'), value: 'justify', icon: 'editor-justify' }
];

export const dateFormats = [
	{ label: __('01/15/2022', 'b-blocks'), value: 'm/d/Y' },
	{ label: __('15/01/2022', 'b-blocks'), value: 'd/m/Y' },
	{ label: __('January 15, 2022', 'b-blocks'), value: 'F d, Y' },
	{ label: __('Jan 15, 2022', 'b-blocks'), value: 'M d, Y' },
	{ label: __('15th Jan, 2022', 'b-blocks'), value: 'dS M, Y' },
	{ label: __('15th January, 2022', 'b-blocks'), value: 'dS F, Y' },
	{ label: __('Custom', 'b-blocks'), value: 'custom' }
];
export const readMorePositions = [
	{ label: __('Auto', 'b-blocks'), value: 'auto' },
	{ label: __('Bottom', 'b-blocks'), value: 'bottom' }
];

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'elements', title: __('Elements', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') }
];