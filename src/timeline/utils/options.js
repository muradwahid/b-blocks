import { __ } from '@wordpress/i18n';

/**
 * Static option lists for the Timeline block.
 *
 * Anything the server also needs to understand — the layout sides and the
 * line styles — is mirrored in render.php, so keep the two in sync when
 * adding or renaming a value.
 */

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') }
];

export const directionOptions = [
	{ label: __('Vertical', 'b-blocks'), value: 'vertical' },
	{ label: __('Horizontal', 'b-blocks'), value: 'horizontal' }
];

export const directionValues = directionOptions.map((o) => o.value);

// In a horizontal timeline these read as above / below the line rather than
// left / right of it; the labels are set from the direction in Layout.js.
export const sideOptions = [
	{ label: __('Alternate', 'b-blocks'), value: 'alternate' },
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const sideValues = sideOptions.map((o) => o.value);

export const lineExtentOptions = [
	{ label: __('Between markers', 'b-blocks'), value: 'markers' },
	{ label: __('Full length', 'b-blocks'), value: 'full' }
];

export const lineExtentValues = lineExtentOptions.map((o) => o.value);

// Where the arrow sits along the card edge it points from. Start/end read as
// top/bottom in a vertical timeline and left/right in a horizontal one, so
// the labels are set from the direction in Connectors.js.
export const arrowAlignValues = ['start', 'center', 'end'];

// Marker shapes. Circle, square and rounded are border radii, so the ring,
// the shadow and the pulse all follow them. Diamond is a rotated square
// rather than a clip path for exactly that reason — a clip path would cut
// those three off at the marker's edge. The hexagon has no radius equivalent
// and does have to be clipped, which is why it is the one shape that cannot
// carry a ring or a pulse.
export const markerShapeOptions = [
	{ label: __('Circle', 'b-blocks'), value: 'circle' },
	{ label: __('Rounded', 'b-blocks'), value: 'rounded' },
	{ label: __('Square', 'b-blocks'), value: 'square' },
	{ label: __('Diamond', 'b-blocks'), value: 'diamond' },
	{ label: __('Hexagon', 'b-blocks'), value: 'hexagon' }
];

export const markerShapeValues = markerShapeOptions.map((o) => o.value);

// The border radius each preset stands for. It is only a starting point: the
// Border Radius control is emitted after it, so the shape decides the corners
// until that control is given a value and takes them over.
export const markerShapeRadius = {
	circle: '50%',
	rounded: '25%',
	square: '0',
	diamond: '0',
	hexagon: '0'
};

// Shapes drawn with a clip path. Their ring and pulse are clipped away with
// everything else outside the marker's box, so both are hidden for them.
export const clippedMarkerShapes = ['hexagon'];

// Shapes drawn by rotating the box, and by how much. The icon inside is
// counter-rotated by the same amount so it stays upright.
export const rotatedMarkerShapes = { diamond: 45 };

export const ringStyleOptions = [
	{ label: __('Solid', 'b-blocks'), value: 'solid' },
	{ label: __('Dashed', 'b-blocks'), value: 'dashed' },
	{ label: __('Dotted', 'b-blocks'), value: 'dotted' },
	{ label: __('Double', 'b-blocks'), value: 'double' }
];

export const ringStyleValues = ringStyleOptions.map((o) => o.value);

// A ring drawn as an outline rather than a spread box-shadow: an outline
// follows the border radius, takes no part in layout, and leaves box-shadow
// free for the marker's own shadow instead of the two having to share one
// declaration.
//
// Written as longhand rather than the `outline` shorthand so an entry can
// change one part of the Timeline's ring — just the colour, say — without
// having to restate the other three.
export const getRingCSS = (ring = {}) => {
	const { width, style, offset, color } = ring;

	// Each part stands alone: the marker's base rule already carries a
	// zero-width solid outline, so whichever of these is set is the only one
	// that has to be said.
	return [
		width ? `outline-width: ${width};` : '',
		style ? `outline-style: ${style};` : '',
		color ? `outline-color: ${color};` : '',
		offset ? `outline-offset: ${offset};` : ''
	].filter(Boolean).join(' ');
};

export const lineStyleOptions = [
	{ label: __('Solid', 'b-blocks'), value: 'solid' },
	{ label: __('Dashed', 'b-blocks'), value: 'dashed' },
	{ label: __('Dotted', 'b-blocks'), value: 'dotted' }
];

export const lineStyleValues = lineStyleOptions.map((o) => o.value);

// Dashed and dotted are painted rather than bordered because a border's dash
// length is chosen by the browser — at a 2px line it renders as a tight
// stipple with no way to space it out. Painting them makes the dash and the
// gap author-controlled, and masking rather than filling lets the progress
// fill reuse the same pattern.
export const dashLineStyles = ['dashed', 'dotted'];

export const itemSideOptions = [
	{ label: __('Auto (follow layout)', 'b-blocks'), value: '' },
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const timelineBlockName = 'b-blocks/timeline';

export const timelineItemBlockName = 'b-blocks/timeline-item';

export const allowedBlocks = [timelineItemBlockName];

// Marker icons for the starter entries. IconLibrary stores a raw SVG string
// rather than a font class, so the block carries no icon-font dependency.
const arrowUp = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><path d='M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z'/></svg>";

const arrowLeft = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'><path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z'/></svg>";

// Three starter entries so a freshly inserted Timeline already shows the
// alternating rhythm instead of an empty placeholder.
//
// Three starter entries so a freshly inserted Timeline already shows the
// alternating rhythm instead of an empty placeholder.
const entry = (heading) => [
	['core/heading', { level: 3, content: heading }],
	['core/paragraph', { content: __('Describe what happened at this point on the timeline.', 'b-blocks') }]
];

export const template = [
	[timelineItemBlockName, { date: '01-01-2026', icon: arrowUp }, entry(__('First milestone', 'b-blocks'))],
	[timelineItemBlockName, { date: '01-01-2026', icon: arrowUp }, entry(__('Second milestone', 'b-blocks'))],
	[timelineItemBlockName, { date: '01-01-2026', icon: arrowLeft }, entry(__('Third milestone', 'b-blocks'))]
];