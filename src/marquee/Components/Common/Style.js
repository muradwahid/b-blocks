/**
 * Builds the per-instance inline CSS for a Marquee block.
 *
 * Shared by the editor (Edit.js) so the canvas preview matches the frontend
 * output produced by render.php. All values are clamped to their safe ranges
 * before being written into CSS custom properties. The animation duration is
 * a sensible static fallback here; on the frontend `view.js` overrides
 * `--bb-mq-duration` with a width-aware value so scroll speed stays consistent.
 */
const clamp = ( value, min, max, fallback ) => {
	const num = parseInt( value, 10 );
	if ( Number.isNaN( num ) ) return fallback;
	return Math.max( min, Math.min( max, num ) );
};

export const buildMarqueeCss = ( id, attributes ) => {
	const {
		speed, gap, fadeWidth,
		stripPaddingTop, stripPaddingBottom, backgroundColor, borderRadius,
		imageHeight, textFontSize, textFontWeight, textColor,
		badgeBackground, badgeBorderRadius, badgePaddingV, badgePaddingH,
		separatorColor, separatorSize,
		labelFontSize, labelFontWeight, labelColor
	} = attributes;

	const safeSpeed = clamp( speed, 20, 200, 40 );

	// Static editor fallback duration: assume ~1200px of content per loop.
	const fallbackDuration = Math.max( 5, Math.round( 1200 / safeSpeed ) );

	const vars = [
		`--bb-mq-duration: ${ fallbackDuration }s`,
		`--bb-mq-gap: ${ clamp( gap, 0, 120, 48 ) }px`,
		`--bb-mq-fade-w: ${ clamp( fadeWidth, 20, 200, 80 ) }px`,
		`--bb-mq-pt: ${ clamp( stripPaddingTop, 0, 96, 20 ) }px`,
		`--bb-mq-pb: ${ clamp( stripPaddingBottom, 0, 96, 20 ) }px`,
		`--bb-mq-bg: ${ backgroundColor || 'transparent' }`,
		`--bb-mq-radius: ${ clamp( borderRadius, 0, 48, 0 ) }px`,
		`--bb-mq-img-h: ${ clamp( imageHeight, 16, 200, 40 ) }px`,
		`--bb-mq-text-size: ${ clamp( textFontSize, 10, 48, 16 ) }px`,
		`--bb-mq-text-weight: ${ textFontWeight || '500' }`,
		`--bb-mq-text-color: ${ textColor || 'inherit' }`,
		`--bb-mq-badge-bg: ${ badgeBackground || 'transparent' }`,
		`--bb-mq-badge-radius: ${ clamp( badgeBorderRadius, 0, 50, 4 ) }px`,
		`--bb-mq-badge-pv: ${ clamp( badgePaddingV, 0, 32, 6 ) }px`,
		`--bb-mq-badge-ph: ${ clamp( badgePaddingH, 0, 64, 12 ) }px`,
		`--bb-mq-sep-color: ${ separatorColor || 'currentColor' }`,
		`--bb-mq-sep-size: ${ clamp( separatorSize, 4, 24, 8 ) }px`,
		`--bb-mq-label-size: ${ clamp( labelFontSize, 10, 24, 14 ) }px`,
		`--bb-mq-label-weight: ${ labelFontWeight || '600' }`,
		`--bb-mq-label-color: ${ labelColor || 'inherit' }`
	].join( ';' );

	return `#${ id }.bb-mq{${ vars };}`;
};
