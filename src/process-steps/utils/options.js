import { __ } from '@wordpress/i18n';

/**
 * Shared option arrays, tab definitions and attribute → CSS/class helpers for
 * the Process Steps block. Consumed by the editor (Edit / Settings), the
 * shared frontend component and Common/Style.js so the wrapper classes and CSS
 * custom properties stay defined in exactly one place.
 */

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') },
];

export const TITLE_TAGS = ['h2', 'h3', 'h4', 'p'];

export const TITLE_TAG_OPTIONS = [
	{ label: 'H2', value: 'h2' },
	{ label: 'H3', value: 'h3' },
	{ label: 'H4', value: 'h4' },
	{ label: __('Paragraph', 'b-blocks'), value: 'p' },
];

export const THEME_OPTIONS = [
	{ label: __('Classic — clean cards, blue accent', 'b-blocks'), value: 'classic' },
	{ label: __('Modern — gradient badges, soft shadow', 'b-blocks'), value: 'modern' },
	{ label: __('Minimal — borderless, dotted connectors', 'b-blocks'), value: 'minimal' },
	{ label: __('Bold — high-contrast dark badges', 'b-blocks'), value: 'bold' },
];

/** Build a uniform border-radius box object. */
const radius = (value) => ({ top: value, right: value, bottom: value, left: value });

/**
 * Theme presets. Selecting a theme writes these attribute values onto the
 * block (see `applyThemePreset`) so the whole look is data-driven and rendered
 * by Common/Style.js — no theme-specific CSS classes. Presets only carry the
 * "color & feel" properties; structural attributes the user controls
 * (badge size/type, gap, columns, alignment, padding, font sizes, steps) are
 * preserved on switch.
 */
