/**
 * Builds the per-instance inline CSS for a Logo Grid block.
 *
 * Shared by the editor (Edit.js) so the canvas preview matches the frontend
 * output produced by render.php. All values are clamped to their safe ranges
 * before being written into CSS custom properties.
 */
const clamp = ( value, min, max, fallback ) => {
	const num = parseInt( value, 10 );
	if ( Number.isNaN( num ) ) return fallback;
	return Math.max( min, Math.min( max, num ) );
};

export const buildLogoGridCss = ( id, attributes ) => {
	const {
		columns = {}, columnGap, rowGap, cellAlign,
		logoMaxHeight, logoMaxWidth, logoPadding,
		cellBackground, cellBorderRadius, cellBorderWidth, cellBorderColor,
		maxWidth, blockPaddingTop, blockPaddingBottom, blockBackground,
		transitionDuration, labelColor, labelSize, labelWeight, labelAlign, labelGap
	} = attributes;

	const colDesktop = clamp( columns.desktop, 1, 8, 5 );
	const colTablet = clamp( columns.tablet, 1, 6, 3 );
	const colMobile = clamp( columns.mobile, 1, 4, 2 );

	const justify = cellAlign === 'left'
		? 'flex-start'
		: cellAlign === 'right' ? 'flex-end' : 'center';

	const vars = [
		`--bb-lg-cols-desktop: ${ colDesktop }`,
		`--bb-lg-cols-tablet: ${ colTablet }`,
		`--bb-lg-cols-mobile: ${ colMobile }`,
		`--bb-lg-col-gap: ${ clamp( columnGap, 0, 80, 32 ) }px`,
		`--bb-lg-row-gap: ${ clamp( rowGap, 0, 80, 24 ) }px`,
		`--bb-lg-justify: ${ justify }`,
		`--bb-lg-logo-max-h: ${ clamp( logoMaxHeight, 20, 200, 60 ) }px`,
		`--bb-lg-logo-max-w: ${ clamp( logoMaxWidth, 40, 400, 160 ) }px`,
		`--bb-lg-cell-padding: ${ clamp( logoPadding, 0, 48, 12 ) }px`,
		`--bb-lg-cell-bg: ${ cellBackground || 'transparent' }`,
		`--bb-lg-cell-radius: ${ clamp( cellBorderRadius, 0, 48, 0 ) }px`,
		`--bb-lg-cell-border-w: ${ clamp( cellBorderWidth, 0, 4, 0 ) }px`,
		`--bb-lg-cell-border-c: ${ cellBorderColor || 'transparent' }`,
		`--bb-lg-transition: ${ clamp( transitionDuration, 0, 800, 300 ) }ms`,
		`--bb-lg-block-pt: ${ clamp( blockPaddingTop, 0, 120, 32 ) }px`,
		`--bb-lg-block-pb: ${ clamp( blockPaddingBottom, 0, 120, 32 ) }px`,
		`--bb-lg-block-bg: ${ blockBackground || 'transparent' }`,
		`--bb-lg-max-width: ${ clamp( maxWidth, 0, 1600, 0 ) === 0 ? '100%' : `${ clamp( maxWidth, 0, 1600, 0 ) }px` }`,
		`--bb-lg-label-color: ${ labelColor || 'inherit' }`,
		`--bb-lg-label-size: ${ clamp( labelSize, 10, 32, 14 ) }px`,
		`--bb-lg-label-weight: ${ labelWeight || '400' }`,
		`--bb-lg-label-align: ${ labelAlign || 'center' }`,
		`--bb-lg-label-gap: ${ clamp( labelGap, 0, 64, 16 ) }px`
	].join( ';' );

	return `#${ id }.bb-lg{${ vars };}`;
};
