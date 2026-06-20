/**
 * Builds the per-instance inline CSS for a Stat Cards block.
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
	sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
	md: '0 4px 12px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)',
	lg: '0 12px 28px rgba(0,0,0,0.14), 0 4px 8px rgba(0,0,0,0.08)'
};

export const shadowFor = ( preset ) =>
	SHADOW_PRESETS[ preset ] || SHADOW_PRESETS.none;

export const buildStatCardsCss = ( id, attributes ) => {
	const {
		columnsDesktop, columnsTablet, columnsMobile, columnGap, rowGap,
		alignment, iconSize,
		numberSizeDesktop, numberSizeTablet, numberSizeMobile, numberWeight,
		labelSize, labelWeight, descriptionSize,
		cardBackground, cardBorder, borderWidth, accentColor, accentWidth,
		borderRadius, cardPaddingV, cardPaddingH, shadowPreset,
		numberColor, labelColor, descriptionColor, iconColor,
		maxWidth, blockAlign
	} = attributes;

	const mw = clamp( maxWidth, 0, 1600, 0 );
	const textAlign = alignment === 'left'
		? 'left'
		: alignment === 'right' ? 'right' : 'center';
	const itemsAlign = textAlign === 'left'
		? 'flex-start'
		: textAlign === 'right' ? 'flex-end' : 'center';
	const justify = blockAlign === 'left'
		? 'flex-start'
		: blockAlign === 'right' ? 'flex-end' : 'center';

	const vars = [
		`--bb-sc-cols-desktop: ${ clamp( columnsDesktop, 1, 6, 3 ) }`,
		`--bb-sc-cols-tablet: ${ clamp( columnsTablet, 1, 6, 2 ) }`,
		`--bb-sc-cols-mobile: ${ clamp( columnsMobile, 1, 6, 1 ) }`,
		`--bb-sc-col-gap: ${ clamp( columnGap, 0, 80, 24 ) }px`,
		`--bb-sc-row-gap: ${ clamp( rowGap, 0, 80, 24 ) }px`,
		`--bb-sc-max-width: ${ mw === 0 ? '100%' : `${ mw }px` }`,
		`--bb-sc-justify: ${ justify }`,
		`--bb-sc-text-align: ${ textAlign }`,
		`--bb-sc-items-align: ${ itemsAlign }`,
		`--bb-sc-icon-size: ${ clamp( iconSize, 12, 64, 32 ) }px`,
		`--bb-sc-number-size-desktop: ${ clamp( numberSizeDesktop, 16, 96, 48 ) }px`,
		`--bb-sc-number-size-tablet: ${ clamp( numberSizeTablet, 16, 96, 40 ) }px`,
		`--bb-sc-number-size-mobile: ${ clamp( numberSizeMobile, 16, 96, 32 ) }px`,
		`--bb-sc-number-weight: ${ numberWeight || '700' }`,
		`--bb-sc-label-size: ${ clamp( labelSize, 10, 28, 16 ) }px`,
		`--bb-sc-label-weight: ${ labelWeight || '400' }`,
		`--bb-sc-desc-size: ${ clamp( descriptionSize, 10, 20, 14 ) }px`,
		`--bb-sc-card-bg: ${ cardBackground || 'transparent' }`,
		`--bb-sc-card-border: ${ cardBorder || '#e2e8f0' }`,
		`--bb-sc-border-width: ${ clamp( borderWidth, 0, 8, 1 ) }px`,
		`--bb-sc-accent: ${ accentColor || '#146EF5' }`,
		`--bb-sc-accent-width: ${ clamp( accentWidth, 2, 12, 4 ) }px`,
		`--bb-sc-radius: ${ clamp( borderRadius, 0, 48, 12 ) }px`,
		`--bb-sc-pad-v: ${ clamp( cardPaddingV, 8, 96, 28 ) }px`,
		`--bb-sc-pad-h: ${ clamp( cardPaddingH, 8, 96, 24 ) }px`,
		`--bb-sc-shadow: ${ shadowFor( shadowPreset ) }`,
		`--bb-sc-number-color: ${ numberColor || '#111827' }`,
		`--bb-sc-label-color: ${ labelColor || '#374151' }`,
		`--bb-sc-desc-color: ${ descriptionColor || '#6B7280' }`,
		`--bb-sc-icon-color: ${ iconColor || '#146EF5' }`
	].join( ';' );

	return `#${ id }.bb-sc{${ vars };}`;
};
