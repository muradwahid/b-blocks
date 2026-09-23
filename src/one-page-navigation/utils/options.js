import { prefix } from './data';

export const allTabs = [
	{ name: 'general', title: 'General'},
	{ name: 'style', title: 'Style'},
	{ name: 'advanced', title: 'Advanced'}
];

export const presets = [
	{ label: 'Glass Bullseye', value: 'glassBullseye' },
	{ label: 'Magnetic Bubble', value: 'magneticBubble' },
	{ label: 'Numbered Steps', value: 'numberedSteps' },
	{ label: 'Expandable Pills', value: 'expandablePills' },
	{ label: 'Stacked Cards', value: 'stackedCards' },
	{ label: 'Side Rail', value: 'sideRail' }
];

export const positions = [
	{ label: 'Left', value: 'left' },
	{ label: 'Right', value: 'right' }
];

export const verticalAligns = [
	{ label: 'Top', value: 'top' },
	{ label: 'Center', value: 'center' },
	{ label: 'Bottom', value: 'bottom' }
];

export const pulseStyles = [
	{ label: 'Pulse Ring', value: 'pulseRing' },
	{ label: 'Radar', value: 'radar' },
	{ label: 'Breathing Glow', value: 'breathingGlow' },
	{ label: 'Heartbeat', value: 'heartbeat' }
];

export const iconTypes = [
	{ label: 'None', value: 'none' },
	{ label: 'Library', value: 'icon' },
	{ label: 'Image', value: 'image' },
	{ label: 'SVG', value: 'svg' }
];

export const IMAGE_MIME_TYPES = ['image'];

export const SVG_MIME_TYPES = ['image/svg+xml'];

export const objectFits = [
	{ label: 'Contain', value: 'contain' },
	{ label: 'Cover', value: 'cover' },
	{ label: 'Fill', value: 'fill' },
	{ label: 'None', value: 'none' }
];

export const bubbleIconPositions = [
	{ label: 'Auto', value: 'auto' },
	{ label: 'Left', value: 'left' },
	{ label: 'Center', value: 'center' },
	{ label: 'Right', value: 'right' }
];

export const bubbleIconPlacement = (attributes = {}, device = 'desktop') => {
	const bubble = attributes?.bubble || {};

	const position = resolveDevice(bubble, device, 'iconPosition', bubble.iconPosition || 'auto');

	if ('inside' === position || 'center' === position) return 'center';

	const side = 'outside' === position ? (bubble.side || 'auto') : position;

	if ('left' === side || 'right' === side) return side;

	return 'left' === placementOf(attributes.layout || {}, device, 'position', 'right') ? 'right' : 'left';
};

export const PRESET_PANELS = {
	glassBullseye: ['marker', 'item', 'media', 'animation', 'label', 'line'],
	magneticBubble: ['marker', 'item', 'media', 'animation', 'label', 'line', 'bubble'],
	numberedSteps: ['marker', 'item', 'number', 'media', 'line', 'label'],
	expandablePills: ['marker', 'item', 'media', 'label'],
	stackedCards: ['marker', 'item', 'media', 'label', 'line'],
	sideRail: ['marker', 'item', 'media', 'label', 'line']
};

export const ICON_PRESETS = ['magneticBubble', 'expandablePills', 'stackedCards'];

export const PANEL_PRESETS = ['glassBullseye', 'expandablePills', 'stackedCards'];

export const hidesIcon = (preset) => !ICON_PRESETS.includes(preset);

export const INLINE_LABEL_PRESETS = ['expandablePills', 'stackedCards'];

export const usesTooltip = (preset) => !INLINE_LABEL_PRESETS.includes(preset);

export const showsNumber = (attributes = {}) => 'numberedSteps' === (attributes?.layout?.preset || 'glassBullseye') && !attributes?.media?.showIcon;

const BARE_MARKER = ['sideRail'];

export const showsMarkerColor = (attributes = {}) => !showsNumber(attributes) && (!BARE_MARKER.includes(attributes?.layout?.preset || 'glassBullseye') || showsIcon(attributes));

export const usesImage = (items = []) => items.some((item) => 'image' === item?.icon?.type);

export const showsIcon = (attributes = {}) => {
	const preset = attributes?.layout?.preset || 'glassBullseye';

	return !hidesIcon(preset) || !!attributes?.media?.showIcon;
};

export const hasPanel = (preset, panel) => (PRESET_PANELS[preset] || PRESET_PANELS.glassBullseye).includes(panel);

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

