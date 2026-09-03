const solid = (color) => ({ type: 'solid', color });
const box = (v) => ({ desktop: { top: v, right: v, bottom: v, left: v }, tablet: {}, mobile: {} });
const pad = (v, h) => ({ desktop: { top: v, right: h, bottom: v, left: h }, tablet: {}, mobile: {} });

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

export const THEME_CELL_BORDER = {
	cards: 'separate',
	ribbon: 'separate',
	stacked: 'separate'
};


export const THEME_NO_BORDER = ['cards', 'ribbon', 'stacked'];
