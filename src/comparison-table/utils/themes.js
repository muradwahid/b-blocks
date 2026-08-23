const solid = (color) => ({ type: 'solid', color });
const box = (v) => ({ desktop: { top: v, right: v, bottom: v, left: v }, tablet: {}, mobile: {} });
const pad = (v, h) => ({ desktop: { top: v, right: h, bottom: v, left: h }, tablet: {}, mobile: {} });

/**
 * Theme presets as ATTRIBUTE VALUES, not stylesheet overrides.
 *
 * Picking a theme writes these into the block, so every value stays editable
 * afterwards — the old approach baked them into style.scss behind !important,
 * which meant the colour panels silently did nothing on eight of the nine
 * themes. style.scss now only carries structure that cannot be expressed as an
 * attribute (border-spacing, the ribbon notch, the lifted card).
 */
export const themePresets = {
	default: {
		header: { normal: { bg: solid('#1e293b'), color: '#ffffff' }, hover: { bg: {}, color: '' } },
		body: { bg: solid('#ffffff'), color: '#1f2937' },
		featured: { bg: solid('#2563eb'), color: '#ffffff', columnBg: solid('#eff6ff'), labelBg: solid('#f59e0b'), labelColor: '#ffffff' },
		rowLabel: { bg: solid('transparent'), color: '' },
		rowColorsPart: { odd: { color: '', bg: '' }, even: { color: '', bg: '' } },
		tablePart: { borderColor: '#e2e8f0' }, icons: { checkColor: '#16a34a', crossColor: '#dc2626' },
		radiusPart: box('8px'), paddingPart: pad('12px', '16px'), shadowPart: []
	},

	clean: {
		header: { normal: { bg: solid('transparent'), color: '#0f172a' }, hover: { bg: {}, color: '' } },
		body: { bg: solid('transparent'), color: '#1f2937' },
		featured: { bg: solid('transparent'), color: '#2563eb', columnBg: solid('#f8fbff'), labelBg: solid('transparent'), labelColor: '#2563eb' },
		rowLabel: { bg: solid('transparent'), color: '#0f172a' },
		rowColorsPart: { odd: { color: '', bg: '' }, even: { color: '', bg: '' } },
		tablePart: { borderColor: '#e8edf5' }, icons: { checkColor: '#16a34a', crossColor: '#cbd5e1' },
		radiusPart: box('0px'), paddingPart: pad('19px', '16px'), shadowPart: []
	},

	striped: {
		header: { normal: { bg: solid('#1e293b'), color: '#ffffff' }, hover: { bg: {}, color: '' } },
		body: { bg: solid('#ffffff'), color: '#1f2937' },
		featured: { bg: solid('#2563eb'), color: '#ffffff', columnBg: solid('#dbeafe'), labelBg: solid('#f59e0b'), labelColor: '#ffffff' },
		rowLabel: { bg: solid('transparent'), color: '' },
		rowColorsPart: { odd: { color: '', bg: '#ffffff' }, even: { color: '', bg: '#eff6ff' } },
		tablePart: { borderColor: '#e2e8f0' }, icons: { checkColor: '#16a34a', crossColor: '#dc2626' },
		radiusPart: box('8px'), paddingPart: pad('12px', '16px'), shadowPart: []
	},

	bordered: {
		header: { normal: { bg: solid('#334155'), color: '#ffffff' }, hover: { bg: {}, color: '' } },
		body: { bg: solid('#ffffff'), color: '#1f2937' },
		featured: { bg: solid('#2563eb'), color: '#ffffff', columnBg: solid('#eff6ff'), labelBg: solid('#f59e0b'), labelColor: '#ffffff' },
		rowLabel: { bg: solid('#f1f5f9'), color: '#0f172a' },
		rowColorsPart: { odd: { color: '', bg: '' }, even: { color: '', bg: '' } },
		tablePart: { borderColor: '#475569' }, icons: { checkColor: '#16a34a', crossColor: '#dc2626' },
		radiusPart: box('4px'), paddingPart: pad('12px', '16px'), shadowPart: []
	},

	cards: {
		header: { normal: { bg: solid('#1e293b'), color: '#ffffff' }, hover: { bg: {}, color: '' } },
		body: { bg: solid('#ffffff'), color: '#1f2937' },
		featured: { bg: solid('#2563eb'), color: '#ffffff', columnBg: solid('#eff6ff'), labelBg: solid('#f59e0b'), labelColor: '#ffffff' },
		rowLabel: { bg: solid('transparent'), color: '#0f172a' },
		rowColorsPart: { odd: { color: '', bg: '' }, even: { color: '', bg: '' } },
		tablePart: { borderColor: '#e2e8f0' }, icons: { checkColor: '#16a34a', crossColor: '#dc2626' },
		tableRadius: box('8px'), cellPadding: pad('14px', '16px'),
		tableShadow: [{ hOffset: '0px', vOffset: '4px', blur: '18px', spreed: '0px', color: '#0f172a1f', isInset: false }]
	},

	ribbon: {
		header: { normal: { bg: solid('#2563eb'), color: '#ffffff' }, hover: { bg: {}, color: '' } },
		// No panel fill — the tabs carry the colour, the surface stays clear.
		body: { bg: solid(''), color: '#0f172a' },
		featured: { bg: solid('#e0574f'), color: '#ffffff', columnBg: solid('#ffffff'), labelBg: solid('#f59e0b'), labelColor: '#ffffff' },
		rowLabel: { bg: solid('transparent'), color: '#0f172a' },
		rowColorsPart: { odd: { color: '', bg: '#ffffff' }, even: { color: '', bg: '#f1f5f9' } },
		tablePart: { borderColor: 'transparent' }, icons: { checkColor: '#16a34a', crossColor: '#dc2626' },
		radiusPart: box('8px'), paddingPart: pad('12px', '16px'), shadowPart: []
	},

	stacked: {
		header: { normal: { bg: solid('#1e293b'), color: '#ffffff' }, hover: { bg: {}, color: '' } },
		body: { bg: solid(''), color: '#1f2937' },
		featured: { bg: solid('#e0574f'), color: '#ffffff', columnBg: solid('#ffffff'), labelBg: solid('#f59e0b'), labelColor: '#ffffff' },
		rowLabel: { bg: solid('transparent'), color: '#0f172a' },
		rowColorsPart: { odd: { color: '', bg: '#ffffff' }, even: { color: '', bg: '#f3f4f6' } },
		tablePart: { borderColor: 'transparent' }, icons: { checkColor: '#16a34a', crossColor: '#dc2626' },
		radiusPart: box('8px'), paddingPart: pad('14px', '16px'), shadowPart: []
	}
};

