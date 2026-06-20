<?php
/**
 * Expand Content block server-side render.
 *
 * Renders InnerBlocks inside a wrapper that is clamped to `previewHeight`
 * on the frontend until a toggle button reveals the rest.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as static
 * closures (the same pattern used in off-canvas and faq-block).
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksExpandContent';
$id        = wp_unique_id( "$prefix-" );
$contentId = $id . '-content';
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

// --- Resolve and sanitize attributes -----------------------------------
$previewHeight     = isset( $attributes['previewHeight'] ) ? (int) $attributes['previewHeight'] : 200;
$previewHeight     = max( 50, min( 1200, $previewHeight ) );

$fadeHeight        = isset( $attributes['fadeHeight'] ) ? (int) $attributes['fadeHeight'] : 80;
$fadeHeight        = max( 0, min( 400, $fadeHeight ) );

$showMoreText      = isset( $attributes['showMoreText'] ) ? (string) $attributes['showMoreText'] : __( 'Show More', 'b-blocks' );
if ( '' === trim( $showMoreText ) ) {
	$showMoreText = __( 'Show More', 'b-blocks' );
}
$showLessText      = isset( $attributes['showLessText'] ) ? (string) $attributes['showLessText'] : __( 'Show Less', 'b-blocks' );
if ( '' === trim( $showLessText ) ) {
	$showLessText = __( 'Show Less', 'b-blocks' );
}

$showToggle        = isset( $attributes['showToggle'] ) ? (bool) $attributes['showToggle'] : true;
$persistState      = isset( $attributes['persistState'] ) ? (bool) $attributes['persistState'] : false;

$buttonAlign       = isset( $attributes['buttonAlign'] ) ? sanitize_key( (string) $attributes['buttonAlign'] ) : 'center';
$buttonAlign       = in_array( $buttonAlign, [ 'left', 'center', 'right' ], true ) ? $buttonAlign : 'center';

$fadeColor         = $sanitizeColor( $attributes['fadeColor'] ?? '#ffffff', '#ffffff' );
$buttonBgColor     = $sanitizeColor( $attributes['buttonBgColor'] ?? '#0073aa', '#0073aa' );
$buttonTextColor   = $sanitizeColor( $attributes['buttonTextColor'] ?? '#ffffff', '#ffffff' );

$buttonRadius      = isset( $attributes['buttonBorderRadius'] ) ? (int) $attributes['buttonBorderRadius'] : 4;
$buttonRadius      = max( 0, min( 50, $buttonRadius ) );

$buttonPaddingV    = isset( $attributes['buttonPaddingV'] ) ? (int) $attributes['buttonPaddingV'] : 10;
$buttonPaddingV    = max( 4, min( 40, $buttonPaddingV ) );

$buttonPaddingH    = isset( $attributes['buttonPaddingH'] ) ? (int) $attributes['buttonPaddingH'] : 20;
$buttonPaddingH    = max( 8, min( 80, $buttonPaddingH ) );

$buttonFontSize    = isset( $attributes['buttonFontSize'] ) ? (int) $attributes['buttonFontSize'] : 14;
$buttonFontSize    = max( 10, min( 28, $buttonFontSize ) );

$animationDuration = isset( $attributes['animationDuration'] ) ? (int) $attributes['animationDuration'] : 300;
$animationDuration = max( 0, min( 1000, $animationDuration ) );

// Build sanitized inline CSS for this instance.
$css  = "#$id {";
$css .= "--bb-ec-preview-height: {$previewHeight}px;";
$css .= "--bb-ec-fade-height: {$fadeHeight}px;";
$css .= "--bb-ec-fade-color: $fadeColor;";
$css .= "--bb-ec-duration: {$animationDuration}ms;";
$css .= "}";
$css .= "#$id .bb-ec-toggle {";
$css .= "background-color: $buttonBgColor;";
$css .= "color: $buttonTextColor;";
$css .= "border-radius: {$buttonRadius}px;";
$css .= "padding: {$buttonPaddingV}px {$buttonPaddingH}px;";
$css .= "font-size: {$buttonFontSize}px;";
$css .= "}";
$css .= "#$id .bb-ec-toggle-wrap { text-align: $buttonAlign; }";
$css .= "@media (prefers-reduced-motion: reduce) { #$id { --bb-ec-duration: 0ms; } }";

// View.js configuration.
$viewConfig = [
	'contentId'     => $contentId,
	'previewHeight' => $previewHeight,
	'showMoreText'  => $showMoreText,
	'showLessText'  => $showLessText,
	'showToggle'    => $showToggle,
	'persistState'  => $persistState,
	'animationMs'   => $animationDuration,
];

$wrapperClasses = trim( $planClass . ' bb-ec' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-expand-content-config='<?php echo esc_attr( wp_json_encode( $viewConfig ) ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-ec-shell'>
		<div
			id='<?php echo esc_attr( $contentId ); ?>'
			class='bb-ec-content'
			data-expand-content-area
		>
			<div class='bb-ec-content__inner'>
				<?php
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is rendered InnerBlocks output already escaped by core.
				echo $content;
				?>
			</div>
		</div>
		<div
			class='bb-ec-fade'
			data-expand-content-fade
			aria-hidden='true'
		></div>
	</div>

	<div class='bb-ec-toggle-wrap'>
		<button
			type='button'
			class='bb-ec-toggle'
			aria-expanded='false'
			aria-controls='<?php echo esc_attr( $contentId ); ?>'
			data-expand-content-toggle
			hidden
		>
			<span class='bb-ec-toggle__label'><?php echo esc_html( $showMoreText ); ?></span>
		</button>
	</div>
</div>
