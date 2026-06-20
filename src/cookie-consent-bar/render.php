<?php
/**
 * Cookie Consent Bar block server-side render.
 *
 * Renders a position:fixed consent notice pinned to the top or bottom of the
 * viewport with a RichText message and Accept / (optional) Decline buttons.
 * The visitor's stated choice is remembered per browser via a named cookie
 * written client-side by view.js — no backend storage and no script blocking.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksCookieConsentBar';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, named, or var()). ---
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
	// var(--token) with an optional comma fallback (hardened allowlist).
	if ( preg_match( '/^var\(\s*--[a-zA-Z0-9\-_]+(,\s*[a-zA-Z0-9 #%.,\-_\/]+)?\s*\)$/', $color ) ) {
		return $color;
	}
	if ( preg_match( '/^[a-zA-Z]{1,30}$/', $color ) ) {
		return $color;
	}
	return $fallback;
};

// --- Clamp a numeric attribute. ---
$clampInt = static function ( $value, $min, $max, $fallback ) {
	if ( ! is_numeric( $value ) ) {
		return (int) $fallback;
	}
	$value = (int) $value;
	if ( $value < $min ) { return (int) $min; }
	if ( $value > $max ) { return (int) $max; }
	return $value;
};

// --- Resolve and sanitize attributes. ---
$message     = isset( $attributes['message'] ) ? (string) $attributes['message'] : '';
$acceptLabel = isset( $attributes['acceptLabel'] ) ? (string) $attributes['acceptLabel'] : __( 'Accept', 'b-blocks' );
$declineLabel = isset( $attributes['declineLabel'] ) ? (string) $attributes['declineLabel'] : __( 'Decline', 'b-blocks' );

if ( '' === trim( $acceptLabel ) ) {
	$acceptLabel = __( 'Accept', 'b-blocks' );
}

$showDecline = isset( $attributes['showDecline'] ) ? (bool) $attributes['showDecline'] : true;
if ( '' === trim( $declineLabel ) ) {
	$showDecline = false;
}

$position = isset( $attributes['position'] ) ? sanitize_key( (string) $attributes['position'] ) : 'bottom';
$position = in_array( $position, [ 'top', 'bottom' ], true ) ? $position : 'bottom';

$layout = isset( $attributes['layout'] ) ? sanitize_key( (string) $attributes['layout'] ) : 'inline';
$layout = in_array( $layout, [ 'inline', 'stacked' ], true ) ? $layout : 'inline';

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'center';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'center';

// Cookie name: restrict to safe cookie-token characters; fall back if empty.
$cookieName = isset( $attributes['cookieName'] ) ? (string) $attributes['cookieName'] : 'bb_cookie_consent';
$cookieName = preg_replace( '/[^a-zA-Z0-9_\-]/', '', $cookieName );
if ( '' === $cookieName ) {
	$cookieName = 'bb_cookie_consent';
}

$fontWeight = isset( $attributes['fontWeight'] ) ? preg_replace( '/[^0-9]/', '', (string) $attributes['fontWeight'] ) : '400';
$fontWeight = in_array( $fontWeight, [ '400', '500', '600', '700' ], true ) ? $fontWeight : '400';

$btnFontWeight = isset( $attributes['btnFontWeight'] ) ? preg_replace( '/[^0-9]/', '', (string) $attributes['btnFontWeight'] ) : '600';
$btnFontWeight = in_array( $btnFontWeight, [ '400', '500', '600', '700' ], true ) ? $btnFontWeight : '600';

$barBg           = $sanitizeColor( $attributes['barBg'] ?? '', '#1a1a1a' );
$barText         = $sanitizeColor( $attributes['barText'] ?? '', '#ffffff' );
$acceptBg        = $sanitizeColor( $attributes['acceptBg'] ?? '', '#ffffff' );
$acceptText      = $sanitizeColor( $attributes['acceptText'] ?? '', '#1a1a1a' );
$acceptHoverBg   = $sanitizeColor( $attributes['acceptHoverBg'] ?? '', '#e6e6e6' );
$acceptHoverText = $sanitizeColor( $attributes['acceptHoverText'] ?? '', '#1a1a1a' );
$declineBg       = $sanitizeColor( $attributes['declineBg'] ?? '', 'transparent' );
$declineText     = $sanitizeColor( $attributes['declineText'] ?? '', '#ffffff' );
$declineHoverBg  = $sanitizeColor( $attributes['declineHoverBg'] ?? '', 'rgba(255,255,255,0.1)' );
$declineHoverText = $sanitizeColor( $attributes['declineHoverText'] ?? '', '#ffffff' );

$maxWidth    = $clampInt( $attributes['maxWidth'] ?? 0, 0, 1600, 0 );
$barPaddingV = $clampInt( $attributes['barPaddingV'] ?? 16, 4, 80, 16 );
$barPaddingH = $clampInt( $attributes['barPaddingH'] ?? 24, 4, 120, 24 );
$fontSize    = $clampInt( $attributes['fontSize'] ?? 14, 10, 28, 14 );
$btnFontSize = $clampInt( $attributes['btnFontSize'] ?? 14, 10, 24, 14 );
$btnPaddingV = $clampInt( $attributes['btnPaddingV'] ?? 8, 2, 40, 8 );
$btnPaddingH = $clampInt( $attributes['btnPaddingH'] ?? 20, 4, 80, 20 );
$btnRadius   = $clampInt( $attributes['btnRadius'] ?? 4, 0, 9999, 4 );
$btnGap      = $clampInt( $attributes['btnGap'] ?? 8, 0, 48, 8 );
$zIndex      = $clampInt( $attributes['zIndex'] ?? 9999, 1, 99999, 9999 );
$animationDuration = $clampInt( $attributes['animationDuration'] ?? 300, 0, 800, 300 );
$cookieDays  = $clampInt( $attributes['cookieDays'] ?? 365, 1, 3650, 365 );

$maxWidthCss = $maxWidth > 0 ? ( $maxWidth . 'px' ) : 'none';

$wrapperClasses = trim(
	'bb-ccb ' . $planClass
	. ' bb-ccb-pos-' . $position
	. ' bb-ccb-layout-' . $layout
	. ' bb-ccb-align-' . $alignment
);

// Per-instance CSS variables, scoped under the unique wrapper id.
$css  = "#$id.bb-ccb {";
$css .= "--bb-ccb-bg: $barBg;";
$css .= "--bb-ccb-color: $barText;";
$css .= "--bb-ccb-pad-y: {$barPaddingV}px;";
$css .= "--bb-ccb-pad-x: {$barPaddingH}px;";
$css .= "--bb-ccb-max-w: $maxWidthCss;";
$css .= "--bb-ccb-z: $zIndex;";
$css .= "--bb-ccb-font-size: {$fontSize}px;";
$css .= "--bb-ccb-font-weight: $fontWeight;";
$css .= "--bb-ccb-anim: {$animationDuration}ms;";
$css .= "--bb-ccb-accept-bg: $acceptBg;";
$css .= "--bb-ccb-accept-text: $acceptText;";
$css .= "--bb-ccb-accept-hover-bg: $acceptHoverBg;";
$css .= "--bb-ccb-accept-hover-text: $acceptHoverText;";
$css .= "--bb-ccb-decline-bg: $declineBg;";
$css .= "--bb-ccb-decline-text: $declineText;";
$css .= "--bb-ccb-decline-hover-bg: $declineHoverBg;";
$css .= "--bb-ccb-decline-hover-text: $declineHoverText;";
$css .= "--bb-ccb-btn-font-size: {$btnFontSize}px;";
$css .= "--bb-ccb-btn-font-weight: $btnFontWeight;";
$css .= "--bb-ccb-btn-pad-y: {$btnPaddingV}px;";
$css .= "--bb-ccb-btn-pad-x: {$btnPaddingH}px;";
$css .= "--bb-ccb-btn-radius: {$btnRadius}px;";
$css .= "--bb-ccb-btn-gap: {$btnGap}px;";
$css .= "}";

// Config consumed by view.js (cookie write + slide animation).
$config = wp_json_encode(
	[
		'id'        => $id,
		'cookie'    => $cookieName,
		'days'      => $cookieDays,
		'position'  => $position,
		'animation' => $animationDuration,
	]
);
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	role='dialog'
	aria-modal='false'
	aria-live='polite'
	aria-label='<?php echo esc_attr__( 'Cookie consent notice', 'b-blocks' ); ?>'
	data-bb-ccb
	data-bb-ccb-id='<?php echo esc_attr( $id ); ?>'
	data-bb-config='<?php echo esc_attr( $config ); ?>'
	hidden
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-ccb-inner'>
		<div class='bb-ccb-message'>
			<?php echo wp_kses_post( $message ); ?>
		</div>

		<div class='bb-ccb-actions'>
			<?php if ( $showDecline ) : ?>
				<button
					type='button'
					class='bb-ccb-button bb-ccb-decline'
					data-bb-ccb-action='decline'
					aria-label='<?php echo esc_attr__( 'Decline cookies', 'b-blocks' ); ?>'
				>
					<?php echo esc_html( $declineLabel ); ?>
				</button>
			<?php endif; ?>

			<button
				type='button'
				class='bb-ccb-button bb-ccb-accept'
				data-bb-ccb-action='accept'
				aria-label='<?php echo esc_attr__( 'Accept cookies', 'b-blocks' ); ?>'
			>
				<?php echo esc_html( $acceptLabel ); ?>
			</button>
		</div>
	</div>
</div>
