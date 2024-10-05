import { __ } from '@wordpress/i18n';

export const actionTypes = [
	{ label: __('Link', 'b-blocks'), value: 'link' },
	{ label: __('Popup', 'b-blocks'), value: 'popup' }
];
export const securities = [
	{ label: __('None', 'b-blocks'), value: 'none' },
	{ label: __('Password Protected', 'b-blocks'), value: 'password' },
	{ label: __('Login Protected', 'b-blocks'), value: 'login' },
];

export const rels = [
	{ label: __('Alternate', 'b-blocks'), value: 'alternate' },
	{ label: __('Author', 'b-blocks'), value: 'author' },
	{ label: __('Bookmark', 'b-blocks'), value: 'bookmark' },
	{ label: __('External', 'b-blocks'), value: 'external' },
	{ label: __('Help', 'b-blocks'), value: 'help' },
	{ label: __('License', 'b-blocks'), value: 'license' },
	{ label: __('Next', 'b-blocks'), value: 'next' },
	{ label: __('No Follow', 'b-blocks'), value: 'nofollow' },
	{ label: __('No Opener', 'b-blocks'), value: 'noopener' },
	{ label: __('No Referrer', 'b-blocks'), value: 'noreferrer' },
	{ label: __('Prev', 'b-blocks'), value: 'prev' },
	{ label: __('Search', 'b-blocks'), value: 'search' },
	{ label: __('Tag', 'b-blocks'), value: 'tag' }
];

export const referrerPolicies = [
	{ label: __('No Referrer', 'b-blocks'), value: 'no-referrer' },
	{ label: __('No Referrer When Downgrade', 'b-blocks'), value: 'no-referrer-when-downgrade' },
	{ label: __('Origin', 'b-blocks'), value: 'origin' },
	{ label: __('Origin When Cross Origin', 'b-blocks'), value: 'origin-when-cross-origin' },
	{ label: __('Same Origin', 'b-blocks'), value: 'same-origin' },
	{ label: __('Strict Origin When Cross Origin', 'b-blocks'), value: 'strict-origin-when-cross-origin' },
	{ label: __('Unsafe Url', 'b-blocks'), value: 'unsafe-url' }
];

export const xyPositions = [
	{ label: __('Top', 'b-blocks'), value: 'top' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
	{ label: __('Bottom', 'b-blocks'), value: 'bottom' },
	{ label: __('Left', 'b-blocks'), value: 'left' }
];

export const xPositions = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

export const buttonTypes = [
	{ label: __('Flat', 'b-blocks'), value: 'flat', icon: 'Flat' },
	{ label: __('3D', 'b-blocks'), value: '3d', icon: '3D' }
];

export const buttonSizes = [
	{ label: __('Small', 'b-blocks'), value: 'small' },
	{ label: __('Medium', 'b-blocks'), value: 'medium' },
	{ label: __('Large', 'b-blocks'), value: 'large' },
	{ label: __('X Large', 'b-blocks'), value: 'x-large' },
];

export const animationTypes = [
	{ label: __('None', 'b-blocks'), value: '' },
	{ label: __('Fade', 'b-blocks'), value: 'fade' },
	{ label: __('Fade Up', 'b-blocks'), value: 'fade-up' },
	{ label: __('Fade Down', 'b-blocks'), value: 'fade-down' },
	{ label: __('Fade Left', 'b-blocks'), value: 'fade-left' },
	{ label: __('Fade Right', 'b-blocks'), value: 'fade-right' },
	{ label: __('Flip Up', 'b-blocks'), value: 'flip-up' },
	{ label: __('Flip Down', 'b-blocks'), value: 'flip-down' },
	{ label: __('Flip Left', 'b-blocks'), value: 'flip-left' },
	{ label: __('Flip Right', 'b-blocks'), value: 'flip-right' },
	{ label: __('Zoom In', 'b-blocks'), value: 'zoom-in' },
	{ label: __('Zoom In Up', 'b-blocks'), value: 'zoom-in-up' },
	{ label: __('Zoom In Down', 'b-blocks'), value: 'zoom-in-down' },
	{ label: __('Zoom In Left', 'b-blocks'), value: 'zoom-in-left' },
	{ label: __('Zoom In Right', 'b-blocks'), value: 'zoom-in-right' }
];

export const contentTypes = [
	{ label: __('Image', 'b-blocks'), value: 'image' },
	{ label: __('Audio', 'b-blocks'), value: 'audio' },
	{ label: __('Video', 'b-blocks'), value: 'video' },
	{ label: __('Content', 'b-blocks'), value: 'content' },
	{ label: __('Document', 'b-blocks'), value: 'document' },
	{ label: __('Iframe', 'b-blocks'), value: 'iframe' },
];

export const tabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'popup', title: __('Popup', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') }
];