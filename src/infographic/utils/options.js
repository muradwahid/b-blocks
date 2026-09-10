import { __ } from '@wordpress/i18n';

import { normalHoverTabs } from '../../utils/options';

import { prefix } from './data';
import { CenterIcon, LeftIcon, RightIcon } from './icons';

export const alignOptions = [
	{ label: __('Left', 'b-blocks'), value: 'left', icon: LeftIcon },
	{ label: __('Center', 'b-blocks'), value: 'center', icon: CenterIcon },
	{ label: __('Right', 'b-blocks'), value: 'right', icon: RightIcon }
];

export const triggerOptions = [
	{ label: __('Click', 'b-blocks'), value: 'click' },
	{ label: __('Hover', 'b-blocks'), value: 'hover' }
];

export const imagePositions = [
	{ label: __('Top', 'b-blocks'), value: 'top' },
	{ label: __('Bottom', 'b-blocks'), value: 'bottom' }
];

export const iconViews = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Stacked', 'b-blocks'), value: 'stacked' },
	{ label: __('Framed', 'b-blocks'), value: 'framed' }
];

export const iconShapes = [
	{ label: __('Circle', 'b-blocks'), value: 'circle' },
	{ label: __('Square', 'b-blocks'), value: 'square' },
	{ label: __('Rounded', 'b-blocks'), value: 'rounded' }
];

export const ringStyles = [
	{ label: __('Solid', 'b-blocks'), value: 'solid' },
	{ label: __('Dashed', 'b-blocks'), value: 'dashed' },
	{ label: __('Dotted', 'b-blocks'), value: 'dotted' },
	{ label: __('Double', 'b-blocks'), value: 'double' }
];

export const segmentShapes = [
	{ label: __('Circle', 'b-blocks'), value: 'circle' },
	{ label: __('Square', 'b-blocks'), value: 'square' },
	{ label: __('Rounded', 'b-blocks'), value: 'rounded' }
];

export const iconPositions = [
	{ label: __('Top', 'b-blocks'), value: 'top' },
	{ label: __('Bottom', 'b-blocks'), value: 'bottom' },
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const directions = [
	{ label: __('Clockwise', 'b-blocks'), value: 'clockwise' },
	{ label: __('Anti-clockwise', 'b-blocks'), value: 'anticlockwise' }
];

// The last three overshoot their end value, giving a springy settle no keyword
// can express.
export const easings = [
	{ label: __('Ease', 'b-blocks'), value: 'ease' },
	{ label: __('Linear', 'b-blocks'), value: 'linear' },
	{ label: __('Ease In', 'b-blocks'), value: 'ease-in' },
	{ label: __('Ease Out', 'b-blocks'), value: 'ease-out' },
	{ label: __('Ease In Out', 'b-blocks'), value: 'ease-in-out' },
	{ label: __('Back Out', 'b-blocks'), value: 'back-out' },
	{ label: __('Back In Out', 'b-blocks'), value: 'back-in-out' },
	{ label: __('Elastic', 'b-blocks'), value: 'elastic' }
];

const EASING_CURVES = {
	'back-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
	'back-in-out': 'cubic-bezier(0.68, -0.55, 0.27, 1.55)',
	elastic: 'cubic-bezier(0.5, -0.6, 0.35, 1.7)'
};

export const easingCSS = (easing = 'ease') => EASING_CURVES[easing] || easing || 'ease';

export const dividerStyles = [
	{ label: __('Solid', 'b-blocks'), value: 'solid' },
	{ label: __('Dashed', 'b-blocks'), value: 'dashed' },
	{ label: __('Dotted', 'b-blocks'), value: 'dotted' },
	{ label: __('Double', 'b-blocks'), value: 'double' }
];

export const imageFits = [
	{ label: __('Cover', 'b-blocks'), value: 'cover' },
	{ label: __('Contain', 'b-blocks'), value: 'contain' }
];

/**
 * Transitions the listed properties only. `all` would catch the segment's
 * transform, which is its position on the ring, so every resize would slide.
 */
export const transitionCSS = (value, properties = []) => {
	const ms = toMs(value, 0);

	return 0 < ms ? `transition: ${properties.map((property) => `${property} ${ms}ms ease`).join(', ')};` : '';
};

export const stateTabs = [
	{ name: 'normal', title: __('Normal', 'b-blocks') },
	{ name: 'hover', title: __('Hover', 'b-blocks') },
	{ name: 'active', title: __('Active', 'b-blocks') }
];

export const TITLE_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'p', 'span'];

