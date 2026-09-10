import { __ } from '@wordpress/i18n';

import { prefix } from './data';

export const allTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') }
];

export const normalHoverTabs = [
	{ name: 'normal', title: __('Normal', 'b-blocks') },
	{ name: 'hover', title: __('Hover', 'b-blocks') }
];

// The copy button has a third resting state: the two seconds after a click,
// while it is showing the copied label.
export const copyStateTabs = [
	...normalHoverTabs,
	{ name: 'copied', title: __('Copied', 'b-blocks') }
];

// Values are Prism's own language slugs, so a saved value maps straight onto a
// registered grammar. Anything unregistered falls back to plain text rather
// than silently rendering unhighlighted.
export const languages = [
	{ label: __('Plain Text', 'b-blocks'), value: 'none' },
	{ label: 'Bash / Shell', value: 'bash' },
	{ label: 'C', value: 'c' },
	{ label: 'C++', value: 'cpp' },
	{ label: 'C#', value: 'csharp' },
	{ label: 'CSS', value: 'css' },
	{ label: 'Dart', value: 'dart' },
	{ label: 'Diff', value: 'diff' },
	{ label: 'Go', value: 'go' },
	{ label: 'GraphQL', value: 'graphql' },
	{ label: 'Haskell', value: 'haskell' },
	{ label: 'HTML / XML', value: 'markup' },
	{ label: 'Java', value: 'java' },
	{ label: 'JavaScript', value: 'javascript' },
	{ label: 'JSON', value: 'json' },
	{ label: 'JSX', value: 'jsx' },
	{ label: 'Julia', value: 'julia' },
	{ label: 'Kotlin', value: 'kotlin' },
	{ label: 'Less', value: 'less' },
	{ label: 'Markdown', value: 'markdown' },
	{ label: 'Perl', value: 'perl' },
	{ label: 'PHP', value: 'php' },
	{ label: 'Python', value: 'python' },
	{ label: 'Ruby', value: 'ruby' },
	{ label: 'Rust', value: 'rust' },
	{ label: 'SCSS', value: 'scss' },
	{ label: 'SQL', value: 'sql' },
	{ label: 'Swift', value: 'swift' },
	{ label: 'TypeScript', value: 'typescript' },
	{ label: 'TSX', value: 'tsx' },
	{ label: 'YAML', value: 'yaml' }
];

export const themes = [
	{ label: __('Solid', 'b-blocks'), value: 'default' },
	{ label: __('Dark', 'b-blocks'), value: 'dark' },
	{ label: __('Tomorrow', 'b-blocks'), value: 'tomorrow' },
	{ label: __('Solarized Light', 'b-blocks'), value: 'solarized-light' },
	{ label: __('Twilight', 'b-blocks'), value: 'twilight' },
	{ label: __('Porple', 'b-blocks'), value: 'porple' },
	{ label: 'Dracula', value: 'dracula' },
	{ label: 'One Dark', value: 'one-dark' },
	{ label: 'One Light', value: 'one-light' },
	{ label: 'Nord', value: 'nord' },
	{ label: 'Night Owl', value: 'night-owl' },
	{ label: 'Material Oceanic', value: 'material-oceanic' },
	{ label: 'VS Code Dark+', value: 'vsc-dark-plus' },
	{ label: 'Gruvbox Dark', value: 'gruvbox-dark' },
	{ label: 'Atom Dark', value: 'atom-dark' },
	{ label: 'Solarized Dark', value: 'solarized-dark-atom' },
	{ label: 'GitHub Light', value: 'ghcolors' },
	{ label: 'Coldark Cold', value: 'coldark-cold' },
	{ label: 'Shades of Purple', value: 'shades-of-purple' },
	{ label: 'Laserwave', value: 'laserwave' }
];

export const copyPositions = [
	{ label: __('In Header', 'b-blocks'), value: 'header' },
	{ label: __('Top Right', 'b-blocks'), value: 'top-right' },
	{ label: __('Bottom Right', 'b-blocks'), value: 'bottom-right' }
];

export const iconPositions = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const degUnit = (def = 0) => ({ value: 'deg', label: 'deg', default: def });

export const captionPositions = [
	{ label: __('Above', 'b-blocks'), value: 'top' },
	{ label: __('Below', 'b-blocks'), value: 'bottom' }
];

export const alignments = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const THEME_VALUES = themes.map(({ value }) => value);
export const LANGUAGE_VALUES = languages.map(({ value }) => value);

/** A saved value that predates the current list must not leave the block blank. */
export const safeTheme = (value) => THEME_VALUES.includes(value) ? value : 'porple';
export const safeLanguage = (value) => LANGUAGE_VALUES.includes(value) ? value : 'none';

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

/** Sizes carry their unit ('14px'). A bare number is read as px. */
export const withUnit = (value, fallback = '') => {
	if (null === value || undefined === value || '' === value) return fallback;

	const number = parseFloat(value);

	if (isNaN(number)) return fallback;

	return /[a-z%]$/i.test(String(value).trim()) ? String(value).trim() : `${number}px`;
};

export const stateLabel = (state, label) => 'normal' === state ? label : `${state.charAt(0).toUpperCase()}${state.slice(1)} ${label.charAt(0).toLowerCase()}${label.slice(1)}`;

export const getWrapperClasses = (attributes) => {
	const { theme, options = {} } = attributes;

	const capped = 0 < (parseInt(options.maxLines, 10) || 0);

	return [
		prefix,
		`${prefix}-theme-${safeTheme(theme)}`,
		options.wordWrap ? `${prefix}-is-wrapped` : '',
		options.lineNumbers ? `${prefix}-has-line-numbers` : '',
		options.header ? `${prefix}-has-header` : '',
		capped ? `${prefix}-is-capped` : '',
		capped && options.collapsible ? `${prefix}-is-collapsible` : '',
		options.copyButton ? `${prefix}-copy-at-${options.copyPosition || 'header'}` : ''
	].filter(Boolean).join(' ');
};

/** Splits the snippet the same way the gutter counts it, so the two never drift. */
export const codeLines = (code = '') => String(code).replace(/\n$/, '').split('\n');

/**
 * Reads a highlight list like `2, 5-7` into the line numbers it names. Written to
 * match the PHP parser in render.php exactly — the two must agree or the marks
 * land on different lines in the editor than on the page.
 */
export const parseLineRanges = (value = '') => {
	const lines = new Set();

	String(value).split(',').forEach((part) => {
		const range = part.trim();

		if (!range) return;

		const [rawFrom, rawTo] = range.split('-');
		const from = parseInt(rawFrom, 10);
		const to = undefined === rawTo ? from : parseInt(rawTo, 10);

		if (isNaN(from) || isNaN(to)) return;

		// A reversed range is a typo, not an empty set.
		for (let line = Math.min(from, to); line <= Math.max(from, to); line++) {
			0 < line && lines.add(line);
		}
	});

	return [...lines].sort((a, b) => a - b);
};

/**
 * Which highlight marks can actually be drawn. Each mark is one line tall and
 * positioned by line height, so a wrapped line would push everything below it
 * out of step — there is nothing to draw against once the text reflows.
 */
export const getHighlightMarks = (attributes) => {
	const { options = {}, content = {} } = attributes;

	if (options.wordWrap || !options.highlightLines) return [];

	const total = codeLines(content.code).length;
	const start = parseInt(options.startLine, 10) || 1;

	return parseLineRanges(options.highlightLines)
		.map((line) => line - start)
		.filter((offset) => 0 <= offset && offset < total);
};
