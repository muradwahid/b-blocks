<?php
/**
 * Divider Block — server-side render.
 *
 * Renders an inline content-level horizontal rule that sits between paragraphs
 * and sections inside a post or page. Three variants:
 *
 *   1. Plain line (default):
 *      <div class="bb-dv bb-dv--line">
 *        <hr class="bb-dv-line" aria-hidden="true" />
 *      </div>
 *
 *   2. Line with centered Font Awesome icon:
 *      <div class="bb-dv bb-dv--icon" role="separator">
 *        <span class="bb-dv-line" aria-hidden="true"></span>
 *        <span class="bb-dv-icon" aria-hidden="true">
 *          <i class="<fa-class>"></i>
 *        </span>
 *        <span class="bb-dv-line" aria-hidden="true"></span>
 *      </div>
 *
 *   3. Line with centered text label:
 *      <div class="bb-dv bb-dv--text" role="separator" aria-label="<text>">
 *        <span class="bb-dv-line" aria-hidden="true"></span>
 *        <span class="bb-dv-text">OR</span>
 *        <span class="bb-dv-line" aria-hidden="true"></span>
 *      </div>
 *
 * Helpers are intentionally inlined as static closures — Gutenberg may include
 * this file more than once per request which would cause a "Cannot redeclare
 * function" fatal if helpers were declared at file scope. Same pattern as
 * callout / blockquote / click-to-share / author-box / process-steps.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksDivider';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color (hex, rgb/rgba/hsl/hsla, var(), or named) -----
$sanitizeColor = static function ( $color, $fallback = '' ) {
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
	// Fallback value restricted to safe chars only — no {}, \, <, > which could break CSS context.
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+\s*(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Clamp an int to a [min, max] range with a fallback -----------------
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( null === $value || '' === $value ) {
		return $fallback;
	}
	$n = (int) $value;
	if ( $n < $min ) {
		return $min;
	}
	if ( $n > $max ) {
		return $max;
	}
	return $n;
};

// --- Sanitize a Font Awesome class string. Only letters, digits, spaces,
// hyphens, and underscores are allowed. Caps the length at 80 characters
// so a malicious editor cannot smuggle markup through this attribute. ----
$sanitizeIconClass = static function ( $value, $fallback ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return $fallback;
	}
	if ( strlen( $value ) > 80 ) {
		return $fallback;
	}
	if ( ! preg_match( '/^[a-zA-Z0-9 _\-]+$/', $value ) ) {
		return $fallback;
	}
	return $value;
};

// --- Resolve and sanitize attributes -----------------------------------
$attributes = is_array( $attributes ) ? $attributes : [];

$typeRaw = isset( $attributes['type'] ) ? strtolower( trim( (string) $attributes['type'] ) ) : 'line';
$type    = in_array( $typeRaw, [ 'line', 'icon', 'text' ], true ) ? $typeRaw : 'line';

$lineStyleRaw = isset( $attributes['lineStyle'] ) ? strtolower( trim( (string) $attributes['lineStyle'] ) ) : 'solid';
$lineStyle    = in_array( $lineStyleRaw, [ 'solid', 'dashed', 'dotted', 'double' ], true ) ? $lineStyleRaw : 'solid';

$alignmentRaw = isset( $attributes['alignment'] ) ? strtolower( trim( (string) $attributes['alignment'] ) ) : 'center';
$alignment    = in_array( $alignmentRaw, [ 'left', 'center', 'right' ], true ) ? $alignmentRaw : 'center';

$lineColor       = $sanitizeColor( $attributes['lineColor'] ?? '', '#cccccc' );
$lineWidth       = $clampInt( $attributes['lineWidth'] ?? 2, 1, 12, 2 );
$width           = $clampInt( $attributes['width'] ?? 100, 10, 100, 100 );
$marginTop       = $clampInt( $attributes['marginTop'] ?? 24, 0, 200, 24 );
$marginBottom    = $clampInt( $attributes['marginBottom'] ?? 24, 0, 200, 24 );

$iconClass        = $sanitizeIconClass( $attributes['iconClass'] ?? 'fa-solid fa-star', 'fa-solid fa-star' );
$iconSize         = $clampInt( $attributes['iconSize'] ?? 16, 8, 64, 16 );
$iconColor        = $sanitizeColor( $attributes['iconColor'] ?? '', '' );
$iconBgColor      = $sanitizeColor( $attributes['iconBgColor'] ?? '', '' );
$iconPadding      = $clampInt( $attributes['iconPadding'] ?? 8, 0, 32, 8 );
$iconBorderRadius = $clampInt( $attributes['iconBorderRadius'] ?? 50, 0, 50, 50 );

$text          = isset( $attributes['text'] ) ? substr( trim( (string) $attributes['text'] ), 0, 40 ) : '';
$textColor     = $sanitizeColor( $attributes['textColor'] ?? '', '' );
$textBgColor   = $sanitizeColor( $attributes['textBgColor'] ?? '', '' );
$textFontSize  = $clampInt( $attributes['textFontSize'] ?? 14, 10, 36, 14 );
$textPadding   = $clampInt( $attributes['textPadding'] ?? 12, 0, 48, 12 );

$textFontWeight = isset( $attributes['textFontWeight'] ) ? trim( (string) $attributes['textFontWeight'] ) : '600';
if ( ! in_array( $textFontWeight, [ '400', '500', '600', '700' ], true ) ) {
	$textFontWeight = '600';
}

$textTransformRaw = isset( $attributes['textTransform'] ) ? strtolower( trim( (string) $attributes['textTransform'] ) ) : 'none';
$textTransform    = in_array( $textTransformRaw, [ 'none', 'uppercase', 'capitalize', 'lowercase' ], true ) ? $textTransformRaw : 'none';

// --- Resolved tokens (override → inherit lineColor) --------------------
$resolvedIconColor = '' !== $iconColor ? $iconColor : $lineColor;
$resolvedTextColor = '' !== $textColor ? $textColor : $lineColor;
$resolvedIconBg    = '' !== $iconBgColor ? $iconBgColor : 'transparent';
$resolvedTextBg    = '' !== $textBgColor ? $textBgColor : 'transparent';

// --- Wrapper classes ---------------------------------------------------
$wrapperClasses = trim(
	$planClass
	. ' bb-divider'
	. ' bb-dv--' . $type
	. ' bb-dv-style--' . $lineStyle
	. ' bb-dv-align--' . $alignment
);

// --- CSS custom properties for per-instance styling --------------------
$cssVars = [
	'--bb-dv-line-color: '   . $lineColor,
	'--bb-dv-line-width: '   . $lineWidth . 'px',
	'--bb-dv-line-style: '   . $lineStyle,
	'--bb-dv-max-width: '    . $width . '%',
	'--bb-dv-margin-top: '   . $marginTop . 'px',
	'--bb-dv-margin-bottom: ' . $marginBottom . 'px',
	'--bb-dv-icon-color: '   . $resolvedIconColor,
	'--bb-dv-icon-bg: '      . $resolvedIconBg,
	'--bb-dv-icon-size: '    . $iconSize . 'px',
	'--bb-dv-icon-padding: ' . $iconPadding . 'px',
	'--bb-dv-icon-radius: '  . $iconBorderRadius . 'px',
	'--bb-dv-text-color: '   . $resolvedTextColor,
	'--bb-dv-text-bg: '      . $resolvedTextBg,
	'--bb-dv-text-size: '    . $textFontSize . 'px',
	'--bb-dv-text-weight: '  . $textFontWeight,
	'--bb-dv-text-transform: ' . $textTransform,
	'--bb-dv-text-padding: ' . $textPadding . 'px',
];
$wrapperStyle = implode( '; ', $cssVars ) . ';';
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	style='<?php echo esc_attr( $wrapperStyle ); ?>'
>
	<?php if ( 'line' === $type ) : ?>
		<div class='bb-dv' role='separator'>
			<hr class='bb-dv-line' aria-hidden='true' />
		</div>

	<?php elseif ( 'icon' === $type ) : ?>
		<div class='bb-dv' role='separator'>
			<span class='bb-dv-line' aria-hidden='true'></span>
			<span class='bb-dv-icon' aria-hidden='true'>
				<i class='<?php echo esc_attr( $iconClass ); ?>'></i>
			</span>
			<span class='bb-dv-line' aria-hidden='true'></span>
		</div>

	<?php else : // 'text' ?>
		<div
			class='bb-dv'
			role='separator'
			<?php if ( '' !== $text ) : ?>
				aria-label='<?php echo esc_attr( $text ); ?>'
			<?php endif; ?>
		>
			<span class='bb-dv-line' aria-hidden='true'></span>
			<span class='bb-dv-text'><?php echo esc_html( $text ); ?></span>
			<span class='bb-dv-line' aria-hidden='true'></span>
		</div>
	<?php endif; ?>
</div>
