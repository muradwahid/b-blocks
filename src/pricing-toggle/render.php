<?php
/**
 * Pricing Toggle block server-side render.
 *
 * Renders an accessible monthly/annual billing-period switcher built around a
 * single `<button role="switch">`. The toggle emits a data-attribute protocol
 * (`data-bb-pt-default`, `data-bb-pt-group`) so theme price elements carrying
 * `data-bb-pt-monthly` / `data-bb-pt-annual` swap their text on click — no page
 * reload required.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksPricingToggle';
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
$monthlyLabel = isset( $attributes['monthlyLabel'] ) ? wp_strip_all_tags( (string) $attributes['monthlyLabel'] ) : 'Monthly';
$annualLabel  = isset( $attributes['annualLabel'] ) ? wp_strip_all_tags( (string) $attributes['annualLabel'] ) : 'Annually';
$badgeText    = isset( $attributes['badgeText'] ) ? wp_strip_all_tags( (string) $attributes['badgeText'] ) : 'Save 20%';

if ( '' === trim( $monthlyLabel ) ) { $monthlyLabel = __( 'Monthly', 'b-blocks' ); }
if ( '' === trim( $annualLabel ) ) { $annualLabel = __( 'Annually', 'b-blocks' ); }

$defaultPeriod = isset( $attributes['defaultPeriod'] ) ? sanitize_key( $attributes['defaultPeriod'] ) : 'monthly';
$defaultPeriod = in_array( $defaultPeriod, [ 'monthly', 'annual' ], true ) ? $defaultPeriod : 'monthly';
$isAnnual      = ( 'annual' === $defaultPeriod );

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( $attributes['alignment'] ) : 'center';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'center';

$showBadge = isset( $attributes['showBadge'] ) ? (bool) $attributes['showBadge'] : true;

$fontWeight = isset( $attributes['fontWeight'] ) ? preg_replace( '/[^0-9]/', '', (string) $attributes['fontWeight'] ) : '500';
if ( '' === $fontWeight ) {
	$fontWeight = '500';
}

$toggleBg        = $sanitizeColor( $attributes['toggleBg'] ?? '', '#e2e8f0' );
$toggleActiveBg  = $sanitizeColor( $attributes['toggleActiveBg'] ?? '', '#2563eb' );
$knobColor       = $sanitizeColor( $attributes['knobColor'] ?? '', '#ffffff' );
$labelColor      = $sanitizeColor( $attributes['labelColor'] ?? '', '' );
$activeLabelColor = $sanitizeColor( $attributes['activeLabelColor'] ?? '', '#2563eb' );
$badgeBg         = $sanitizeColor( $attributes['badgeBg'] ?? '', '#16a34a' );
$badgeTextColor  = $sanitizeColor( $attributes['badgeText_color'] ?? '', '#ffffff' );

$badgeBorderRadius = $clampInt( $attributes['badgeBorderRadius'] ?? 20, 0, 50, 20 );
$fontSize          = $clampInt( $attributes['fontSize'] ?? 16, 10, 32, 16 );
$gap               = $clampInt( $attributes['gap'] ?? 12, 4, 64, 12 );

$hasBadge = ( $showBadge && '' !== trim( $badgeText ) );

// The data-attribute group key. MVP supports a single "default" group so a lone
// toggle on the page works without extra configuration.
$group = 'default';

$wrapperClasses = trim( $planClass . ' bb-pt-wrap bb-pt-align-' . $alignment );

// Build sanitized inline CSS for this instance.
$css  = "#$id.bb-pt-wrap {";
$css .= "--bb-pt-track-bg: $toggleBg;";
$css .= "--bb-pt-track-active-bg: $toggleActiveBg;";
$css .= "--bb-pt-knob: $knobColor;";
$css .= '--bb-pt-label-color: ' . ( '' !== $labelColor ? $labelColor : 'inherit' ) . ';';
$css .= "--bb-pt-active-label-color: $activeLabelColor;";
$css .= "--bb-pt-font-size: {$fontSize}px;";
$css .= "--bb-pt-font-weight: $fontWeight;";
$css .= "--bb-pt-gap: {$gap}px;";
$css .= "--bb-pt-badge-bg: $badgeBg;";
$css .= "--bb-pt-badge-color: $badgeTextColor;";
$css .= "--bb-pt-badge-radius: {$badgeBorderRadius}px;";
$css .= '}';

$switchAriaLabel = $isAnnual
	/* translators: screen-reader label announcing the annual billing state */
	? __( 'Billing period: Annually', 'b-blocks' )
	/* translators: screen-reader label announcing the monthly billing state */
	: __( 'Billing period: Monthly', 'b-blocks' );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	role='group'
	aria-label='<?php echo esc_attr__( 'Billing period toggle', 'b-blocks' ); ?>'
	data-bb-pricing-toggle='<?php echo esc_attr( $id ); ?>'
	data-bb-pt-default='<?php echo esc_attr( $defaultPeriod ); ?>'
	data-bb-pt-group='<?php echo esc_attr( $group ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-pt-row'>
		<span class='bb-pt-label bb-pt-label-monthly<?php echo $isAnnual ? '' : ' is-active'; ?>' aria-hidden='true'>
			<?php echo esc_html( $monthlyLabel ); ?>
		</span>

		<button
			type='button'
			class='bb-pt-switch'
			role='switch'
			aria-checked='<?php echo esc_attr( $isAnnual ? 'true' : 'false' ); ?>'
			aria-label='<?php echo esc_attr( $switchAriaLabel ); ?>'
			data-bb-pt-monthly-label='<?php echo esc_attr( $monthlyLabel ); ?>'
			data-bb-pt-annual-label='<?php echo esc_attr( $annualLabel ); ?>'
		>
			<span class='bb-pt-knob' aria-hidden='true'></span>
		</button>

		<span class='bb-pt-label bb-pt-label-annual<?php echo $isAnnual ? ' is-active' : ''; ?>' aria-hidden='true'>
			<?php echo esc_html( $annualLabel ); ?>

			<?php if ( $hasBadge ) : ?>
				<span class='bb-pt-badge' aria-hidden='true'><?php echo esc_html( $badgeText ); ?></span>
			<?php endif; ?>
		</span>
	</div>
</div>
