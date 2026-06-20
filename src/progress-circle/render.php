<?php
/**
 * Progress Circle block server-side render.
 *
 * Outputs an SVG-based circular (radial) progress indicator with an optional
 * center label, animated stroke fill, title beneath the circle, and full
 * color customization.
 *
 * No global helper functions are declared at file scope — Gutenberg may
 * include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers below are static closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksProgressCircle';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, or named).
$sanitizeColor = static function ( $color, $fallback ) {
	$color = trim( (string) $color );
	if ( '' === $color ) {
		return $fallback;
	}
	if ( preg_match( '/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^(rgb|rgba|hsl|hsla)\s*\([0-9\s,%.\/]+\)$/i', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

$percentageRaw     = isset( $attributes['percentage'] ) ? (float) $attributes['percentage'] : 70;
$percentage        = max( 0, min( 100, $percentageRaw ) );
$size              = isset( $attributes['size'] ) ? (int) $attributes['size'] : 160;
$size              = max( 80, min( 400, $size ) );
$strokeWidth       = isset( $attributes['strokeWidth'] ) ? (int) $attributes['strokeWidth'] : 12;
$strokeWidth       = max( 2, min( 40, $strokeWidth ) );
// Don't allow the stroke to consume the whole disc.
if ( $strokeWidth >= $size / 2 ) {
	$strokeWidth = (int) max( 2, floor( ( $size / 2 ) - 1 ) );
}
$fillColor         = $sanitizeColor( $attributes['fillColor'] ?? '', '#4f46e5' );
$trackColor        = $sanitizeColor( $attributes['trackColor'] ?? '', '#e5e7eb' );
$lineCap           = isset( $attributes['lineCap'] ) ? (string) $attributes['lineCap'] : 'round';
$lineCap           = in_array( $lineCap, [ 'round', 'butt' ], true ) ? $lineCap : 'round';

$showLabel         = ! empty( $attributes['showLabel'] );
$labelType         = isset( $attributes['labelType'] ) ? (string) $attributes['labelType'] : 'percentage';
$labelType         = in_array( $labelType, [ 'percentage', 'custom' ], true ) ? $labelType : 'percentage';
$customLabel       = isset( $attributes['customLabel'] ) ? (string) $attributes['customLabel'] : '';
$labelColorRaw     = $attributes['labelColor'] ?? '';
$labelColor        = '' === $labelColorRaw ? '' : $sanitizeColor( $labelColorRaw, '' );
$labelFontSize     = isset( $attributes['labelFontSize'] ) ? (int) $attributes['labelFontSize'] : 28;
$labelFontSize     = max( 10, min( 80, $labelFontSize ) );
$labelPrefix       = isset( $attributes['prefix'] ) ? (string) $attributes['prefix'] : '';
$labelSuffix       = isset( $attributes['suffix'] ) ? (string) $attributes['suffix'] : '%';

$showTitle         = ! empty( $attributes['showTitle'] );
$title             = isset( $attributes['title'] ) ? (string) $attributes['title'] : '';
$titleColorRaw     = $attributes['titleColor'] ?? '';
$titleColor        = '' === $titleColorRaw ? '' : $sanitizeColor( $titleColorRaw, '' );
$titleFontSize     = isset( $attributes['titleFontSize'] ) ? (int) $attributes['titleFontSize'] : 15;
$titleFontSize     = max( 10, min( 40, $titleFontSize ) );

$animate           = ! empty( $attributes['animate'] );
$animationDuration = isset( $attributes['animationDuration'] ) ? (int) $attributes['animationDuration'] : 1200;
$animationDuration = max( 300, min( 3000, $animationDuration ) );

// SVG geometry.
$radius        = ( $size / 2 ) - ( $strokeWidth / 2 );
$circumference = 2 * M_PI * $radius;
$targetOffset  = $circumference * ( 1 - ( $percentage / 100 ) );
$initialOffset = $animate ? $circumference : $targetOffset;

$cx = $size / 2;
$cy = $size / 2;

$hasTitle  = $showTitle && '' !== trim( $title );
$ariaLabel = '' !== trim( $title ) ? trim( $title ) : __( 'Progress', 'b-blocks' );

$wrapperClasses  = $planClass;
if ( $animate ) {
	$wrapperClasses .= ' pc-animate';
}
$wrapperClasses .= ' pc-linecap-' . $lineCap;

$wrapperStyle  = 'max-width:' . (int) $size . 'px;';

$svgStyle = 'width:100%;height:auto;';

$trackAttrs  = 'stroke:' . $trackColor . ';';
$trackAttrs .= 'stroke-width:' . (int) $strokeWidth . ';';

$fillAttrs   = 'stroke:' . $fillColor . ';';
$fillAttrs  .= 'stroke-width:' . (int) $strokeWidth . ';';
$fillAttrs  .= 'stroke-dasharray:' . esc_attr( (string) $circumference ) . ';';
$fillAttrs  .= 'stroke-dashoffset:' . esc_attr( (string) $initialOffset ) . ';';
$fillAttrs  .= 'transition:stroke-dashoffset ' . (int) $animationDuration . 'ms ease-out;';

$labelStyle = 'font-size:' . (int) $labelFontSize . 'px;';
if ( '' !== $labelColor ) {
	$labelStyle .= 'color:' . $labelColor . ';';
}

$titleStyle = 'font-size:' . (int) $titleFontSize . 'px;';
if ( '' !== $titleColor ) {
	$titleStyle .= 'color:' . $titleColor . ';';
}

// Pre-compute the static label that PHP renders. JS may animate it from 0
// up to this value, but if JS is disabled the final value remains correct.
$percentageDisplay = ( (int) $percentage === (float) $percentage )
	? (string) (int) $percentage
	: rtrim( rtrim( number_format( $percentage, 2, '.', '' ), '0' ), '.' );

if ( 'custom' === $labelType && '' !== trim( $customLabel ) ) {
	$labelText = $customLabel;
} else {
	$labelText = $labelPrefix . $percentageDisplay . $labelSuffix;
}

// Initial counter display: start at 0 only when animating a numeric percentage label.
// Custom labels are static and should always show their final text.
$initialCounter = ( $animate && 'percentage' === $labelType )
	? ( $labelPrefix . '0' . $labelSuffix )
	: $labelText;
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<div class='<?php echo esc_attr( $prefix ); ?>' style='<?php echo esc_attr( $wrapperStyle ); ?>'>
		<div
			class='pcVisual'
			role='progressbar'
			aria-valuenow='<?php echo esc_attr( (string) (int) round( $percentage ) ); ?>'
			aria-valuemin='0'
			aria-valuemax='100'
			aria-label='<?php echo esc_attr( $ariaLabel ); ?>'
			data-percentage='<?php echo esc_attr( (string) $percentage ); ?>'
			data-circumference='<?php echo esc_attr( (string) $circumference ); ?>'
			data-target-offset='<?php echo esc_attr( (string) $targetOffset ); ?>'
			data-animate='<?php echo esc_attr( $animate ? '1' : '0' ); ?>'
			data-duration='<?php echo esc_attr( (string) $animationDuration ); ?>'
			data-label-type='<?php echo esc_attr( $labelType ); ?>'
			data-label-prefix='<?php echo esc_attr( $labelPrefix ); ?>'
			data-label-suffix='<?php echo esc_attr( $labelSuffix ); ?>'
		>
			<svg
				class='pcSvg'
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 <?php echo esc_attr( (string) $size ); ?> <?php echo esc_attr( (string) $size ); ?>'
				width='<?php echo esc_attr( (string) $size ); ?>'
				height='<?php echo esc_attr( (string) $size ); ?>'
				style='<?php echo esc_attr( $svgStyle ); ?>'
				aria-hidden='true'
				focusable='false'
			>
				<circle
					class='pcTrack'
					cx='<?php echo esc_attr( (string) $cx ); ?>'
					cy='<?php echo esc_attr( (string) $cy ); ?>'
					r='<?php echo esc_attr( (string) $radius ); ?>'
					fill='none'
					style='<?php echo esc_attr( $trackAttrs ); ?>'
				></circle>
				<circle
					class='pcFill'
					cx='<?php echo esc_attr( (string) $cx ); ?>'
					cy='<?php echo esc_attr( (string) $cy ); ?>'
					r='<?php echo esc_attr( (string) $radius ); ?>'
					fill='none'
					stroke-linecap='<?php echo esc_attr( $lineCap ); ?>'
					transform='rotate(-90 <?php echo esc_attr( (string) $cx ); ?> <?php echo esc_attr( (string) $cy ); ?>)'
					style='<?php echo esc_attr( $fillAttrs ); ?>'
				></circle>
			</svg>

			<?php if ( $showLabel ) : ?>
				<span
					class='pcLabel'
					style='<?php echo esc_attr( $labelStyle ); ?>'
					data-final-label='<?php echo esc_attr( $labelText ); ?>'
				><?php echo esc_html( $initialCounter ); ?></span>
			<?php endif; ?>
		</div>

		<?php if ( $hasTitle ) : ?>
			<span class='pcTitle' style='<?php echo esc_attr( $titleStyle ); ?>'><?php echo esc_html( $title ); ?></span>
		<?php endif; ?>
	</div>
</div>
