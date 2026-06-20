/**
 * Builds the per-instance inline CSS for a Testimonials Grid block.
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

export const avatarRadiusFor = ( shape ) =>
	shape === 'rounded' ? '12px' : shape === 'square' ? '0px' : '50%';

export const shadowFor = ( preset ) =>
	SHADOW_PRESETS[ preset ] || SHADOW_PRESETS.sm;

export const buildTestimonialsGridCss = ( id, attributes ) => {
	const {
		columnsDesktop, columnsTablet, columnsMobile, gap, maxWidth, alignment, textAlign,
		avatarSize, avatarShape, starSize, ratingColor,
		quoteIconSize, quoteIconColor,
		cardBackground, cardBorderRadius, cardPaddingV, cardPaddingH, cardShadow,
		accentColor, quoteColor, quoteFontSize, quoteFontWeight,
		nameColor, nameFontSize, nameFontWeight, metaColor, metaFontSize,
		borderColor, borderWidth
	} = attributes;

	const mw = clamp( maxWidth, 0, 1600, 0 );
	const justify = alignment === 'left'
		? 'flex-start'
		: alignment === 'right' ? 'flex-end' : 'center';

	const vars = [
		`--bb-tg-cols-desktop: ${ clamp( columnsDesktop, 1, 4, 3 ) }`,
		`--bb-tg-cols-tablet: ${ clamp( columnsTablet, 1, 3, 2 ) }`,
		`--bb-tg-cols-mobile: ${ clamp( columnsMobile, 1, 2, 1 ) }`,
		`--bb-tg-gap: ${ clamp( gap, 8, 80, 24 ) }px`,
		`--bb-tg-max-width: ${ mw === 0 ? '100%' : `${ mw }px` }`,
		`--bb-tg-justify: ${ justify }`,
		`--bb-tg-text-align: ${ textAlign === 'center' ? 'center' : 'left' }`,
		`--bb-tg-avatar-size: ${ clamp( avatarSize, 32, 96, 48 ) }px`,
		`--bb-tg-avatar-radius: ${ avatarRadiusFor( avatarShape ) }`,
		`--bb-tg-star-size: ${ clamp( starSize, 10, 28, 16 ) }px`,
		`--bb-tg-rating-color: ${ ratingColor || '#f59e0b' }`,
		`--bb-tg-quote-icon-size: ${ clamp( quoteIconSize, 16, 72, 32 ) }px`,
		`--bb-tg-quote-icon-color: ${ quoteIconColor || accentColor || '#6366f1' }`,
		`--bb-tg-card-bg: ${ cardBackground || '#ffffff' }`,
		`--bb-tg-card-radius: ${ clamp( cardBorderRadius, 0, 48, 8 ) }px`,
		`--bb-tg-card-pv: ${ clamp( cardPaddingV, 8, 64, 24 ) }px`,
		`--bb-tg-card-ph: ${ clamp( cardPaddingH, 8, 64, 24 ) }px`,
		`--bb-tg-card-shadow: ${ shadowFor( cardShadow ) }`,
		`--bb-tg-accent: ${ accentColor || '#6366f1' }`,
		`--bb-tg-quote-color: ${ quoteColor || 'inherit' }`,
		`--bb-tg-quote-size: ${ clamp( quoteFontSize, 12, 28, 16 ) }px`,
		`--bb-tg-quote-weight: ${ quoteFontWeight || '400' }`,
		`--bb-tg-name-color: ${ nameColor || 'inherit' }`,
		`--bb-tg-name-size: ${ clamp( nameFontSize, 10, 24, 14 ) }px`,
		`--bb-tg-name-weight: ${ nameFontWeight || '600' }`,
		`--bb-tg-meta-color: ${ metaColor || '#6b7280' }`,
		`--bb-tg-meta-size: ${ clamp( metaFontSize, 10, 20, 13 ) }px`,
		`--bb-tg-border-width: ${ clamp( borderWidth, 0, 4, 0 ) }px`,
		`--bb-tg-border-color: ${ borderColor || 'transparent' }`
	].join( ';' );

	return `#${ id }.bb-tg{${ vars };}`;
};
