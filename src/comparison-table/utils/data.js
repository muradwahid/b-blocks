import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksComparisonTable';

// CSS class prefix every element in this block uses.
export const P = 'b-blocks-comparison-table';

export const MAX_COLUMNS = 6;
export const MIN_COLUMNS = 2;
export const MAX_ROWS = 30;

export const themes = ['default', 'clean', 'striped', 'bordered', 'cards', 'ribbon', 'stacked'];
export const alignments = ['left', 'center', 'right'];

/** Stable key for repeater items — kept out of Edit.js so panels can import it. */
export const makeKey = (keyPrefix = 'ct') => `${keyPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const safeTheme = (value) => (themes.includes(value) ? value : 'default');
export const safeAlignment = (value) => (alignments.includes(value) ? value : 'center');

export const toPx = (value, fallback) => `${parseInt(value, 10) || fallback}px`;

/**
 * Reduce a bpl-tools Background object to one CSS value.
 *
 * Every consumer in style.scss uses the `background:` shorthand rather than
 * `background-color:`, so a custom property can legitimately hold a gradient
 * or an image shorthand — which is what lets these stay CSS variables instead
 * of needing their own rules. Plain strings pass through, so colour-only
 * content saved before this keeps working.
 */
export const bgValue = (bg, fallback = '') => {
	if (!bg) return fallback;
	if ('string' === typeof bg) return bg || fallback;

	const { type = 'solid', color = '', gradient = '', image = {} } = bg;

	if ('gradient' === type) return gradient || fallback;
	if ('image' === type) return image?.url ? `url('${image.url}') center center / cover no-repeat` : fallback;

	return color || fallback;
};

/**
 * Map the pre-nesting flat attributes onto the grouped shape.
 *
 * Content saved before the block adopted the image-hotspot convention still
 * holds `headerBg`, `cellPaddingV`, `tooltipColor` and 45 others at the top
 * level. Rather than drop them, they are folded into the group they now belong
 * to — a nested value that has already been set always wins, so this only
 * fills gaps and never fights the current controls.
 */
const pick = (a, b) => (undefined !== a && '' !== a && null !== a ? a : b);
const solid = (colour) => (colour ? { type: 'solid', color: colour } : undefined);
const boxOf = (v, h) => ((v || h) ? { top: v, right: h, bottom: v, left: h } : undefined);
const px = (n) => (n || 0 === n ? `${parseInt(n, 10)}px` : '');

export const migrate = (attributes = {}) => {
	const a = attributes;
	const has = (k) => undefined !== a[k] && '' !== a[k] && null !== a[k];

	// Nothing flat left over — already migrated content short-circuits.
	if (!['headerBg', 'cellPaddingV', 'tooltipColor', 'tableMaxWidth', 'theme'].some(has)) return a;

	const t = a.table || {};
	const h = a.header || {};
	const b = a.body || {};

	return {
		...a,
		content: {
			...(a.content || {}),
			caption: pick(a.content?.caption, a.caption),
			captionPosition: pick(a.content?.captionPosition, a.captionPosition),
			captionColor: pick(a.content?.captionColor, a.captionColor),
			captionTypo: a.content?.captionTypo || a.captionTypo,
			featuredLabel: pick(a.content?.featuredLabel, a.featuredLabel),
			featureColumnLabel: pick(a.content?.featureColumnLabel, a.featureColumnLabel)
		},
		table: {
			...t,
			theme: pick(t.theme, a.theme),
			alignment: pick(t.alignment, a.tableAlignment),
			cellBorderType: pick(t.cellBorderType, a.cellBorderType),
			stackOnMobile: pick(t.stackOnMobile, a.stackOnMobile),
			stickyHeader: pick(t.stickyHeader, a.stickyHeader),
			stickyFirstColumn: pick(t.stickyFirstColumn, a.stickyFirstColumn),
			showRowStripes: pick(t.showRowStripes, a.showRowStripes),
			borderColor: pick(t.borderColor, a.borderColor),
			border: t.border || a.tableBorder,
			shadow: t.shadow?.length ? t.shadow : a.tableShadow,
			bg: t.bg || a.tableBg,
			desktop: {
				...(t.desktop || {}),
				// 'above'/'inline' predate the four-way responsive control.
				iconPosition: pick(t.desktop?.iconPosition, { above: 'top', inline: 'left', hidden: 'hidden' }[a.headerIconPosition]),
				width: pick(t.desktop?.width, a.tableWidth?.desktop || px(a.tableMaxWidth)),
				radius: t.desktop?.radius?.top ? t.desktop.radius : (a.tableRadius?.desktop || boxOf(px(a.borderRadius), px(a.borderRadius)))
			}
		},
		header: {
			...h,
			normal: { bg: h.normal?.bg || a.headerBackground || solid(a.headerBg), color: pick(h.normal?.color, a.headerTextColor) },
			hover: { bg: h.hover?.bg || solid(a.headerHoverBg), color: pick(h.hover?.color, a.headerHoverColor) },
			typo: h.typo || a.headerTypo
		},
		body: {
			...b,
			bg: b.bg || a.bodyBackground || solid(a.bodyBg),
			color: pick(b.color, a.bodyTextColor),
			typo: b.typo || a.bodyTypo,
			desktop: { padding: b.desktop?.padding?.top ? b.desktop.padding : (a.cellPadding?.desktop || boxOf(px(a.cellPaddingV), px(a.cellPaddingH))) }
		},
		rowLabel: {
			...(a.rowLabel || {}),
			bg: a.rowLabel?.bg || a.rowLabelBackground || solid(a.rowLabelBg),
			color: pick(a.rowLabel?.color, a.rowLabelColor),
			typo: a.rowLabel?.typo || a.rowLabelTypo
		},
		rowColors: {
			...(a.rowColors || {}),
			odd: a.rowColors?.odd || a.rowOdd,
			even: a.rowColors?.even || a.rowEven,
			hover: a.rowColors?.hover || a.rowHover,
			stripe: a.rowColors?.stripe || a.rowStripeBackground || solid(a.rowStripeBg),
			transition: pick(a.rowColors?.transition, a.transition)
		},
		featured: {
			...(a.featured || {}),
			bg: a.featured?.bg || a.featuredBackground || solid(a.featuredBg),
			color: pick(a.featured?.color, a.featuredTextColor),
			columnBg: a.featured?.columnBg || a.featuredColBackground || solid(a.featuredColBg),
			labelBg: a.featured?.labelBg || a.featuredLabelBackground || solid(a.featuredLabelBg),
			labelColor: pick(a.featured?.labelColor, a.featuredLabelColor)
		},
		icons: {
			...(a.icons || {}),
			check: pick(a.icons?.check, a.checkIcon),
			cross: pick(a.icons?.cross, a.crossIcon),
			checkSvg: pick(a.icons?.checkSvg, a.checkIconSvg),
			crossSvg: pick(a.icons?.crossSvg, a.crossIconSvg),
			checkColor: pick(a.icons?.checkColor, a.checkColor),
			crossColor: pick(a.icons?.crossColor, a.crossColor),
			desktop: { size: pick(a.icons?.desktop?.size, a.iconSizes?.desktop || px(a.iconSize)) }
		},
		tooltip: {
			...(a.tooltip || {}),
			bg: a.tooltip?.bg || a.tooltipBackground,
			color: pick(a.tooltip?.color, a.tooltipColor),
			typo: a.tooltip?.typo || a.tooltipTypo,
			arrow: pick(a.tooltip?.arrow, a.tooltipArrow),
			underline: pick(a.tooltip?.underline, a.tooltipUnderline),
			shadow: a.tooltip?.shadow?.length ? a.tooltip.shadow : a.tooltipShadow,
			desktop: {
				width: pick(a.tooltip?.desktop?.width, a.tooltipWidth?.desktop),
				padding: a.tooltip?.desktop?.padding?.top ? a.tooltip.desktop.padding : a.tooltipPadding?.desktop,
				radius: a.tooltip?.desktop?.radius?.top ? a.tooltip.desktop.radius : a.tooltipRadius?.desktop
			}
		}
	};
};

/** Wrapper classes, shared so the editor and front end can never diverge. */
export const wrapperClasses = (attributes = {}) => {
	const t = migrate(attributes).table || {};

	return [
		`${P}-block`,
		`${P}-theme--${safeTheme(t.theme)}`,
		`${P}-align--${safeAlignment(t.alignment)}`,
		t.showRowStripes ? 'has-row-stripes' : '',
		t.stickyHeader ? 'has-sticky-header' : '',
		false === t.stickyFirstColumn ? '' : 'has-sticky-first-col',
		t.stackOnMobile ? 'is-stacked-mobile' : ''
	].filter(Boolean).join(' ');
};

export const defaultCaption = () => __('Feature comparison across plans', 'b-blocks');
