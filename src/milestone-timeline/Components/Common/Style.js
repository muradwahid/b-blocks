/**
 * Builds the per-instance inline CSS for a Milestone Timeline block.
 *
 * Shared by the editor (Edit.js) so the canvas preview matches the frontend
 * output produced by render.php. All values are clamped to their safe ranges
 * before being written into CSS custom properties scoped under the wrapper id.
 */
const clamp = ( value, min, max, fallback ) => {
	const num = parseInt( value, 10 );
	if ( Number.isNaN( num ) ) return fallback;
	return Math.max( min, Math.min( max, num ) );
};

const SHADOW_PRESETS = {
	none: 'none',
	small: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
	medium: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
	large: '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)'
};

export const shadowFor = ( preset ) =>
	SHADOW_PRESETS[ preset ] || SHADOW_PRESETS.none;

export const buildMilestoneTimelineCss = ( id, attributes ) => {
	const {
		lineColor, lineHeight, nodeSize, nodeColor, nodeIconColor,
		dateColor, dateFontSize, titleColor, titleFontSize, titleFontWeight,
		descColor, descFontSize, cardBackground, cardBorderRadius,
		cardPaddingV, cardPaddingH, cardShadow, cardMaxWidth, gap,
		alignment, mobileBreakpoint
	} = attributes;

	const textAlign = alignment === 'left'
		? 'left'
		: alignment === 'right' ? 'right' : 'center';

	const vars = [
		`--bb-mt-line-color: ${ lineColor || '#e2e8f0' }`,
		`--bb-mt-line-height: ${ clamp( lineHeight, 1, 8, 3 ) }px`,
		`--bb-mt-node-size: ${ clamp( nodeSize, 24, 80, 40 ) }px`,
		`--bb-mt-node-color: ${ nodeColor || '#3b82f6' }`,
		`--bb-mt-node-icon-color: ${ nodeIconColor || '#ffffff' }`,
		`--bb-mt-date-color: ${ dateColor || '#6b7280' }`,
		`--bb-mt-date-size: ${ clamp( dateFontSize, 10, 24, 13 ) }px`,
		`--bb-mt-title-color: ${ titleColor || '#1e293b' }`,
		`--bb-mt-title-size: ${ clamp( titleFontSize, 12, 36, 16 ) }px`,
		`--bb-mt-title-weight: ${ titleFontWeight || '600' }`,
		`--bb-mt-desc-color: ${ descColor || '#475569' }`,
		`--bb-mt-desc-size: ${ clamp( descFontSize, 10, 24, 14 ) }px`,
		`--bb-mt-card-bg: ${ cardBackground || '#ffffff' }`,
		`--bb-mt-card-radius: ${ clamp( cardBorderRadius, 0, 32, 8 ) }px`,
		`--bb-mt-card-pad-v: ${ clamp( cardPaddingV, 4, 48, 16 ) }px`,
		`--bb-mt-card-pad-h: ${ clamp( cardPaddingH, 4, 48, 16 ) }px`,
		`--bb-mt-card-shadow: ${ shadowFor( cardShadow ) }`,
		`--bb-mt-card-max-width: ${ clamp( cardMaxWidth, 120, 400, 220 ) }px`,
		`--bb-mt-gap: ${ clamp( gap, 16, 120, 40 ) }px`,
		`--bb-mt-text-align: ${ textAlign }`,
		`--bb-mt-breakpoint: ${ clamp( mobileBreakpoint, 320, 768, 640 ) }px`
	].join( ';' );

	return `#${ id }.bb-mt{${ vars };}`;
};
