/**
 * Shared style helpers for the Sticky Sidebar block.
 *
 * `buildStickyCss` produces the per-instance scoped CSS string used by the
 * editor preview. render.php emits an equivalent string server-side so the
 * frontend matches the editor exactly.
 *
 * DOM source order is always: first grid child = main content, second grid
 * child = sidebar (so screen readers / keyboard users reach main first). The
 * visual side of the sidebar is controlled purely by the CSS `order` property,
 * so the columns are targeted positionally (`> *:nth-child(1|2)`) rather than
 * by class — this works identically in the editor (where InnerBlocks wraps the
 * children in block-editor chrome) and on the frontend.
 */

const RATIOS = {
	'25/75': [25, 75],
	'30/70': [30, 70],
	'35/65': [35, 65],
	'40/60': [40, 60],
	'50/50': [50, 50],
};

export const ratioToPercents = (ratio) => {
	const [sidebar, main] = RATIOS[ratio] || RATIOS['30/70'];
	return { sidebar, main };
};

const clamp = (n, min, max, fallback) => {
	const v = parseInt(n, 10);
	if (Number.isNaN(v)) return fallback;
	return Math.max(min, Math.min(max, v));
};

export const buildStickyCss = (id, attrs, editor = false) => {
	const {
		sidebarSide = 'right',
		splitRatio = '30/70',
		stickyTop = 32,
		stickyMaxHeight = 0,
		gap = 40,
		mobileStackOrder = 'main-first',
		mobileBreakpoint = 767,
		maxWidth = 0,
		align = 'center',
		mainBg = '',
		sidebarBg = '',
		mainPaddingV = 0,
		mainPaddingH = 0,
		sidebarPaddingV = 0,
		sidebarPaddingH = 0,
		sidebarBorderRadius = 0,
		sidebarBorderWidth = 0,
		sidebarBorderColor = '',
	} = attrs;

	const { sidebar: sidebarPct, main: mainPct } = ratioToPercents(splitRatio);
	const sel = `#${id}`;

	const top = clamp(stickyTop, 0, 200, 32);
	const maxH = clamp(stickyMaxHeight, 0, 1200, 0);
	const colGap = clamp(gap, 0, 120, 40);
	const bp = clamp(mobileBreakpoint, 480, 1024, 767);
	const mw = clamp(maxWidth, 0, 1600, 0);
	const mPv = clamp(mainPaddingV, 0, 96, 0);
	const mPh = clamp(mainPaddingH, 0, 96, 0);
	const sPv = clamp(sidebarPaddingV, 0, 96, 0);
	const sPh = clamp(sidebarPaddingH, 0, 96, 0);
	const sRadius = clamp(sidebarBorderRadius, 0, 48, 0);
	const sBorderW = clamp(sidebarBorderWidth, 0, 8, 0);

	const onRight = sidebarSide !== 'left';
	// grid-template-columns matches the visual order: left fraction first.
	const leftCol = onRight ? mainPct : sidebarPct;
	const rightCol = onRight ? sidebarPct : mainPct;
	// main = first child, sidebar = second child.
	const mainOrder = onRight ? 1 : 2;
	const sidebarOrder = onRight ? 2 : 1;

	// On the frontend the two column groups are direct children of `.bb-ss-grid`.
	// In the editor InnerBlocks wraps them in `.block-editor-block-list__layout`,
	// so the grid lives on that inner layout element instead.
	const gridSel = editor
		? `${sel} .bb-ss-grid .block-editor-block-list__layout`
		: `${sel} .bb-ss-grid`;
	const mainSel = `${gridSel} > *:nth-child(1)`;
	const sidebarSel = `${gridSel} > *:nth-child(2)`;

	let css = '';

	// Outer wrapper max-width + alignment.
	if (mw > 0) {
		let margin = '0 auto';
		if (align === 'left') margin = '0 auto 0 0';
		else if (align === 'right') margin = '0 0 0 auto';
		css += `${sel}{max-width:${mw}px;margin:${margin};}`;
	}

	// Grid layout.
	css += `${gridSel}{display:grid;grid-template-columns:${leftCol}fr ${rightCol}fr;gap:${colGap}px;align-items:start;width:100%;}`;

	// Main column (first child).
	css += `${mainSel}{order:${mainOrder};min-width:0;box-sizing:border-box;`;
	if (mPv > 0 || mPh > 0) css += `padding:${mPv}px ${mPh}px;`;
	if (mainBg) css += `background:${mainBg};`;
	css += '}';

	// Sidebar column (second child, sticky).
	css += `${sidebarSel}{order:${sidebarOrder};min-width:0;box-sizing:border-box;position:sticky;top:${top}px;align-self:start;`;
	if (sPv > 0 || sPh > 0) css += `padding:${sPv}px ${sPh}px;`;
	if (sidebarBg) css += `background:${sidebarBg};`;
	if (sRadius > 0) css += `border-radius:${sRadius}px;`;
	if (sBorderW > 0 && sidebarBorderColor) css += `border:${sBorderW}px solid ${sidebarBorderColor};`;
	if (maxH > 0) css += `max-height:${maxH}px;overflow-y:auto;`;
	css += '}';

	// Mobile stack.
	const mainMobileOrder = mobileStackOrder === 'sidebar-first' ? 2 : 1;
	const sidebarMobileOrder = mobileStackOrder === 'sidebar-first' ? 1 : 2;
	css += `@media (max-width:${bp}px){`;
	css += `${gridSel}{grid-template-columns:1fr;}`;
	css += `${mainSel}{order:${mainMobileOrder};}`;
	css += `${sidebarSel}{order:${sidebarMobileOrder};position:static;top:auto;max-height:none;overflow:visible;}`;
	css += '}';

	return css;
};
