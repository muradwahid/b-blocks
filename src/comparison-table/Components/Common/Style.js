import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { mobileBreakpoint, tabBreakpoint } from '../../../../../bpl-tools/utils/data';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getMultiShadowCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import { bgValue, migrate, P, splitColumns } from '../../utils/data';

const Style = ({ attributes, id, isBackend = false }) => {

	const attrs = migrate(attributes);

	const { feature, plans } = splitColumns(attrs.columns || []);

	const keyedColumns = [
		...(feature ? [{ column: feature, key: 'feature' }] : []),
		...plans.map((column, index) => ({ column, key: index }))
	];

	const {
		advanced,
		content = {},
		table = {},
		header = {},
		body = {},
		rowLabel = {},
		rowColors = {},
		featured = {},
		icons = {},
		tooltip = {},
		cta = {}
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

	const ICON_FLOW = { top: 'column', bottom: 'column-reverse', left: 'row', right: 'row-reverse' };

	const mainSl = `#${id}`;
	const scrollSl = `${mainSl} .${P}-scroll`;
	const tableSl = `${mainSl} .${P}-table`;
	const headSl = `${tableSl} thead th`;
	// The footer's cells take the same border colour as the body's — without
	// it they keep the browser default and read as a different table.
	const cellSl = `${tableSl} tbody td, ${tableSl} tbody th, ${tableSl} tfoot td, ${tableSl} tfoot th`;
	const rowSl = `${tableSl} tbody tr`;
	const captionSl = `${tableSl} caption`;
	const rowLabelSl = `${tableSl} tbody th.${P}-row-label`;
	const ctaSl = `${mainSl} .${P}-col__cta`;

	const CTA_ALIGN = {
		left: 'margin-left: 0; margin-right: auto;',
		center: 'margin-left: auto; margin-right: auto;',
		right: 'margin-left: auto; margin-right: 0;'
	};
	const tipSl = `${mainSl} .${P}-tooltip`;
	const bubbleSl = `${mainSl} .${P}-tooltip-bubble`;
	const arrowSl = `${mainSl} .${P}-tooltip-arrow`;


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

	const line = surface.borderColor || '#e2e8f0';
	const accent = surface.featuredBg || '#2563eb';
	const soft = (colour, pct) => `color-mix(in srgb, ${colour} ${pct}%, transparent)`;

	const THEME_DYNAMIC = {


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

	};

	const themeCSS = (THEME_DYNAMIC[table.theme] || (() => ''))();

	const columnCtaCSS = keyedColumns.map(({ column, key }) => {
		const c = column?.cta;
		if (!c) return '';

		const sl = `${mainSl} [data-col="${key}"] .${P}-col__cta`;

		const speed = c.transition;
		const body = [
			isValidCSS('background', bgValue(c.normal?.bg || c.bg)),
			isValidCSS('color', c.normal?.color || c.color),
			getBorderBoxCSS(c.border),
			isValidCSS('padding', getBoxCSS(c.padding)),
			isValidCSS('border-radius', getBoxCSS(c.radius)),
			('' === speed || undefined === speed || null === speed)
				? ''
				: `transition: background ${speed}s ease, color ${speed}s ease, border-color ${speed}s ease;`
		].filter(Boolean).join('');

		const hover = [
			isValidCSS('background', bgValue(c.hover?.bg)),
			isValidCSS('color', c.hover?.color)
		].filter(Boolean).join('');

		const typo = Object.keys(c.typo || {}).length ? getTypoCSS(sl, c.typo).styles : '';

		return `${body ? `${sl}{ ${body} }` : ''}${hover ? `${sl}:hover, ${sl}:focus-visible{ ${hover} }` : ''}${typo}`;
	}).join('');

	const iconColourCSS = keyedColumns
		.map(({ column, key }) => (column?.iconColor
			? `${mainSl} [data-col="${key}"] .${P}-col__icon{ color: ${column.iconColor}; }`
			: ''))
		.join('');

	const responsive = (device) => `
		${scrollSl}{
			${isValidCSS('max-width', table?.[device]?.width)}
			${isValidCSS('border-radius', getBoxCSS(table?.[device]?.radius))}
		}

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

		${keyedColumns.map(({ column, key }) => (column?.iconSize?.[device]
			? `${mainSl} [data-col="${key}"] .${P}-col__icon{ width: ${column.iconSize[device]}; height: ${column.iconSize[device]}; }`
			: '')).join('')}

		${ctaSl}{
			${isValidCSS('padding', getBoxCSS(cta?.[device]?.padding))}
			${isValidCSS('border-radius', getBoxCSS(cta?.[device]?.radius))}
			${isValidCSS('margin', getBoxCSS(cta?.[device]?.margin))}
			${/* After margin on purpose: alignment owns the horizontal axis, so
			     its auto values override whatever the margin box set. */''}
			${CTA_ALIGN[cta?.[device]?.alignment] || ''}
		}

		${keyedColumns.map(({ column, key }) => (CTA_ALIGN[column?.cta?.alignment?.[device]]
			? `${mainSl} [data-col="${key}"] .${P}-col__cta{ ${CTA_ALIGN[column.cta.alignment[device]]} }`
			: '')).join('')}

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
			${getTypoCSS('', cta.typo).googleFontLink}

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

			${ctaSl}{
				${isValidCSS('background', bgValue(cta.normal?.bg))}
				${isValidCSS('color', cta.normal?.color)}
				${getBorderBoxCSS(cta.border)}
				${isValidCSS('transition', `background ${cta.transition ?? 0.2}s ease, color ${cta.transition ?? 0.2}s ease, border-color ${cta.transition ?? 0.2}s ease`)}
			}
			${getTypoCSS(ctaSl, cta.typo).styles}

			${ctaSl}:hover, ${ctaSl}:focus-visible{
				${isValidCSS('background', bgValue(cta.hover?.bg))}
				${isValidCSS('color', cta.hover?.color)}
			}

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
			${columnCtaCSS}
			${iconColourCSS}

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