export const titleTagOptions = TITLE_TAGS.map((tag) => ({ label: tag.toUpperCase(), value: tag }));

/** Prefixes a label with its state, so a value's owner stays clear across tabs. */
export const stateLabel = (state, label) => {
	if ('normal' === state) return label;

	const title = [...stateTabs, ...normalHoverTabs].find((tab) => tab.name === state)?.title;

	return title ? `${title} ${label}` : label;
};

export const contentStyleTabs = [
	{ name: 'content', title: __('Content', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') }
];

export const iconTypes = [
	{ label: __('Icon', 'b-blocks'), value: 'icon' },
	{ label: __('Image', 'b-blocks'), value: 'image' }
];

export const animationTypes = [
	{ label: __('Spread', 'b-blocks'), value: 'spread' },
	{ label: __('Fade In', 'b-blocks'), value: 'fade' },
	{ label: __('Zoom In', 'b-blocks'), value: 'zoom' },
	{ label: __('Spin In', 'b-blocks'), value: 'spin' },
	{ label: __('Drop In', 'b-blocks'), value: 'drop' },
	{ label: __('Bounce In', 'b-blocks'), value: 'bounce' },
	{ label: __('Flip In', 'b-blocks'), value: 'flip' },
	{ label: __('Blur In', 'b-blocks'), value: 'blur' },
	{ label: __('Swing In', 'b-blocks'), value: 'swing' },
	{ label: __('Roll In', 'b-blocks'), value: 'roll' },
	{ label: __('Unfold', 'b-blocks'), value: 'unfold' }
];

// A clip-path holds wedges in place, so transform keyframes cannot move them.
// Opacity and filter still work.
const WEDGE_SAFE_ANIMATIONS = ['fade', 'blur'];

export const isWedgeSafeAnimation = (type) => WEDGE_SAFE_ANIMATIONS.includes(type);

export const getAnimationTypes = (isSegments) => isSegments ? animationTypes.filter(({ value }) => isWedgeSafeAnimation(value)) : animationTypes;

// Rotation layers behind the entrance, so it needs that keyframe by name.
export const ENTRANCE_KEYFRAMES = {
	spread: 'bBlocksInfographicSpread',
	fade: 'bBlocksInfographicFade',
	zoom: 'bBlocksInfographicZoom',
	spin: 'bBlocksInfographicSpin',
	drop: 'bBlocksInfographicDrop',
	bounce: 'bBlocksInfographicBounce',
	flip: 'bBlocksInfographicFlip',
	blur: 'bBlocksInfographicBlur',
	swing: 'bBlocksInfographicSwing',
	roll: 'bBlocksInfographicRoll',
	unfold: 'bBlocksInfographicUnfold'
};

// 'scrollRepeat' differs only in keeping the observer watching after the first
// pass, so it re-arms on every re-entry.
export const animationTriggers = [
	{ label: __('On page load', 'b-blocks'), value: 'load' },
	{ label: __('When scrolled into view', 'b-blocks'), value: 'scroll' },
	{ label: __('Every time it scrolls into view', 'b-blocks'), value: 'scrollRepeat' }
];

export const isScrollTriggered = (trigger) => 'scroll' === trigger || 'scrollRepeat' === trigger;

export const staggerOrders = [
	{ label: __('Clockwise', 'b-blocks'), value: 'clockwise' },
	{ label: __('Anti-clockwise', 'b-blocks'), value: 'anticlockwise' },
	{ label: __('From Top Both Ways', 'b-blocks'), value: 'fromTop' },
	{ label: __('From Bottom Both Ways', 'b-blocks'), value: 'fromBottom' },
	{ label: __('Random', 'b-blocks'), value: 'random' }
];

export const contentAnimations = [
	{ label: __('None', 'b-blocks'), value: 'none' },
	{ label: __('Fade', 'b-blocks'), value: 'fade' },
	{ label: __('Slide Up', 'b-blocks'), value: 'slide-up' },
	{ label: __('Slide Sideways', 'b-blocks'), value: 'slide-side' },
	{ label: __('Zoom', 'b-blocks'), value: 'zoom' },
	{ label: __('Flip', 'b-blocks'), value: 'flip' }
];

export const hoverMotions = [
	{ label: __('None', 'b-blocks'), value: 'none' },
	{ label: __('Grow', 'b-blocks'), value: 'grow' },
	{ label: __('Lift', 'b-blocks'), value: 'lift' },
	{ label: __('Pulse', 'b-blocks'), value: 'pulse' },
	{ label: __('Wobble', 'b-blocks'), value: 'wobble' },
	{ label: __('Rotate', 'b-blocks'), value: 'rotate' }
];

// Hashed from the index, not random, so the shuffle is identical in the editor
// and after hydration.
const shuffleKey = (index) => {
	let hash = ((index + 1) * 2654435761) % 4294967296;

	hash ^= hash >>> 15;

	return hash;
};

/** Each segment's place in the queue. Only the delay multiplier changes. */
export const getStaggerOrder = (count, order = 'clockwise') => {
	const positions = Array.from({ length: count }, (unused, index) => index);

	if ('anticlockwise' === order) return positions.map((index) => count - 1 - index);

	// Distance from 12 o'clock the short way round, so both sides arrive in step.
	if ('fromTop' === order) return positions.map((index) => Math.min(index, count - index));

	if ('fromBottom' === order) return positions.map((index) => Math.ceil(count / 2) - Math.min(index, count - index));

	if ('random' === order) {
		const shuffled = [...positions].sort((a, b) => shuffleKey(a) - shuffleKey(b));

		return positions.map((index) => shuffled.indexOf(index));
	}

	return positions;
};

export const msUnit = (def = 0) => ({ value: 'ms', label: 'ms', default: def });
export const sUnit = (def = 0) => ({ value: 's', label: 's', default: def });

/** '0.5s' and '500ms' have to agree in milliseconds for the stagger maths. */
export const toMs = (value, fallback = 500) => {
	const number = parseFloat(value);

	if (isNaN(number)) return fallback;

	const text = String(value).trim();

	return /s$/i.test(text) && !/ms$/i.test(text) ? number * 1000 : number;
};

/**
 * Reads `group[device][key]` with the usual cascade: tablet falls back to
 * desktop, mobile to tablet, so only differing breakpoints need a value.
 */
export const resolveDevice = (group = {}, device, key, fallback) => {
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

/** Sizes carry their unit ('118px'). A bare number is read as px. */
export const withUnit = (value, fallback = '0px') => {
	if (null === value || undefined === value || '' === value) return fallback;

	const number = parseFloat(value);

	if (isNaN(number)) return fallback;

	return /[a-z%]$/i.test(String(value).trim()) ? String(value).trim() : `${number}px`;
};

// Mirrors block.json, so the render can fall back when a saved disc lacks a key.
export const RING_DEFAULTS = {
	innerColor: '#3F8F4B',
	innerWidth: '2px',
	outerColor: '#7E57C2',
	outerWidth: '2px'
};

export const MIN_SEGMENT_SIZE = 40;

/**
 * The ring's stroke centre line, as CSS so the border keeps its own unit. Measured
 * from the padding box that positioned children sit against: the disc is
 * content-box, so its border falls outside the declared size.
 */
export const segmentRadius = (boxSize, borderWidth) => `calc(${boxSize / 2}px + ${withUnit(borderWidth)} / 2)`;

/** Segments ride the ring, so half sits outside by design. A sanity ceiling only. */
export const maxSegmentSize = (circle) => Math.max(Math.floor(circle / 2), MIN_SEGMENT_SIZE);

export const degUnit = (def = 0) => ({ value: 'deg', label: 'deg', default: def });

/**
 * Disabled items leave the ring rather than leaving a gap. The original index
 * rides along, because the per-item CSS keys on it.
 */
export const getVisibleItems = (items = []) => items
	.map((item, index) => ({ item, index }))
	.filter(({ item }) => false !== item?.enable);

/** Evenly spaced from the start angle. `position` counts visible items only. */
export const autoSegmentAngle = (position, count, wheel = {}) => {
	if (0 >= count) return 0;

	const start = parseFloat(wheel.startAngle) || 0;
	const direction = 'anticlockwise' === wheel.direction ? -1 : 1;
	const sweep = Math.min(Math.abs(parseFloat(wheel.sweep ?? 360)) || 360, 360);

	// A full circle divides by the count, so the last item clears the first. An
	// arc divides by the gaps, pinning the first and last to its two ends.
	const step = 360 <= sweep ? sweep / count : sweep / Math.max(count - 1, 1);

	return start + position * step * direction;
};

/** Degrees clockwise from 12 o'clock. An item with its own `position` is pinned. */
export const getSegmentAngle = (item, position, count, wheel = {}) => {
	const pinned = parseFloat(item?.position);

	return isNaN(pinned) ? autoSegmentAngle(position, count, wheel) : pinned;
};

const getSegmentAngles = (items = [], wheel = {}) => getVisibleItems(items)
	.map(({ item, index }, position, all) => ({ index, angle: getSegmentAngle(item, position, all.length, wheel) }));



/**
 * One wedge per item, cut at the midpoints between neighbours so the wedges
 * still line up when an item is pinned.
 */
export const getSegmentWedges = (items = [], wheel = {}) => {
	const gap = Math.max(parseFloat(wheel.wedgeGap ?? 3) || 0, 0);
	const placed = getSegmentAngles(items, wheel).map(({ index, angle }) => ({ index, angle: ((angle % 360) + 360) % 360 }));
	const count = placed.length;

	if (!count) return [];

	const order = [...placed].sort((a, b) => a.angle - b.angle);

	const gapBefore = (k) => {
		if (1 === count) return 360;

		const diff = order[k].angle - order[(k - 1 + count) % count].angle;

		return 0 >= diff ? diff + 360 : diff;
	};

	const edges = order.map((cur, k) => cur.angle - gapBefore(k) / 2);

	const wedges = [];

	order.forEach((cur, k) => {
		let span = edges[(k + 1) % count] - edges[k];
		while (0 >= span) span += 360;

		wedges[cur.index] = {
			index: cur.index,
			start: edges[k] + gap / 2,
			span: Math.max(span - gap, 0),
			// The bisector — where the icon and label sit.
			mid: edges[k] + span / 2
		};
	});

	return wedges;
};

/**
 * A wedge as a clip-path. A polygon keeps the painted and clickable areas the
 * same shape; a gradient on a full circle would swallow clicks across the disc.
 */
export const wedgeClipPath = ({ start, span }) => {
	if (0 >= span) return 'none';

	const steps = Math.max(Math.ceil(span / 4), 2);
	const points = ['50% 50%'];

	for (let i = 0; i <= steps; i++) {
		const radians = ((start + (span * i) / steps) * Math.PI) / 180;

		points.push(`${(50 + 50 * Math.sin(radians)).toFixed(2)}% ${(50 - 50 * Math.cos(radians)).toFixed(2)}%`);
	}

	return `polygon(${points.join(', ')})`;
};

export const getActiveItem = (items = [], activeId) => items.find((item) => item?.id === activeId) || null;

export const getDefaultItemId = (items = [], defaultItem) => {
	const matched = items.find((item) => item?.buttonLabel === defaultItem);

	return (matched || items[0])?.id || '';
};

/**
 * The entrance that actually runs. Segments mode narrows the list rather than
 * emptying it, and a type it cannot use falls back instead of sitting inert.
 */
export const getActiveAnimation = (animation = {}, wheel = {}) => {
	const { type = 'spread' } = animation;
	// A type with no keyframe leaves the segments at opacity 0 — invisible, not
	// merely static — so anything unrecognised falls back.
	const known = ENTRANCE_KEYFRAMES[type] ? type : 'spread';

	if (!animation.enable) return '';

	if (!wheel.enableSegmentsType) return known;

	return isWedgeSafeAnimation(known) ? known : 'fade';
};

export const getWrapperClasses = (attributes, custom = {}) => {
	const { general = {}, wheel = {}, animation = {}, icon = {}, segment = {} } = attributes;

	const type = getActiveAnimation(animation, wheel);
	// Parked until the block is on screen, so it does not finish playing before
	// anyone scrolls to it.
	const armed = animation.enable && (!isScrollTriggered(animation.trigger) || custom.inView);
	// A layer on top of the entrance rather than an entrance itself, so it
	// composes with every type. Wedges cannot travel.
	const rotating = armed && !wheel.enableSegmentsType && animation.rotate;

	return [
		prefix,
		`b-blocks-infographic-trigger-${'hover' === general.itemTriggerType ? 'hover' : 'click'}`,
		`b-blocks-infographic-icon-view-${icon.view || 'default'}`,
		`b-blocks-infographic-icon-shape-${icon.shape || 'circle'}`,
		`b-blocks-infographic-segment-shape-${segment.shape || 'circle'}`,
		`b-blocks-infographic-icon-pos-${icon.position || 'top'}`,
		wheel.enableSegmentsType ? 'b-blocks-infographic-has-segments' : '',
		animation.enable && isScrollTriggered(animation.trigger) && !custom.inView ? 'b-blocks-infographic-awaiting-view' : '',
		armed ? 'b-blocks-infographic-has-animation' : '',
		armed ? `b-blocks-infographic-anim-${type}` : '',
		rotating ? 'b-blocks-infographic-has-rotation' : '',
		rotating && 'anticlockwise' === animation.rotateDirection ? 'b-blocks-infographic-rotate-reverse' : '',
		rotating && animation.pauseOnHover ? 'b-blocks-infographic-pause-on-hover' : '',
		// Under the same master switch as the entrance, whose panel they share.
		animation.enable && animation.hoverMotion && 'none' !== animation.hoverMotion ? `b-blocks-infographic-hover-motion-${animation.hoverMotion}` : '',
		animation.enable && animation.activePulse ? 'b-blocks-infographic-has-active-pulse' : '',
		animation.enable && animation.contentType && 'none' !== animation.contentType ? `b-blocks-infographic-content-anim-${animation.contentType}` : ''
	].filter(Boolean).join(' ');
};

export const newItem = (items = []) => {
	const count = items.length + 1;

	return {
		enable: true,
		id: `${prefix}-item-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
		buttonLabel: `Title ${count}`,
		position: '',
		buttonIcon: {
			type: 'icon',
			icon: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zm-24-136V232c0-13.3 10.7-24 24-24s24 10.7 24 24v144c0 13.3-10.7 24-24 24s-24-10.7-24-24zm24-224a32 32 0 1 1 0-64 32 32 0 1 1 0 64z'/></svg>",
			url: ''
		},
		title: `Info Title ${count}`,
		description: 'Describe this part of your process, service or story in a sentence or two.',
		image: { id: null, url: '', alt: '' },
		imageHeight: '107px',
		imagePosition: 'top',
		link: { url: '', target: false, nofollow: false, title: '' },
		styles: {
			normal: { color: { label: '', icon: '' }, background: {}, border: {} },
			hover: { color: { label: '', icon: '' }, background: {}, border: {} },
			active: { color: { label: '', icon: '' }, background: {}, border: {} },
			titleColor: '',
			dividerColor: '',
			descColor: ''
		}
	};
};
