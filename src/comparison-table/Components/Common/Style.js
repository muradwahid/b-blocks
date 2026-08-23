import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { bgValue, migrate, P } from '../../utils/data';

/**
 * Every attribute-derived value for the block, scoped to the block id and
 * shared by the editor and the front end.
 *
 * Two layers live here. The legacy flat attributes still drive the CSS custom
 * properties the themes read; the grouped controls adopted from the data-table
 * block are emitted afterwards so they win where the author has set them, and
 * emit nothing at all where they haven't.
 */
const Style = ({ attributes, id, isBackend = false }) => {
	// migrate() folds the pre-nesting flat keys into the grouped shape, so
	// everything below reads one convention regardless of when the block was
	// saved. See utils/data.js.
	const attrs = migrate(attributes);

	const {
		advanced,
		columns = [],
		content = {},
		table = {},
		header = {},
		body = {},
		rowLabel = {},
		rowColors = {},
		featured = {},
		icons = {},
		tooltip = {}
	} = attrs;

	const cellBorderType = table.cellBorderType || 'collapse';
	const tableBorder = table.border || {};
	const tableShadow = table.shadow || [];
	const tableBg = table.bg || {};
	const headerTypo = header.typo || {};
	const headerHoverBg = bgValue(header.hover?.bg);
	const headerHoverColor = header.hover?.color || '';
	const bodyTypo = body.typo || {};
	const rowOdd = rowColors.odd || {};
	const rowEven = rowColors.even || {};
	const rowHover = rowColors.hover || {};
	const transition = rowColors.transition ?? 0.2;
	const captionPosition = content.captionPosition || 'hidden';
	const captionTypo = content.captionTypo || {};
	const captionColor = content.captionColor || '';
	const tooltipBackground = tooltip.bg || {};
	const tooltipColor = tooltip.color || '';
	const tooltipTypo = tooltip.typo || {};
	const tooltipShadow = tooltip.shadow || [];
	const tooltipArrow = tooltip.arrow;
	const tooltipUnderline = tooltip.underline;
	const rowLabelTypo = rowLabel.typo || {};

	// Where the header icon sits relative to its label, per breakpoint.
	const ICON_FLOW = { top: 'column', bottom: 'column-reverse', left: 'row', right: 'row-reverse' };

	const mainSl = `#${id}`;
	const scrollSl = `${mainSl} .${P}-scroll`;
	const tableSl = `${mainSl} .${P}-table`;
	const headSl = `${tableSl} thead th`;
	const cellSl = `${tableSl} tbody td, ${tableSl} tbody th`;
	const rowSl = `${tableSl} tbody tr`;
	const captionSl = `${tableSl} caption`;
	const rowLabelSl = `${tableSl} tbody th.${P}-row-label`;
	const tipSl = `${mainSl} .${P}-tooltip`;
	const bubbleSl = `${mainSl} .${P}-tooltip-bubble`;
	const arrowSl = `${mainSl} .${P}-tooltip-arrow`;

	// Direct declarations, no custom-property indirection — the block now emits
	// what data-table does. style.scss carries the same values as literal
	// defaults, and the themes override with !important, so a theme's palette
	// wins over these by design.
	const surface = {
		headerBg: bgValue(header.normal?.bg),
		headerText: header.normal?.color,
		featuredBg: bgValue(featured.bg),
		featuredText: featured.color,
		featuredColBg: bgValue(featured.columnBg),
		labelBg: bgValue(featured.labelBg),
		labelText: featured.labelColor,
		rowLabelBg: bgValue(rowLabel.bg),
		rowLabelText: rowLabel.color,
		stripeBg: bgValue(rowColors.stripe),
		bodyBg: bgValue(body.bg),
		bodyText: body.color,
		checkColor: icons.checkColor,
		crossColor: icons.crossColor,
		borderColor: table.borderColor
	};

	const themeSl = `${mainSl}.${P}-theme--${table.theme || 'default'}`;

	// Per-column accent, emitted as real declarations rather than a custom
	// property. Only the themes that actually use an accent get rules, and they
	// carry !important because the theme structure in style.scss does.
	const ACCENT_THEMES = {
		ribbon: (sl, colour) => `
			${sl} thead th[data-col="${'%i%'}"]{ background: ${colour} !important; }`,
		stacked: (sl, colour) => `
			${sl} thead th[data-col="${'%i%'}"]{ background: ${colour} !important; }`
	};

	const accentTemplate = ACCENT_THEMES[table.theme];

	// Theme rules that depend on the palette. These used to be hardcoded hexes
	// in style.scss, which meant the Colors panels could not reach them; they
	// now derive from the same attributes as everything else. style.scss keeps
	// only neutral elevation shadows and pure geometry.
	const line = surface.borderColor || '#e2e8f0';
	const accent = surface.featuredBg || '#2563eb';
	const soft = (colour, pct) => `color-mix(in srgb, ${colour} ${pct}%, transparent)`;

	const THEME_DYNAMIC = {
		striped: () => `
			${themeSl} ${tableSl} thead th{ border-bottom: 3px solid ${accent} !important; }`,

		bordered: () => `
			${themeSl} ${scrollSl}{ border-width: 2px !important; border-color: ${line} !important; }
			${themeSl} ${tableSl} thead th,
			${themeSl} ${tableSl} tbody td,
			${themeSl} ${tableSl} tbody th{ border: 2px solid ${line} !important; }`,

		cards: () => `
			${themeSl} ${tableSl} tbody td,
			${themeSl} ${tableSl} tbody th{
				border-bottom: 1px solid ${line} !important;
				border-bottom-color: ${soft(line, 70)} !important;
				box-shadow: 0 0 0 1px ${line};
				box-shadow: 0 0 0 1px ${soft(line, 45)};
			}
			${themeSl} ${tableSl} thead th.is-featured{ box-shadow: 0 10px 26px ${soft(accent, 24)} !important; }
			${themeSl} ${tableSl} td.is-featured{
				box-shadow: 0 0 0 1px ${accent} !important;
				box-shadow: 0 0 0 1px ${soft(accent, 35)} !important;
			}`,

		clean: () => `
			${themeSl} ${tableSl} thead th{ border-bottom: 1px solid ${line} !important; }
			${themeSl} ${tableSl} tbody tr:not(:last-child) td,
			${themeSl} ${tableSl} tbody tr:not(:last-child) th{
				border-bottom: 1px solid ${line} !important;
				border-bottom-color: ${soft(line, 55)} !important;
			}
			${themeSl} ${tableSl} thead th.is-featured{ border-top: 3px solid ${accent} !important; }`
	};

	const themeCSS = (THEME_DYNAMIC[table.theme] || (() => ''))();

	// Header icon colour is per column and independent of the accent themes,
	// so it is emitted for every theme rather than only the accent ones.
	const iconColourCSS = columns
		.map((column, index) => (column?.iconColor
			? `${mainSl} [data-col="${index}"] .${P}-col__icon{ color: ${column.iconColor}; }`
			: ''))
		.join('');

	const accentCSS = !accentTemplate ? '' : columns
		.map((column, index) => (column?.accent
			? accentTemplate(themeSl, column.accent).replace(/%i%/g, index)
			: ''))
		.join('');

	// Responsive: table width, corner radius and cell padding.
	const responsive = (device) => `
		${scrollSl}{ ${isValidCSS('max-width', table?.[device]?.width)} }

		${scrollSl}{ ${isValidCSS('border-radius', getBoxCSS(table?.[device]?.radius))} }

		${headSl}, ${cellSl}{ ${isValidCSS('padding', getBoxCSS(body?.[device]?.padding))} }

		${mainSl} .${P}-cell-icon{
			${isValidCSS('width', icons?.[device]?.size)}
			${isValidCSS('height', icons?.[device]?.size)}
		}

		${mainSl} .${P}-col__icon{
			${isValidCSS('width', icons?.[device]?.headerSize)}
			${isValidCSS('height', icons?.[device]?.headerSize)}
			${'hidden' === table?.[device]?.iconPosition ? 'display: none;' : ''}
		}

		${mainSl} .${P}-col__head{
			${isValidCSS('flex-direction', ICON_FLOW[table?.[device]?.iconPosition])}
		}

		${bubbleSl}{
			${isValidCSS('padding', getBoxCSS(tooltip?.[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(tooltip?.[device]?.radius))}
			${isValidCSS('max-width', tooltip?.[device]?.width)}
		}
	`;

	return <style
		dangerouslySetInnerHTML={{
			__html: `
			${getTypoCSS('', headerTypo).googleFontLink}
			${getTypoCSS('', bodyTypo).googleFontLink}
			${getTypoCSS('', captionTypo).googleFontLink}
			${getTypoCSS('', tooltipTypo).googleFontLink}
			${getTypoCSS('', rowLabelTypo).googleFontLink}

			${scrollSl}{
				${isValidCSS('border-color', surface.borderColor)}
				${isValidCSS('background', surface.bodyBg)}
			}

			${tableSl}{
				${isValidCSS('color', surface.bodyText)}
				${isValidCSS('background', surface.bodyBg)}
			}

			${headSl}{
				${isValidCSS('background', surface.headerBg)}
				${isValidCSS('color', surface.headerText)}
			}

			${headSl}.is-featured{
				${isValidCSS('background', surface.featuredBg)}
				${isValidCSS('color', surface.featuredText)}
			}

			${mainSl} .${P}-col__featured-badge{
				${isValidCSS('background', surface.labelBg)}
				${isValidCSS('color', surface.labelText)}
			}

			${cellSl}{
				${isValidCSS('border-color', surface.borderColor)}
			}

			${tableSl} tbody td.is-featured{ ${isValidCSS('background', surface.featuredColBg)} }

			${rowLabelSl}{
				${isValidCSS('background', surface.rowLabelBg)}
				${isValidCSS('color', surface.rowLabelText)}
			}
			${getTypoCSS(rowLabelSl, rowLabelTypo).styles}

			${mainSl}.has-sticky-first-col ${tableSl} tbody th.${P}-row-label{ ${isValidCSS('background', surface.bodyBg)} }
			${mainSl}.has-sticky-first-col ${tableSl} thead th:first-child{ ${isValidCSS('background', surface.headerBg)} }

			${mainSl}.has-row-stripes ${tableSl} tbody tr:nth-child(even) td,
			${mainSl}.has-row-stripes ${tableSl} tbody tr:nth-child(even) th{ ${isValidCSS('background', surface.stripeBg)} }

			${mainSl} .${P}-cell-icon.is-yes svg{ ${isValidCSS('color', surface.checkColor)} }
			${mainSl} .${P}-cell-icon.is-no svg{ ${isValidCSS('color', surface.crossColor)} }

			${tableSl}{
				${isValidCSS('border-collapse', 'separate' === cellBorderType ? 'separate' : 'collapse')}
			}

			${themeCSS}
			${iconColourCSS}
			${accentCSS}

			${scrollSl}{
				${getBorderBoxCSS(tableBorder)}
				${isValidCSS('box-shadow', getMultiShadowCSS(tableShadow))}
				${getBackgroundCSS(tableBg)}
			}

			${getTypoCSS(headSl, headerTypo).styles}
			${getTypoCSS(cellSl, bodyTypo).styles}

			${headSl}:hover{
				${isValidCSS('background', headerHoverBg)}
				${isValidCSS('color', headerHoverColor)}
			}

			/* Odd / even row colouring, adopted from data-table's oddCell /
			   evenCell pair — finer than the single stripe colour the block
			   had, and it beats the stripe because it is emitted later. */
			${rowSl}:nth-child(odd) td, ${rowSl}:nth-child(odd) th{
				${isValidCSS('background', bgValue(rowOdd?.bg))}
				${isValidCSS('color', rowOdd?.color)}
			}

			${rowSl}:nth-child(even) td, ${rowSl}:nth-child(even) th{
				${isValidCSS('background', bgValue(rowEven?.bg))}
				${isValidCSS('color', rowEven?.color)}
			}

			${(bgValue(rowHover?.bg) || rowHover?.color) ? `${rowSl}:hover td, ${rowSl}:hover th{
				${isValidCSS('background', bgValue(rowHover?.bg))}
				${isValidCSS('color', rowHover?.color)}
			}` : ''}

			${headSl}, ${cellSl}{
				${isValidCSS('transition', `background ${transition}s, color ${transition}s`)}
			}

			/* ---- Tooltip ---------------------------------------------------
			   style.scss carries the structure; these override its hardcoded
			   look. The block's <style> sits in the body and uses an id, so it
			   outranks view.css on both order and specificity. */
			${bubbleSl}{
				${isValidCSS('background', bgValue(tooltipBackground))}
				${isValidCSS('color', tooltipColor)}
				${isValidCSS('box-shadow', getMultiShadowCSS(tooltipShadow))}
			}
			${getTypoCSS(bubbleSl, tooltipTypo).styles}

			${arrowSl}{
				${isValidCSS('background', bgValue(tooltipBackground))}
				${false === tooltipArrow ? 'display: none;' : ''}
			}

			${false === tooltipUnderline ? `${tipSl}{ text-decoration: none; }` : ''}

			/* The caption is screen-reader-only unless the author positions it. */
			${'hidden' !== captionPosition ? `${captionSl}{
				position: static;
				width: auto;
				height: auto;
				margin: 0;
				clip: auto;
				clip-path: none;
				overflow: visible;
				caption-side: ${'top' === captionPosition ? 'top' : 'bottom'};
				padding: 8px 0;
				${isValidCSS('color', captionColor)}
			}` : ''}
			${getTypoCSS(captionSl, captionTypo).styles}

			${responsive('desktop')}
			${tabBreakpoint}{ ${responsive('tablet')} }
			${mobileBreakpoint}{ ${responsive('mobile')} }

			${generateCSS(id, advanced, isBackend, false)}
			`
		}}
	/>;
};
export default Style;
