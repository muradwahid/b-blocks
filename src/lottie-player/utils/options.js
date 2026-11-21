import { __ } from '@wordpress/i18n';

export const modes = [
	{ label: __('Normal', 'b-blocks'), value: 'normal', icon: __('Normal', 'b-blocks') },
	{ label: __('Bounce', 'b-blocks'), value: 'bounce', icon: __('Bounce', 'b-blocks') }
];

export const directions = [
	{ label: __('Forward', 'b-blocks'), value: 1, icon: __('Forward', 'b-blocks') },
	{ label: __('Backward', 'b-blocks'), value: -1, icon: __('Backward', 'b-blocks') }
];

export const interactivities = [
	{ label: __('No Interactivity', 'b-blocks'), value: 'noInteractivity' },
	{ label: __('Sync with scroll', 'b-blocks'), value: 'syncWithScroll' },
	{ label: __('Scroll relative to container', 'b-blocks'), value: 'scrollRelativeToContainer' },
	{ label: __('Scroll with offset', 'b-blocks'), value: 'scrollWithOffset' },
	{ label: __('Sync animation with cursor position', 'b-blocks'), value: 'syncAnimationWithCursorPosition' },
	{ label: __('Sync animation with cursor horizontal movement', 'b-blocks'), value: 'syncAnimationWithCursorHorizontalMovement' },
	{ label: __('Play animation on click', 'b-blocks'), value: 'playAnimationOnClick' },
	// { label: __('Toggle animation', 'b-blocks'), value: 'toggleAnimation' },
	{ label: __('Play animation when visible', 'b-blocks'), value: 'playAnimationWhenVisible' },
];
export const interactivityModes = [
	{ label: __('Scroll', 'b-blocks'), value: 'scroll' },
	{ label: __('Cursor', 'b-blocks'), value: 'cursor' },
	{ label: __('Chain', 'b-blocks'), value: 'chain' }
];

export const interactivityTypes = [
	{ label: __('Seek', 'b-blocks'), value: 'seek' },
	{ label: __('Play', 'b-blocks'), value: 'play' },
	{ label: __('Stop', 'b-blocks'), value: 'stop' },
	{ label: __('Loop', 'b-blocks'), value: 'loop' }
];

export const renderers = [
	{ label: __('SVG', 'b-blocks'), value: '' },
	{ label: __('Canvas', 'b-blocks'), value: 'canvas' }
];
