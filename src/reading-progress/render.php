<?php
/**
 * Reading Progress Block server-side render.
 *
 * Emits a lightweight marker `<div>` at the block's position in the document.
 * The frontend `view.js` reads its `data-bb-rp-config` JSON attribute, then
 * creates a `position: fixed` bar pinned to the top or bottom of the viewport
 * and appends it to `document.body`. Per-instance scoping uses `wp_unique_id`.
 *
 * No global helper functions are declared here intentionally — Gutenberg
 * may include this file more than once per request which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (same pattern as process-steps, comparison-table, modal-popup).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksReadingProgress';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, or named) -----
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
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Clamp an integer between two bounds with a fallback ---------------
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( null === $value || '' === $value ) {
		return $fallback;
	}
	if ( ! is_numeric( $value ) ) {
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

// --- Sanitize a CSS selector (very strict allowlist) -------------------
// Allowed: letters, digits, hyphen, underscore, dot, hash, comma, space.
// Capped at 200 chars. Anything else falls back to empty (which means "auto").
$sanitizeSelector = static function ( $value ) {
	$value = trim( (string) $value );
	if ( '' === $value ) {
		return '';
	}
	if ( strlen( $value ) > 200 ) {
		return '';
	}
	if ( ! preg_match( '/^[a-zA-Z0-9\-_.#,\s>+~\[\]="\':()]+$/', $value ) ) {
		return '';
	}
	return $value;
};

// --- Resolve & sanitize attributes -------------------------------------
$position = isset( $attributes['position'] ) ? sanitize_key( (string) $attributes['position'] ) : 'top';
$position = in_array( $position, [ 'top', 'bottom' ], true ) ? $position : 'top';

$scrollTarget = isset( $attributes['scrollTarget'] ) ? sanitize_key( (string) $attributes['scrollTarget'] ) : 'page';
$scrollTarget = in_array( $scrollTarget, [ 'page', 'content' ], true ) ? $scrollTarget : 'page';

$height            = $clampInt( $attributes['height'] ?? null, 1, 20, 4 );
$borderRadius      = $clampInt( $attributes['borderRadius'] ?? null, 0, 20, 0 );
$zIndex            = $clampInt( $attributes['zIndex'] ?? null, 1, 99999, 9999 );
$animationDuration = $clampInt( $attributes['animationDuration'] ?? null, 0, 300, 0 );

$foregroundColor = $sanitizeColor( $attributes['foregroundColor'] ?? '', '#0073aa' );
$backgroundColor = $sanitizeColor( $attributes['backgroundColor'] ?? '', '#e0e0e0' );

$hideOnMobile = ! empty( $attributes['hideOnMobile'] );

$contentSelector = $sanitizeSelector( $attributes['contentSelector'] ?? '' );

// --- Per-instance CSS variables (passed via inline <style>) -------------
$bgValue = ( '' === $backgroundColor ) ? 'transparent' : $backgroundColor;

$cssRules  = "#{$id} .bb-rp-bar{";
$cssRules .= '--bb-rp-color:' . $foregroundColor . ';';
$cssRules .= '--bb-rp-bg:' . $bgValue . ';';
$cssRules .= '--bb-rp-height:' . $height . 'px;';
$cssRules .= '--bb-rp-radius:' . $borderRadius . 'px;';
$cssRules .= '--bb-rp-duration:' . $animationDuration . 'ms;';
$cssRules .= '--bb-rp-zindex:' . $zIndex . ';';
$cssRules .= '}';

// --- Build the config payload the view.js will read --------------------
$config = [
	'id'                => $id,
	'position'          => $position,
	'scrollTarget'      => $scrollTarget,
	'contentSelector'   => $contentSelector,
	'hideOnMobile'      => $hideOnMobile,
	'animationDuration' => $animationDuration,
	// Translated label for the runtime-created bar element (built by view.js,
	// so PHP must supply the string via the config payload).
	'ariaLabel'         => __( 'Reading progress', 'b-blocks' ),
];

$wrapperClasses = trim(
	$planClass
	. ' bb-rp-marker'
	. ' bb-rp-pos--' . $position
	. ( $hideOnMobile ? ' bb-rp-hide-mobile' : '' )
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-bb-rp-config='<?php echo esc_attr( wp_json_encode( $config ) ); ?>'
	aria-hidden='true'
>
	<style><?php echo wp_strip_all_tags( $cssRules ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- all values pre-sanitized above. ?></style>
</div>