/**
 * Merge a preset into the nested attribute groups.
 *
 * Only the keys a preset owns are replaced; structural choices the author made
 * (alignment, sticky columns, stack-on-mobile) survive a theme change.
 */
export const applyTheme = (theme, current = {}) => {
	const p = themePresets[theme] || {};

	return {
		table: {
			...(current.table || {}),
			theme,
			borderColor: p.tablePart?.borderColor,
			shadow: p.shadowPart || [],
			desktop: { ...(current.table?.desktop || {}), radius: p.radiusPart?.desktop }
		},
		header: p.header,
		body: {
			...(current.body || {}),
			...(p.body || {}),
			desktop: { ...(current.body?.desktop || {}), padding: p.paddingPart?.desktop }
		},
		rowLabel: p.rowLabel,
		rowColors: { ...(current.rowColors || {}), ...(p.rowColorsPart || {}) },
		featured: p.featured,
		icons: { ...(current.icons || {}), ...(p.icons || {}) }
	};
};

/**
 * Themes whose layout depends on a specific border-collapse value, so the
 * Cell Border Type control cannot apply. cards / ribbon / stacked split their
 * columns with border-spacing, which only exists under `separate`; bordered
 * and clean need `collapse` for a seamless grid.
 */
export const THEME_CELL_BORDER = {
	bordered: 'collapse',
	clean: 'collapse',
	cards: 'separate',
	ribbon: 'separate',
	stacked: 'separate'
};
