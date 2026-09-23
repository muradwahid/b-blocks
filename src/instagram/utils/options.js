import { __ } from '@wordpress/i18n';

import { hashtagURL, prefix } from './data';

export const allTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') }
];

export const normalHoverTabs = [
	{ name: 'normal', title: __('Normal', 'b-blocks') },
	{ name: 'hover', title: __('Hover', 'b-blocks') }
];

export const hoverEffects = [
	{ label: __('None', 'b-blocks'), value: 'none' },
	{ label: __('Zoom In', 'b-blocks'), value: 'zoom-in' },
	{ label: __('Zoom Out', 'b-blocks'), value: 'zoom-out' },
	{ label: __('Rotate', 'b-blocks'), value: 'rotate' },
	{ label: __('Grayscale', 'b-blocks'), value: 'grayscale' },
	{ label: __('Blur', 'b-blocks'), value: 'blur' },
	{ label: __('Lift', 'b-blocks'), value: 'lift' },
	{ label: __('Shine', 'b-blocks'), value: 'shine' }
];

export const captionStyles = [
	{ label: __('Overlay Top', 'b-blocks'), value: 'overlay-top' },
	{ label: __('Overlay Center', 'b-blocks'), value: 'overlay-center' },
	{ label: __('Overlay Bottom', 'b-blocks'), value: 'overlay-bottom' },
	{ label: __('Below Image', 'b-blocks'), value: 'below' }
];

export const alignments = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const ratios = [
	{ label: __('Square', 'b-blocks'), value: '1/1' },
	{ label: __('Portrait', 'b-blocks'), value: '4/5' },
	{ label: __('Landscape', 'b-blocks'), value: '16/9' },
	{ label: __('Original', 'b-blocks'), value: 'auto' }
];

export const stateLabel = (state, label) => 'normal' === state ? label : `${state.charAt(0).toUpperCase()}${state.slice(1)} ${label.charAt(0).toLowerCase()}${label.slice(1)}`;

/**
 * Reads `group[device][key]` with the usual cascade: tablet falls back to
 * desktop, mobile to tablet, so only differing breakpoints need a value.
 */
export const resolveDevice = (group = {}, device, key, fallback = '') => {
	const read = (dev) => {
		const val = group?.[dev]?.[key];

		return undefined === val || null === val || '' === val ? undefined : val;
	};

	const desktop = read('desktop') ?? fallback;

	if ('desktop' === device) return desktop;

	const tablet = read('tablet') ?? desktop;

	if ('tablet' === device) return tablet;

	return read('mobile') ?? tablet;
};

/** Sizes carry their unit ('15px'). A bare number is read as px. */
export const withUnit = (value, fallback = '') => {
	if (null === value || undefined === value || '' === value) return fallback;

	const number = parseFloat(value);

	if (isNaN(number)) return fallback;

	return /[a-z%]$/i.test(String(value).trim()) ? String(value).trim() : `${number}px`;
};

/** Instagram returns the whole caption; the block shows as much as it is told to. */
export const trimCaption = (text = '', { stripHashtags = false, captionLength = 0 } = {}) => {
	let out = String(text || '');

	if (stripHashtags) out = out.replace(/#[\p{L}\p{N}_]+/gu, '').replace(/\s{2,}/g, ' ').trim();

	const limit = parseInt(captionLength, 10) || 0;

	return 0 < limit && out.length > limit ? `${out.slice(0, limit).trimEnd()}…` : out;
};

/**
 * Captions are rendered as React nodes rather than injected HTML, so a caption
 * can never bring markup of its own onto the page. Hashtags become real links.
 */
export const captionNodes = (text = '', linkHashtags = true) => {
	const parts = String(text || '').split(/(#[\p{L}\p{N}_]+)/gu);

	return parts.filter((part) => '' !== part).map((part, index) => {
		const tag = linkHashtags && /^#[\p{L}\p{N}_]+$/u.test(part) ? part.slice(1) : '';

		return tag
			? <a key={index} className={`${prefix}-tag`} href={hashtagURL(tag)} target='_blank' rel='noreferrer nofollow noopener'>{part}</a>
			: <span key={index}>{part}</span>;
	});
};

/** A carousel post has children; a video has a poster. Both need the still. */
export const mediaThumb = (item = {}) => item.thumbnail_url || item.media_url || '';

export const getWrapperClasses = (attributes) => {
	const { elements = {}, item = {}, caption = {} } = attributes;

	return [
		prefix,
		`${prefix}-hover-${item.hoverEffect || 'none'}`,
		`${prefix}-caption-${caption.style || 'overlay-center'}`,
		caption.onHover && 'below' !== caption.style ? `${prefix}-caption-on-hover` : '',
		elements.caption ? `${prefix}-has-caption` : '',
		elements.profile ? `${prefix}-has-profile` : ''
	].filter(Boolean).join(' ');
};
