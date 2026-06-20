<?php
/**
 * Off-Canvas Drawer block server-side render.
 *
 * Renders:
 *  - A trigger button.
 *  - A backdrop overlay and a slide-in panel containing the inner block content.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksOffCanvas';
$id        = wp_unique_id( "$prefix-" );
$panelId   = $id . '-panel';
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

// --- Inline SVG for the trigger icon -----------------------------------
$renderTriggerIcon = static function ( $iconSlug ) {
	$iconSlug = (string) $iconSlug;
	if ( '' === $iconSlug || 'none' === $iconSlug ) {
		return '';
	}
	$paths = [
		'menu'        => 'M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z',
		'arrow-right' => 'M5 11h11.17l-4.88-4.88L13 5l7 7-7 7-1.41-1.41L16.17 13H5z',
		'arrow-left'  => 'M19 11H7.83l4.88-4.88L11 5l-7 7 7 7 1.41-1.41L7.83 13H19z',
	];
	if ( ! isset( $paths[ $iconSlug ] ) ) {
		return '';
	}
	return sprintf(
		"<svg class='bb-oc-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' aria-hidden='true' focusable='false'><path fill='currentColor' d='%s' /></svg>",
		esc_attr( $paths[ $iconSlug ] )
	);
};

// --- Resolve and sanitize attributes -----------------------------------
$drawerSide        = isset( $attributes['drawerSide'] ) ? sanitize_key( $attributes['drawerSide'] ) : 'left';
$drawerSide        = in_array( $drawerSide, [ 'left', 'right' ], true ) ? $drawerSide : 'left';

$drawerWidth       = isset( $attributes['drawerWidth'] ) ? (int) $attributes['drawerWidth'] : 320;
$drawerWidth       = max( 200, min( 600, $drawerWidth ) );

$showOverlay       = isset( $attributes['showOverlay'] ) ? (bool) $attributes['showOverlay'] : true;
$overlayColor      = $sanitizeColor( isset( $attributes['overlayColor'] ) ? $attributes['overlayColor'] : 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.5)' );

$triggerLabel      = isset( $attributes['triggerLabel'] ) ? (string) $attributes['triggerLabel'] : __( 'Open Menu', 'b-blocks' );
$triggerIcon       = isset( $attributes['triggerIcon'] ) ? sanitize_key( $attributes['triggerIcon'] ) : 'menu';
$triggerIcon       = in_array( $triggerIcon, [ 'none', 'menu', 'arrow-right', 'arrow-left' ], true ) ? $triggerIcon : 'menu';

$triggerAlign      = isset( $attributes['triggerAlign'] ) ? sanitize_key( $attributes['triggerAlign'] ) : 'left';
$triggerAlign      = in_array( $triggerAlign, [ 'left', 'center', 'right' ], true ) ? $triggerAlign : 'left';

$closeLabel        = isset( $attributes['closeLabel'] ) ? (string) $attributes['closeLabel'] : __( 'Close', 'b-blocks' );
if ( '' === trim( $closeLabel ) ) {
	$closeLabel = __( 'Close', 'b-blocks' );
}

$drawerBgColor     = $sanitizeColor( isset( $attributes['drawerBgColor'] ) ? $attributes['drawerBgColor'] : '#ffffff', '#ffffff' );
$triggerBgColor    = $sanitizeColor( isset( $attributes['triggerBgColor'] ) ? $attributes['triggerBgColor'] : '#1e1e1e', '#1e1e1e' );
$triggerTextColor  = $sanitizeColor( isset( $attributes['triggerTextColor'] ) ? $attributes['triggerTextColor'] : '#ffffff', '#ffffff' );

$triggerRadius     = isset( $attributes['triggerBorderRadius'] ) ? (int) $attributes['triggerBorderRadius'] : 4;
$triggerRadius     = max( 0, min( 50, $triggerRadius ) );

$drawerPadding     = isset( $attributes['drawerPadding'] ) ? (int) $attributes['drawerPadding'] : 24;
$drawerPadding     = max( 0, min( 80, $drawerPadding ) );

$animationDuration = isset( $attributes['animationDuration'] ) ? (int) $attributes['animationDuration'] : 300;
$animationDuration = max( 0, min( 2000, $animationDuration ) );

// Effective trigger label (we always need an accessible name).
$accessibleLabel = '' !== trim( $triggerLabel ) ? $triggerLabel : __( 'Open drawer', 'b-blocks' );

// Build sanitized inline CSS for this instance.
// Custom properties are set on the wrapper (#$id) so that both .bb-oc-panel and
// .bb-oc-overlay (which are siblings inside the wrapper) inherit them correctly.
$css  = "#$id {";
$css .= "text-align: $triggerAlign;";
$css .= "--bb-oc-duration: {$animationDuration}ms;";
$css .= "--bb-oc-width: {$drawerWidth}px;";
$css .= "--bb-oc-bg: $drawerBgColor;";
$css .= "--bb-oc-padding: {$drawerPadding}px;";
$css .= "--bb-oc-overlay: " . ( $showOverlay ? $overlayColor : 'transparent' ) . ";";
$css .= "}";
$css .= "#$id .bb-oc-trigger {";
$css .= "background-color: $triggerBgColor;";
$css .= "color: $triggerTextColor;";
$css .= "border-radius: {$triggerRadius}px;";
$css .= "}";
$css .= "@media (prefers-reduced-motion: reduce) { #$id { --bb-oc-duration: 0ms; } }";

// View.js configuration.
$viewConfig = [
	'panelId'      => $panelId,
	'drawerSide'   => $drawerSide,
	'showOverlay'  => $showOverlay,
	'animationMs'  => $animationDuration,
];

$wrapperClasses = trim( $planClass . ' bb-oc-align-' . $triggerAlign );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	data-off-canvas-config='<?php echo esc_attr( wp_json_encode( $viewConfig ) ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<button
		type='button'
		class='bb-oc-trigger'
		aria-haspopup='dialog'
		aria-expanded='false'
		aria-controls='<?php echo esc_attr( $panelId ); ?>'
		<?php if ( '' === trim( $triggerLabel ) ) : ?>
			aria-label='<?php echo esc_attr( $accessibleLabel ); ?>'
		<?php endif; ?>
		data-off-canvas-trigger='<?php echo esc_attr( $id ); ?>'
	>
		<?php echo $renderTriggerIcon( $triggerIcon ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- output is internally escaped in $renderTriggerIcon ?>
		<?php if ( '' !== trim( $triggerLabel ) ) : ?>
			<span class='bb-oc-trigger-label'><?php echo esc_html( $triggerLabel ); ?></span>
		<?php endif; ?>
	</button>

	<div
		class='bb-oc-overlay'
		data-off-canvas-overlay='<?php echo esc_attr( $id ); ?>'
		hidden
	></div>

	<aside
		id='<?php echo esc_attr( $panelId ); ?>'
		class='bb-oc-panel bb-oc-side-<?php echo esc_attr( $drawerSide ); ?>'
		role='dialog'
		aria-modal='true'
		aria-label='<?php echo esc_attr( $accessibleLabel ); ?>'
		data-off-canvas-panel='<?php echo esc_attr( $id ); ?>'
		tabindex='-1'
		hidden
	>
		<button
			type='button'
			class='bb-oc-close'
			aria-label='<?php echo esc_attr( $closeLabel ); ?>'
			data-off-canvas-close='<?php echo esc_attr( $id ); ?>'
		>
			<span aria-hidden='true'>&times;</span>
		</button>
		<div class='bb-oc-content'>
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- $content is rendered InnerBlocks output already escaped by core.
			echo $content;
			?>
		</div>
	</aside>
</div>
