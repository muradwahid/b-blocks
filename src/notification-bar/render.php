<?php
/**
 * Notification Bar block server-side render.
 *
 * Renders a sticky (or in-flow) full-width announcement bar with an optional
 * CTA button and dismiss control. Dismissal state is persisted in
 * `localStorage` so returning visitors are not repeatedly interrupted. An
 * inline pre-paint script reads the storage key BEFORE the bar paints so the
 * dismissed state never flashes in.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksNotificationBar';
$id        = wp_unique_id( "$prefix-" );
$planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';

// --- Sanitize a CSS color value (hex, rgb/rgba/hsl/hsla, or named). ---
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
$position = isset( $attributes['position'] ) ? sanitize_key( $attributes['position'] ) : 'top';
$position = in_array( $position, [ 'top', 'bottom' ], true ) ? $position : 'top';

$isSticky      = isset( $attributes['isSticky'] ) ? (bool) $attributes['isSticky'] : true;
$showButton    = isset( $attributes['showButton'] ) ? (bool) $attributes['showButton'] : true;
$isDismissible = isset( $attributes['isDismissible'] ) ? (bool) $attributes['isDismissible'] : true;
$openNewTab    = isset( $attributes['buttonOpenNewTab'] ) ? (bool) $attributes['buttonOpenNewTab'] : false;

$message    = isset( $attributes['message'] ) ? (string) $attributes['message'] : '';
$buttonText = isset( $attributes['buttonText'] ) ? (string) $attributes['buttonText'] : '';
$buttonUrl  = isset( $attributes['buttonUrl'] ) ? esc_url_raw( (string) $attributes['buttonUrl'] ) : '';

$textAlign = isset( $attributes['textAlign'] ) ? sanitize_key( $attributes['textAlign'] ) : 'center';
$textAlign = in_array( $textAlign, [ 'left', 'center', 'right' ], true ) ? $textAlign : 'center';

$fontWeight = isset( $attributes['fontWeight'] ) ? preg_replace( '/[^0-9a-z]/i', '', (string) $attributes['fontWeight'] ) : '500';
if ( '' === $fontWeight ) {
	$fontWeight = '500';
}

$backgroundColor = $sanitizeColor( $attributes['backgroundColor'] ?? '', '#1a1a2e' );
$textColor       = $sanitizeColor( $attributes['textColor'] ?? '', '#ffffff' );
$buttonBgColor   = $sanitizeColor( $attributes['buttonBgColor'] ?? '', '#e94560' );
$buttonTextColor = $sanitizeColor( $attributes['buttonTextColor'] ?? '', '#ffffff' );

$buttonBorderRadius = $clampInt( $attributes['buttonBorderRadius'] ?? 4, 0, 50, 4 );
$paddingVertical    = $clampInt( $attributes['paddingVertical'] ?? 12, 0, 60, 12 );
$paddingHorizontal  = $clampInt( $attributes['paddingHorizontal'] ?? 20, 0, 100, 20 );
$fontSize           = $clampInt( $attributes['fontSize'] ?? 15, 10, 30, 15 );
$zIndex             = $clampInt( $attributes['zIndex'] ?? 9999, 100, 99999, 9999 );

// Use the unique render-time id as the localStorage dismissal key fallback so
// duplicated blocks on the same page can be dismissed independently. Editor
// may supply a stable per-instance key via attribute; honor it when present.
$dismissAttrKey = isset( $attributes['dismissStorageKey'] ) ? sanitize_key( (string) $attributes['dismissStorageKey'] ) : '';
$dismissKey     = 'bb-notification-bar-dismissed-' . ( '' !== $dismissAttrKey ? $dismissAttrKey : $id );

$wrapperClasses = trim(
	$planClass
	. ' bb-nb-position-' . $position
	. ( $isSticky ? ' bb-nb-sticky' : ' bb-nb-static' )
	. ' bb-nb-align-' . $textAlign
);

// Build sanitized inline CSS for this instance.
$css  = "#$id.bb-nb-wrap {";
$css .= "--bb-nb-bg: $backgroundColor;";
$css .= "--bb-nb-color: $textColor;";
$css .= "--bb-nb-padding-y: {$paddingVertical}px;";
$css .= "--bb-nb-padding-x: {$paddingHorizontal}px;";
$css .= "--bb-nb-font-size: {$fontSize}px;";
$css .= "--bb-nb-font-weight: $fontWeight;";
$css .= "--bb-nb-z: $zIndex;";
$css .= "--bb-nb-btn-bg: $buttonBgColor;";
$css .= "--bb-nb-btn-color: $buttonTextColor;";
$css .= "--bb-nb-btn-radius: {$buttonBorderRadius}px;";
$css .= "}";

// View.js configuration.
$viewConfig = [
	'dismissKey'    => $dismissKey,
	'position'      => $position,
	'isSticky'      => $isSticky,
	'isDismissible' => $isDismissible,
];

// Pre-paint script: hide the bar immediately if already dismissed. Inline so
// it runs before the bar paints — prevents the "flash of visible bar".
$prePaintScript  = '(function(){try{';
$prePaintScript .= 'if(localStorage.getItem(' . wp_json_encode( $dismissKey ) . ')==="1"){';
$prePaintScript .= 'var el=document.getElementById(' . wp_json_encode( $id ) . ');';
$prePaintScript .= 'if(el){el.style.display="none";el.setAttribute("data-bb-nb-dismissed","1");}';
$prePaintScript .= '}}catch(e){}})();';

// Build accessible CTA aria-label (suffix " (opens in new tab)" when applicable).
$ctaAriaLabel = '';
if ( $openNewTab && '' !== trim( $buttonText ) ) {
	/* translators: %s: CTA button label */
	$ctaAriaLabel = sprintf( __( '%s (opens in new tab)', 'b-blocks' ), wp_strip_all_tags( $buttonText ) );
}
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => 'bb-nb-wrap ' . $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	role='region'
	aria-label='<?php echo esc_attr__( 'Notification bar', 'b-blocks' ); ?>'
	data-bb-notification-bar='<?php echo esc_attr( $id ); ?>'
	data-bb-config='<?php echo esc_attr( wp_json_encode( $viewConfig ) ); ?>'
><script>
	<?php echo wp_strip_all_tags( $prePaintScript ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- inline pre-paint script; values are wp_json_encode'd. ?>
</script>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-nb-inner'>
		<?php if ( '' !== trim( wp_strip_all_tags( $message ) ) ) : ?>
			<span class='bb-nb-message'>
				<?php echo wp_kses_post( $message ); ?>
			</span>
		<?php endif; ?>

		<?php if ( $showButton && '' !== trim( $buttonText ) ) : ?>
			<a
				class='bb-nb-button'
				href='<?php echo esc_url( '' !== $buttonUrl ? $buttonUrl : '#' ); ?>'
				<?php if ( $openNewTab ) : ?>
					target='_blank'
					rel='noopener noreferrer'
				<?php endif; ?>
				<?php if ( '' !== $ctaAriaLabel ) : ?>
					aria-label='<?php echo esc_attr( $ctaAriaLabel ); ?>'
				<?php endif; ?>
			>
				<?php echo esc_html( $buttonText ); ?>
			</a>
		<?php endif; ?>
	</div>

	<?php if ( $isDismissible ) : ?>
		<button
			type='button'
			class='bb-nb-close'
			aria-label='<?php echo esc_attr__( 'Close notification bar', 'b-blocks' ); ?>'
			data-bb-nb-close='<?php echo esc_attr( $id ); ?>'
		>
			<span aria-hidden='true'>&times;</span>
		</button>
	<?php endif; ?>
</div>
