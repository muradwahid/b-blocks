/**
 * Image Mask — shared shape definitions.
 *
 * Shapes fall into three families:
 *  - `clip`: implemented purely with a CSS `clip-path` function string.
 *  - `svg`:  implemented as an inline <clipPath> whose `path` is a normalized
 *            (0..1 user-space-on-use via objectBoundingBox) SVG path.
 *  - `custom`: applies a user-uploaded SVG as a CSS `mask-image`.
 *
 * The same data is mirrored in render.php so the editor preview and the
 * server-rendered frontend stay visually identical.
 */

export const SHAPE_OPTIONS = [
	{ label: 'Circle', value: 'circle' },
	{ label: 'Ellipse', value: 'ellipse' },
	{ label: 'Rounded Rect', value: 'rounded-rect' },
	{ label: 'Hexagon', value: 'hexagon' },
	{ label: 'Pentagon', value: 'pentagon' },
	{ label: 'Diamond', value: 'diamond' },
	{ label: 'Triangle', value: 'triangle' },
	{ label: 'Star', value: 'star' },
	{ label: 'Heart', value: 'heart' },
	{ label: 'Blob', value: 'blob' },
	{ label: 'Wave', value: 'wave' },
	{ label: 'Arch', value: 'arch' },
	{ label: 'Parallelogram', value: 'parallelogram' },
	{ label: 'Custom SVG', value: 'custom' },
];

export const SHAPE_VALUES = SHAPE_OPTIONS.map((o) => o.value);

// clip-path function strings (CSS-only shapes).
export const CLIP_SHAPES = {
	circle: 'circle(50% at 50% 50%)',
	ellipse: 'ellipse(50% 42% at 50% 50%)',
	'rounded-rect': 'inset(0 round 18%)',
};

// objectBoundingBox-normalized SVG paths (coordinates 0..1).
export const SVG_SHAPES = {
	hexagon: 'M0.5 0 L0.933 0.25 L0.933 0.75 L0.5 1 L0.067 0.75 L0.067 0.25 Z',
	pentagon: 'M0.5 0 L1 0.38 L0.82 1 L0.18 1 L0 0.38 Z',
	diamond: 'M0.5 0 L1 0.5 L0.5 1 L0 0.5 Z',
	triangle: 'M0.5 0 L1 1 L0 1 Z',
	star: 'M0.5 0 L0.618 0.345 L0.976 0.345 L0.691 0.559 L0.809 0.905 L0.5 0.691 L0.191 0.905 L0.309 0.559 L0.024 0.345 L0.382 0.345 Z',
	heart: 'M0.5 1 L0.07 0.55 C-0.06 0.42 -0.02 0.18 0.18 0.13 C0.33 0.09 0.45 0.21 0.5 0.3 C0.55 0.21 0.67 0.09 0.82 0.13 C1.02 0.18 1.06 0.42 0.93 0.55 Z',
	blob: 'M0.92 0.3 C1.02 0.5 0.93 0.78 0.72 0.9 C0.5 1.02 0.2 0.97 0.08 0.76 C-0.03 0.56 0.02 0.27 0.22 0.12 C0.43 -0.03 0.72 0.02 0.85 0.16 C0.88 0.2 0.9 0.25 0.92 0.3 Z',
	wave: 'M0 0.15 C0.25 0 0.4 0.3 0.65 0.18 C0.82 0.1 0.92 0.12 1 0.2 L1 1 L0 1 Z',
	arch: 'M0 1 L0 0.5 C0 0.22 0.22 0 0.5 0 C0.78 0 1 0.22 1 0.5 L1 1 Z',
	parallelogram: 'M0.22 0 L1 0 L0.78 1 L0 1 Z',
};

export const HOVER_EFFECTS = [
	{ label: 'None', value: 'none' },
	{ label: 'Zoom', value: 'zoom' },
	{ label: 'Tilt', value: 'tilt' },
];

export const SHADOW_OPTIONS = [
	{ label: 'None', value: 'none' },
	{ label: 'Small', value: 'sm' },
	{ label: 'Medium', value: 'md' },
	{ label: 'Large', value: 'lg' },
];

export const SHADOW_FILTERS = {
	none: '',
	sm: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
	md: 'drop-shadow(0 6px 12px rgba(0,0,0,0.22))',
	lg: 'drop-shadow(0 14px 28px rgba(0,0,0,0.28))',
};

export const OBJECT_FIT_OPTIONS = [
	{ label: 'Cover', value: 'cover' },
	{ label: 'Contain', value: 'contain' },
];

export const ALIGN_OPTIONS = [
	{ label: 'Left', value: 'left' },
	{ label: 'Center', value: 'center' },
	{ label: 'Right', value: 'right' },
];
