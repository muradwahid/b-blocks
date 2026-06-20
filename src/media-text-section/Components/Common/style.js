/**
 * Shared style helpers for the Media & Text Section block.
 *
 * `buildSectionCss` produces the per-instance scoped CSS string used by the
 * editor preview. render.php emits an equivalent string server-side so the
 * frontend matches the editor exactly.
 */

const RATIOS = {
	'30-70': [30, 70],
	'40-60': [40, 60],
	'50-50': [50, 50],
	'60-40': [60, 40],
	'70-30': [70, 30],
};

export const ratioToPercents = (ratio) => {
	const [left, right] = RATIOS[ratio] || RATIOS['50-50'];
	return { left, right };
};

const valign = (v) => {
	if (v === 'top') return 'flex-start';
	if (v === 'bottom') return 'flex-end';
	return 'center';
};

const clamp = (n, min, max, fallback) => {
	const v = parseInt(n, 10);
	if (Number.isNaN(v)) return fallback;
	return Math.max(min, Math.min(max, v));
};

export const buildSectionCss = (id, attrs) => {
	const {
		splitRatio,
		minHeight = 0,
		mediaFit = 'cover',
		mediaFocal = { x: 0.5, y: 0.5 },
		stickyMedia = false,
		mediaOverlayColor = '',
		mediaOverlayOpacity = 0,
		imageBorderRadius = 0,
		imageBoxShadow = false,
		mediaPanelBg = '',
		contentPanelBg = '',
		sectionBg = '',
		sectionBgGradient = '',
		verticalAlign = 'center',
		contentPaddingTop = 40,
		contentPaddingBottom = 40,
		contentPaddingLeft = 40,
		contentPaddingRight = 40,
		mobileStackOrder = 'media-first',
		gapBetweenPanels = 0,
	} = attrs;

	const { left, right } = ratioToPercents(splitRatio);
	const sel = `#${id}`;
	const minH = clamp(minHeight, 0, 1200, 0);
	const gap = clamp(gapBetweenPanels, 0, 80, 0);
	const radius = clamp(imageBorderRadius, 0, 64, 0);
	const overlayAlpha = Math.max(0, Math.min(1, clamp(mediaOverlayOpacity, 0, 100, 0) / 100));
	const fx = mediaFocal && typeof mediaFocal.x === 'number' ? mediaFocal.x : 0.5;
	const fy = mediaFocal && typeof mediaFocal.y === 'number' ? mediaFocal.y : 0.5;

	let css = '';

	// Section wrapper background.
	const bg = sectionBgGradient ? sectionBgGradient : sectionBg;
	if (bg) css += `${sel}{background:${bg};}`;

	// Inner flex layout.
	css += `${sel} .bb-mts-inner{display:flex;flex-direction:row;align-items:${valign(verticalAlign)};gap:${gap}px;width:100%;`;
	if (minH > 0) css += `min-height:${minH}px;`;
	css += '}';
	css += `${sel} .bb-mts-inner.is-reverse{flex-direction:row-reverse;}`;

	// Media panel.
	css += `${sel} .bb-mts-media{position:relative;flex:0 0 ${left}%;max-width:${left}%;align-self:stretch;overflow:hidden;`;
	if (mediaPanelBg) css += `background:${mediaPanelBg};`;
	css += '}';

	// Sticky media.
	if (stickyMedia) {
		css += `${sel} .bb-mts-inner.has-sticky .bb-mts-media{position:sticky;top:0;align-self:flex-start;}`;
	}

	// Media element.
	css += `${sel} .bb-mts-media-el{display:block;width:100%;height:100%;min-height:${minH > 0 ? minH : 280}px;object-fit:${mediaFit};`;
	if (mediaFit === 'cover') css += `object-position:${Math.round(fx * 100)}% ${Math.round(fy * 100)}%;`;
	if (radius > 0) css += `border-radius:${radius}px;`;
	if (imageBoxShadow) css += 'box-shadow:0 18px 40px rgba(0,0,0,0.18);';
	css += '}';

	// Overlay.
	if (mediaOverlayColor && overlayAlpha > 0) {
		css += `${sel} .bb-mts-overlay{position:absolute;inset:0;pointer-events:none;background:${mediaOverlayColor};opacity:${overlayAlpha};`;
		if (radius > 0) css += `border-radius:${radius}px;`;
		css += '}';
	}

	// Content panel.
	css += `${sel} .bb-mts-content{flex:0 0 ${right}%;max-width:${right}%;box-sizing:border-box;padding:${clamp(contentPaddingTop, 0, 200, 40)}px ${clamp(contentPaddingRight, 0, 200, 40)}px ${clamp(contentPaddingBottom, 0, 200, 40)}px ${clamp(contentPaddingLeft, 0, 200, 40)}px;`;
	if (contentPanelBg) css += `background:${contentPanelBg};`;
	css += '}';

	// Mobile.
	css += '@media (max-width:767px){';
	css += `${sel} .bb-mts-inner,${sel} .bb-mts-inner.is-reverse{flex-direction:${mobileStackOrder === 'content-first' ? 'column-reverse' : 'column'};}`;
	css += `${sel} .bb-mts-media,${sel} .bb-mts-content{flex:0 0 100%;max-width:100%;}`;
	css += `${sel} .bb-mts-inner.has-sticky .bb-mts-media{position:static;}`;
	css += '}';

	return css;
};