export const cleanSectionId = (value = '') => String(value || '').trim().replace(/^#+/, '');

export const isValidSectionId = (value = '') => /^[A-Za-z][\w:.-]*$/.test(cleanSectionId(value));

export const stepNumber = (index) => String(index + 1).padStart(2, '0');

export const placementOf = (layout = {}, device, key, fallback) =>
	resolveDevice(layout, device, key, layout[key] || fallback);

export const getBlockClasses = (attributes) => {
	const { layout = {} } = attributes;

	return `${prefix}-pos-${placementOf(layout, 'desktop', 'position', 'right')} ${prefix}-align-${placementOf(layout, 'desktop', 'verticalAlign', 'center')}`;
};

export const getWrapperClasses = (attributes) => {
	const { layout = {}, animation = {} } = attributes;

	const preset = layout.preset || 'glassBullseye';

	const pulses = animation.pulse && hasPanel(preset, 'animation');

	const icons = hidesIcon(preset) && attributes?.media?.showIcon;

	return [
		prefix,
		`${prefix}-preset-${preset}`,
		pulses ? `${prefix}-pulse-${animation.style || 'pulseRing'}` : '',
		'magneticBubble' === preset && 'center' !== bubbleIconPlacement(attributes) ? `${prefix}-bubble-outside ${prefix}-bubble-${bubbleIconPlacement(attributes)}` : '',
		icons ? 'is-icon-visible' : ''
	].filter(Boolean).join(' ');
};

const ITEM_BOX = { expandablePills: 'link', stackedCards: 'link' };

export const paintsLink = (preset) => 'link' === ITEM_BOX[preset];

/**
 * Whether padding the row means anything. Where the box is the link it is the
 * space inside a pill or a card. Where it is the marker it is a fixed shape —
 * a node, a chip, a dot, a bar — sized by Marker ▸ Size and Item ▸ Width, and
 * padding only swells it past that, which walks it off the track it sits on.
 */
export const showsPadding = (preset) => paintsLink(preset);

export const PULSE_PRESET = 'magneticBubble';

const BORDERED = ['magneticBubble', 'numberedSteps', 'stackedCards'];

export const hasBorder = (preset) => BORDERED.includes(preset);

export const hasRing = (preset) => 'glassBullseye' === (preset || 'glassBullseye');

const ITEM_INITIAL = {
	glassBullseye: {
		normal: { color: '#9aa0ae' },
		hover: { color: '#4b33f5' },
		active: { color: '#4b33f5' }
	},
	magneticBubble: {
		normal: { color: '#9aa0ae', background: '#ffffff', border: { width: '2px', style: 'solid', color: '#e3e6ef' } },
		hover: { color: '#4b33f5', background: '#4b33f51a', markerColor: '#ffffff' },
		active: { color: '#4b33f5', background: '#4b33f5', markerColor: '#ffffff' }
	},
	numberedSteps: {
		normal: { color: '#9aa0ae', background: '#ffffff', border: { width: '2px', style: 'solid', color: '#e3e6ef' } },
		hover: { color: '#4b33f5', background: '#4b33f51a', border: { width: '2px', style: 'solid', color: '#4b33f5' } },
		active: { color: '#4b33f5', background: '#4b33f5', markerColor: '#ffffff', border: { width: '2px', style: 'solid', color: '#4b33f5' } }
	},
	expandablePills: {
		normal: { color: '#1e2230' },
		hover: { color: '#4b33f5', background: '#4b33f51a' },
		active: { color: '#ffffff', background: '#4b33f5' }
	},
	stackedCards: {
		normal: { color: '#1e2230', background: '#ffffff', border: { width: '1px', style: 'solid', color: '#e3e6ef' } },
		hover: { color: '#4b33f5', background: '#f4f5fa' },
		active: { color: '#ffffff', background: '#4b33f5', border: { width: '1px', style: 'solid', color: '#4b33f5' } }
	},
	sideRail: {
		normal: { color: '#9aa0ae', background: '#9aa0ae' },
		hover: { background: '#4b33f5' },
		active: { background: '#4b33f5' }
	}
};

export const itemState = (attributes = {}, state, withInitial = false) => {
	const { item = {}, line = {}, layout = {} } = attributes;

	const preset = layout.preset || 'glassBullseye';
	const own = item?.[state] || {};

	const ships = withInitial ? (ITEM_INITIAL[preset] || {})[state] || {} : {};

	const set = (value) => value && ('object' !== typeof value || Object.keys(value).length);
	const pick = (key, empty) => (set(own[key]) ? own[key] : (withInitial ? ships[key] : null) || empty);

	const edge = () => {
		if (set(own.border)) return own.border;

		const drawn = line.color || line?.desktop?.thickness;

		if (withInitial && drawn) return { width: line?.desktop?.thickness || ships.border?.width || '', style: 'solid', color: line.color || ships.border?.color || '' };

		return (withInitial ? ships.border : null) || {};
	};

	return { color: pick('color', ''), background: pick('background', {}), markerColor: pick('markerColor', ''), border: edge() };
};

export const numberState = (number = {}, state) => number?.[state]?.color || '';

export const resolveBox = (group = {}, device, key) => {
	const read = (dev) => {
		const box = group?.[dev]?.[key];

		if ('string' === typeof box) return box ? { top: box, right: box, bottom: box, left: box } : undefined;

		return box && Object.values(box).some((side) => '' !== side && undefined !== side && null !== side) ? box : undefined;
	};

	const desktop = read('desktop') ?? {};

	if ('desktop' === device) return desktop;

	const tablet = read('tablet') ?? desktop;

	if ('tablet' === device) return tablet;

	return read('mobile') ?? tablet;
};

export const toBackground = (value) => ('string' === typeof value ? { type: 'solid', color: value } : (value || {}));

export const labelOf = (list, value, fallback) => (list.find((o) => o.value === value) || list.find((o) => o.value === fallback) || {}).label || '';
