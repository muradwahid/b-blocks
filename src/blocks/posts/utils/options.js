import { __ } from '@wordpress/i18n';

import { gridIcon, masonryIcon, sliderNoColorIcon, tickerIcon } from './icons';

export const tabs = [
    { name: 'general', title: __('General', 'b-blocks') },
    { name: 'elements', title: __('Elements', 'b-blocks') },
    { name: 'style', title: __('Style', 'b-blocks') }
];
export const layouts = [
    { label: __('Grid', 'b-blocks'), value: 'grid', icon: gridIcon },
    { label: __('Masonry', 'b-blocks'), value: 'masonry', icon: masonryIcon },
    { label: __('Slider', 'b-blocks'), value: 'slider', icon: sliderNoColorIcon },
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
];
export const categoriesPosition = [
    { label: __('Content', 'b-blocks'), value: 'content' },
    { label: __('Image', 'b-blocks'), value: 'image' }
];
export const imageFittings = [
    { label: __('Cover', 'b-blocks'), value: 'cover' },
    { label: __('Contain', 'b-blocks'), value: 'contain' }
];