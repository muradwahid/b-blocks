/**
 * Builds the per-instance inline CSS for an Image Accordion block.
 *
 * Shared by the editor (Edit.js) so the canvas preview mirrors the frontend
 * output produced by render.php. All numeric values are clamped to their safe
 * ranges before being written into CSS custom properties.
 */
const clamp = ( value, min, max, fallback ) => {
	const num = parseInt( value, 10 );
	if ( Number.isNaN( num ) ) return fallback;
	return Math.max( min, Math.min( max, num ) );
};

const px = ( value, fallback ) => {
	const raw = ( value === undefined || value === null || value === '' ) ? fallback : value;
	return /^\d+$/.test( String( raw ) ) ? `${ raw }px` : String( raw );
};

export const buildImageAccordionCss = ( id, attributes ) => {
	const {
		minHeight, collapsedWidth, animationDuration, overlayColor,
		titleColor, titleFontSize = {}, titleFontWeight,
		descColor, descFontSize = {},
		btnBg, btnColor, btnBgHover, btnColorHover,
		btnPaddingV, btnPaddingH, btnRadius, btnFontSize,
		gapBetweenPanels, borderRadius, mobileBreakpoint, maxWidth, alignment
	} = attributes;

	const maxW = clamp( maxWidth, 0, 1600, 0 );
	const align = alignment === 'left' ? 'flex-start' : ( alignment === 'right' ? 'flex-end' : 'center' );

	const vars = [
		`--bb-ia-min-height: ${ clamp( minHeight, 200, 900, 480 ) }px`,
		`--bb-ia-collapsed-w: ${ clamp( collapsedWidth, 40, 200, 80 ) }px`,
		`--bb-ia-duration: ${ clamp( animationDuration, 0, 1000, 400 ) }ms`,
		`--bb-ia-overlay: ${ overlayColor || 'rgba(0,0,0,0.45)' }`,
		`--bb-ia-title-color: ${ titleColor || '#ffffff' }`,
		`--bb-ia-title-size-d: ${ px( titleFontSize.desktop, '22px' ) }`,
		`--bb-ia-title-size-t: ${ px( titleFontSize.tablet, '18px' ) }`,
		`--bb-ia-title-size-m: ${ px( titleFontSize.mobile, '16px' ) }`,
		`--bb-ia-title-weight: ${ titleFontWeight || '700' }`,
		`--bb-ia-desc-color: ${ descColor || 'rgba(255,255,255,0.85)' }`,
		`--bb-ia-desc-size-d: ${ px( descFontSize.desktop, '15px' ) }`,
		`--bb-ia-desc-size-t: ${ px( descFontSize.tablet, '14px' ) }`,
		`--bb-ia-desc-size-m: ${ px( descFontSize.mobile, '14px' ) }`,
		`--bb-ia-btn-bg: ${ btnBg || '#ffffff' }`,
		`--bb-ia-btn-color: ${ btnColor || '#111111' }`,
		`--bb-ia-btn-bg-hover: ${ btnBgHover || '#f0f0f0' }`,
		`--bb-ia-btn-color-hover: ${ btnColorHover || '#111111' }`,
		`--bb-ia-btn-pv: ${ clamp( btnPaddingV, 4, 24, 10 ) }px`,
		`--bb-ia-btn-ph: ${ clamp( btnPaddingH, 8, 48, 22 ) }px`,
		`--bb-ia-btn-radius: ${ clamp( btnRadius, 0, 32, 4 ) }px`,
		`--bb-ia-btn-size: ${ clamp( btnFontSize, 12, 24, 14 ) }px`,
		`--bb-ia-gap: ${ clamp( gapBetweenPanels, 0, 24, 4 ) }px`,
		`--bb-ia-radius: ${ clamp( borderRadius, 0, 32, 8 ) }px`,
		`--bb-ia-breakpoint: ${ clamp( mobileBreakpoint, 480, 1024, 768 ) }px`,
		`--bb-ia-max-width: ${ maxW === 0 ? '100%' : `${ maxW }px` }`,
		`--bb-ia-align: ${ align }`
	].join( ';' );

	return `#${ id }.bb-ia{${ vars };}`;
};