export const THEME_PRESETS = {
	classic: {
		badge: {
			bg: { type: 'solid', color: '#2563EB' },
			color: '#FFFFFF',
			border: {},
			borderRadius: radius('50%'),
			shadow: [],
			typo: { fontWeight: '700' },
		},
		card: {
			bg: { type: 'solid', color: '' },
			border: {},
			borderRadius: radius('8px'),
			shadow: [],
		},
		content: {
			titleColor: '',
			descColor: '',
			typo: { fontWeight: '600', textTransform: '', letterSpace: '' },
		},
		connector: { style: 'solid', color: '#CBD5E1', width: '2px' },
	},
	modern: {
		badge: {
			bg: { type: 'gradient', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
			color: '#FFFFFF',
			border: {},
			borderRadius: radius('50%'),
			shadow: [{ hOffset: '0px', vOffset: '8px', blur: '20px', spreed: '-6px', color: 'rgba(236, 72, 153, 0.45)', isInset: false }],
			typo: { fontWeight: '700' },
		},
		card: {
			bg: { type: 'gradient', gradient: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' },
			border: {},
			borderRadius: radius('16px'),
			shadow: [
				{ hOffset: '0px', vOffset: '14px', blur: '32px', spreed: '-16px', color: 'rgba(15, 23, 42, 0.18)', isInset: false },
				{ hOffset: '0px', vOffset: '2px', blur: '6px', spreed: '-2px', color: 'rgba(15, 23, 42, 0.06)', isInset: false },
			],
		},
		content: {
			titleColor: '#0f172a',
			descColor: '#475569',
			typo: { fontWeight: '700', textTransform: '', letterSpace: '' },
		},
		connector: { style: 'solid', color: '#C4B5FD', width: '2px' },
	},
	minimal: {
		badge: {
			bg: { type: 'solid', color: '' },
			color: '#475569',
			border: { width: '1px', style: 'solid', color: '#475569' },
			borderRadius: radius('50%'),
			shadow: [],
			typo: { fontWeight: '500' },
		},
		card: {
			bg: { type: 'solid', color: '' },
			border: {},
			borderRadius: radius('8px'),
			shadow: [],
		},
		content: {
			titleColor: '',
			descColor: '#64748B',
			typo: { fontWeight: '500', textTransform: '', letterSpace: '-0.01em' },
		},
		connector: { style: 'dotted', color: '#CBD5E1', width: '2px' },
	},
	bold: {
		badge: {
			bg: { type: 'solid', color: '#0F172A' },
			color: '#FACC15',
			border: {},
			borderRadius: radius('0px'),
			shadow: [{ hOffset: '3px', vOffset: '3px', blur: '0px', spreed: '0px', color: '#FACC15', isInset: false }],
			typo: { fontWeight: '800' },
		},
		card: {
			bg: { type: 'solid', color: '#FFFFFF' },
			border: { width: '2px', style: 'solid', color: '#0F172A' },
			borderRadius: radius('0px'),
			shadow: [{ hOffset: '6px', vOffset: '6px', blur: '0px', spreed: '0px', color: '#0F172A', isInset: false }],
		},
		content: {
			titleColor: '#0f172a',
			descColor: '#1e293b',
			typo: { fontWeight: '800', textTransform: 'uppercase', letterSpace: '0.02em' },
		},
		connector: { style: 'solid', color: '#0F172A', width: '3px' },
	},
};

/**
 * Merge a theme preset onto the current attributes, returning the object to
 * hand to `setAttributes`. Structural props are preserved because we spread the
 * existing sub-objects first; nested `typo` merges so the user's font sizes
 * survive a theme switch.
 */
export const applyThemePreset = (attributes, themeName) => {
	const preset = THEME_PRESETS[themeName] || THEME_PRESETS.classic;
	const { layout = {}, badge = {}, card = {}, content = {}, connector = {} } = attributes;

	return {
		layout: { ...layout, theme: themeName },
		badge: {
			...badge,
			...preset.badge,
			typo: { ...(badge.typo || {}), ...(preset.badge.typo || {}) },
		},
		card: { ...card, ...preset.card },
		content: {
			...content,
			...preset.content,
			typo: { ...(content.typo || {}), ...(preset.content.typo || {}) },
		},
		connector: { ...connector, ...preset.connector },
	};
};

export const ALIGNMENT_OPTIONS = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' },
];

export const BADGE_TYPE_OPTIONS = [
	{ label: __('Number', 'b-blocks'), value: 'number' },
	{ label: __('Icon', 'b-blocks'), value: 'icon' },
];

export const CONNECTOR_STYLE_OPTIONS = [
	{ label: __('Solid', 'b-blocks'), value: 'solid' },
	{ label: __('Dashed', 'b-blocks'), value: 'dashed' },
	{ label: __('Dotted', 'b-blocks'), value: 'dotted' },
];

export const MAX_STEPS = 12;

/** Parse a px-ish string/number to a plain number, falling back when empty. */
export const parsePx = (value, fallback) => {
	const v = (value == null ? '' : value).toString().trim();
	if (!v) return fallback;
	const m = v.match(/^(-?\d+(?:\.\d+)?)/);
	return m ? parseFloat(m[1]) : fallback;
};

/** Return a trimmed length string or the fallback when empty. */
export const resolveLength = (value, fallback) => {
	const v = (value == null ? '' : value).toString().trim();
	return v || fallback;
};


/** Capitalize the first character (for building camelCase modifier classes). */
const cap = (value) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : '');

/**
 * Build the wrapper modifier class string (layout / alignment / badge /
 * connector). The `.bBlocksProcessSteps` element these land on is what
 * style.scss is scoped to. Themes no longer add a class — theme selection is
 * applied to the attributes and rendered dynamically by Common/Style.js.
 */
export const getWrapperClasses = (attributes) => {
	const { layout = {}, badge = {}, connector = {} } = attributes;
	const { type, alignment } = layout;
	const safeLayout = type === 'vertical' ? 'vertical' : 'horizontal';
	const safeAlignment = ['left', 'center', 'right'].includes(alignment) ? alignment : 'center';
	const safeBadgeType = badge.type === 'icon' ? 'icon' : 'number';
	const showConnector = connector.show;

	return [
		'bBlocksProcessSteps',
		`bBlocksProcessStepsLayout${cap(safeLayout)}`,
		`bBlocksProcessStepsAlign${cap(safeAlignment)}`,
		`bBlocksProcessStepsBadge${cap(safeBadgeType)}`,
		showConnector ? 'has-connector' : 'no-connector',
	].join(' ');
};
/**
 * Clamp a connector line style to the three CSS border styles the block
 * supports, defaulting to `solid`.
 */
export const safeConnectorStyle = (style) => (['solid', 'dashed', 'dotted'].includes(style) ? style : 'solid');

/** Read a column count as a positive integer, falling back per breakpoint. */
export const resolveCols = (value, fallback) => parseInt(value, 10) || fallback;
