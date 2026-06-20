/**
 * Shared style helpers for the Parallax Section block.
 *
 * `buildSectionCss` produces the per-instance scoped CSS string used by the
 * editor preview. render.php emits an equivalent string server-side so the
 * frontend matches the editor exactly.
 */

const clamp = (n, min, max, fallback) => {
	const v = parseInt(n, 10);
	if (Number.isNaN(v)) return fallback;
	return Math.max(min, Math.min(max, v));
};

export const valignToFlex = (v) => {
	if (v === 'top') return 'flex-start';
	if (v === 'bottom') return 'flex-end';
	return 'center';
};

// Allow a small, safe subset of CSS length units for min-height values.
export const sanitizeLength = (value, fallback = '') => {
	const v = String(value || '').trim();
	if (v === '') return fallback;
	if (/^[0-9]+(\.[0-9]+)?(px|vh|vw|rem|em|%)$/.test(v)) return v;
	return fallback;
};

const POSITIONS = [
	'center center',
	'center top',
	'center bottom',
	'left center',
	'left top',
	'left bottom',
	'right center',
	'right top',
	'right bottom',
];

export const sanitizePosition = (value) =>
	POSITIONS.includes(value) ? value : 'center center';

export const buildSectionCss = (id, attrs) => {
	const {
		bgImageUrl = '',
		bgImagePosition = 'center center',
		parallaxMode = 'scroll',
		minHeight = '400px',
		minHeightTablet = '',
		minHeightMobile = '',
		verticalAlign = 'center',
		contentMaxWidth = 1200,
		paddingTop = 80,
		paddingBottom = 80,
		paddingTopMobile = 48,
		paddingBottomMobile = 48,
		hasOverlay = true,
		overlayColor = '#000000',
		overlayOpacity = 40,
		overlayGradient = '',
		bgColor = '#1a1a2e',
		contentAlign = 'center',
	} = attrs;

	const sel = `#${id}`;
	const minH = sanitizeLength(minHeight, '400px');
	const minHTablet = sanitizeLength(minHeightTablet, '');
	const minHMobile = sanitizeLength(minHeightMobile, '');
	const maxW = clamp(contentMaxWidth, 0, 1920, 1200);
	const padTop = clamp(paddingTop, 0, 300, 80);
	const padBottom = clamp(paddingBottom, 0, 300, 80);
	const padTopMobile = clamp(paddingTopMobile, 0, 200, 48);
	const padBottomMobile = clamp(paddingBottomMobile, 0, 200, 48);
	const overlayAlpha = Math.max(0, Math.min(1, clamp(overlayOpacity, 0, 100, 40) / 100));
	const position = sanitizePosition(bgImagePosition);
	const textAlign = ['left', 'center', 'right'].includes(contentAlign) ? contentAlign : 'center';

	let css = '';

	// Section wrapper.
	css += `${sel}{position:relative;width:100%;overflow:hidden;display:flex;flex-direction:column;justify-content:${valignToFlex(verticalAlign)};`;
	if (bgColor) css += `background-color:${bgColor};`;
	css += `min-height:${minH};box-sizing:border-box;}`;

	// Background image layer.
	css += `${sel} .bb-px-bg{position:absolute;inset:0;z-index:0;`;
	if (bgImageUrl) {
		css += `background-image:url("${bgImageUrl}");background-size:cover;background-position:${position};background-repeat:no-repeat;`;
	}
	if (parallaxMode === 'fixed') {
		css += 'background-attachment:fixed;';
	}
	if (parallaxMode === 'scroll') {
		// Oversize so the translate travel never reveals an edge gap.
		css += 'top:-5%;height:110%;will-change:transform;transform:translate3d(0,var(--bblocks-parallax-offset,0px),0);';
	}
	css += '}';

	// Overlay.
	if (hasOverlay) {
		const overlayBg = overlayGradient ? overlayGradient : overlayColor;
		css += `${sel} .bb-px-overlay{position:absolute;inset:0;z-index:1;pointer-events:none;`;
		if (overlayBg) css += `background:${overlayBg};`;
		css += `opacity:${overlayAlpha};}`;
	}

	// Content.
	css += `${sel} .bb-px-content{position:relative;z-index:2;width:100%;margin-left:auto;margin-right:auto;box-sizing:border-box;`;
	css += `text-align:${textAlign};padding-top:${padTop}px;padding-bottom:${padBottom}px;`;
	css += 'padding-left:24px;padding-right:24px;';
	if (maxW > 0) css += `max-width:${maxW}px;`;
	css += '}';

	// Tablet.
	if (minHTablet) {
		css += `@media (max-width:1024px){${sel}{min-height:${minHTablet};}}`;
	}

	// Mobile.
	css += '@media (max-width:767px){';
	css += `${sel} .bb-px-content{padding-top:${padTopMobile}px;padding-bottom:${padBottomMobile}px;}`;
	if (minHMobile) css += `${sel}{min-height:${minHMobile};}`;
	css += '}';

	return css;
};
