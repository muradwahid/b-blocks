<?php
/**
 * Promo Strip block server-side render.
 *
 * Renders a full-width promotional strip composed of a headline, an optional
 * subtext, a live countdown timer (days / hours / minutes / seconds), and an
 * optional CTA button. The timer is hydrated on the frontend by view.js, which
 * reads the destination date and expiry behavior from data attributes.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksPromoStrip';
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
$headlineText = isset( $attributes['headlineText'] ) ? (string) $attributes['headlineText'] : '';
$subText      = isset( $attributes['subText'] ) ? (string) $attributes['subText'] : '';

$headlineTag = isset( $attributes['headlineTag'] ) ? sanitize_key( (string) $attributes['headlineTag'] ) : 'p';
$headlineTag = in_array( $headlineTag, [ 'p', 'h2', 'h3', 'h4' ], true ) ? $headlineTag : 'p';

$layout = isset( $attributes['layout'] ) ? sanitize_key( (string) $attributes['layout'] ) : 'horizontal';
$layout = in_array( $layout, [ 'horizontal', 'stacked' ], true ) ? $layout : 'horizontal';

$onExpire = isset( $attributes['onExpire'] ) ? sanitize_key( (string) $attributes['onExpire'] ) : 'hide';
$onExpire = in_array( $onExpire, [ 'hide', 'message' ], true ) ? $onExpire : 'hide';

$showDays    = isset( $attributes['showDays'] ) ? (bool) $attributes['showDays'] : true;
$showHours   = isset( $attributes['showHours'] ) ? (bool) $attributes['showHours'] : true;
$showMinutes = isset( $attributes['showMinutes'] ) ? (bool) $attributes['showMinutes'] : true;
$showSeconds = isset( $attributes['showSeconds'] ) ? (bool) $attributes['showSeconds'] : true;
$showButton  = isset( $attributes['showButton'] ) ? (bool) $attributes['showButton'] : true;
$buttonNewTab = isset( $attributes['buttonNewTab'] ) ? (bool) $attributes['buttonNewTab'] : false;

$daysLabel    = isset( $attributes['daysLabel'] ) ? (string) $attributes['daysLabel'] : __( 'Days', 'b-blocks' );
$hoursLabel   = isset( $attributes['hoursLabel'] ) ? (string) $attributes['hoursLabel'] : __( 'Hours', 'b-blocks' );
$minutesLabel = isset( $attributes['minutesLabel'] ) ? (string) $attributes['minutesLabel'] : __( 'Minutes', 'b-blocks' );
$secondsLabel = isset( $attributes['secondsLabel'] ) ? (string) $attributes['secondsLabel'] : __( 'Seconds', 'b-blocks' );

$buttonLabel    = isset( $attributes['buttonLabel'] ) ? (string) $attributes['buttonLabel'] : '';
$buttonUrl      = isset( $attributes['buttonUrl'] ) ? esc_url_raw( (string) $attributes['buttonUrl'] ) : '';
$expiredMessage = isset( $attributes['expiredMessage'] ) ? (string) $attributes['expiredMessage'] : '';

// destDate is an ISO 8601 local datetime (YYYY-MM-DDTHH:MM). Validate loosely.
$destDate = isset( $attributes['destDate'] ) ? trim( (string) $attributes['destDate'] ) : '';
if ( '' !== $destDate && ! preg_match( '/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/', $destDate ) ) {
	$destDate = '';
}

$fontWeight = isset( $attributes['fontWeight'] ) ? preg_replace( '/[^0-9]/', '', (string) $attributes['fontWeight'] ) : '700';
if ( '' === $fontWeight ) {
	$fontWeight = '700';
}

$backgroundColor     = $sanitizeColor( $attributes['backgroundColor'] ?? '', '#1a1a2e' );
$textColor           = $sanitizeColor( $attributes['textColor'] ?? '', '#ffffff' );
$timerDigitColor     = $sanitizeColor( $attributes['timerDigitColor'] ?? '', '#ffffff' );
$timerLabelColor     = $sanitizeColor( $attributes['timerLabelColor'] ?? '', '#cccccc' );
$timerSeparatorColor = $sanitizeColor( $attributes['timerSeparatorColor'] ?? '', '#ffffff' );
$buttonBg            = $sanitizeColor( $attributes['buttonBg'] ?? '', '#e63946' );
$buttonTextColor     = $sanitizeColor( $attributes['buttonTextColor'] ?? '', '#ffffff' );
$buttonHoverBg       = $sanitizeColor( $attributes['buttonHoverBg'] ?? '', '#c1121f' );
$buttonHoverTextColor = $sanitizeColor( $attributes['buttonHoverTextColor'] ?? '', '#ffffff' );

$buttonBorderRadius = $clampInt( $attributes['buttonBorderRadius'] ?? 4, 0, 9999, 4 );
$buttonPaddingV     = $clampInt( $attributes['buttonPaddingV'] ?? 10, 0, 48, 10 );
$buttonPaddingH     = $clampInt( $attributes['buttonPaddingH'] ?? 24, 0, 80, 24 );
$fontSize           = $clampInt( $attributes['fontSize'] ?? 16, 12, 48, 16 );
$timerDigitSize     = $clampInt( $attributes['timerDigitSize'] ?? 32, 16, 64, 32 );
$timerLabelSize     = $clampInt( $attributes['timerLabelSize'] ?? 12, 8, 24, 12 );
$paddingV           = $clampInt( $attributes['paddingV'] ?? 16, 0, 96, 16 );
$paddingH           = $clampInt( $attributes['paddingH'] ?? 24, 0, 120, 24 );
$contentMaxWidth    = $clampInt( $attributes['contentMaxWidth'] ?? 1200, 0, 1800, 1200 );
$zIndex             = $clampInt( $attributes['zIndex'] ?? 10, 1, 9999, 10 );

$maxWidthCss = $contentMaxWidth > 0 ? ( $contentMaxWidth . 'px' ) : 'none';

// Accessible section label derived from the headline (HTML stripped).
$sectionLabel = trim( wp_strip_all_tags( $headlineText ) );
if ( '' === $sectionLabel ) {
	$sectionLabel = __( 'Promotional offer', 'b-blocks' );
}

// Build the list of active units so the timer markup and separators line up.
$units = [];
if ( $showDays ) {
	$units[] = [ 'key' => 'days', 'label' => $daysLabel ];
}
if ( $showHours ) {
	$units[] = [ 'key' => 'hours', 'label' => $hoursLabel ];
}
if ( $showMinutes ) {
	$units[] = [ 'key' => 'minutes', 'label' => $minutesLabel ];
}
if ( $showSeconds ) {
	$units[] = [ 'key' => 'seconds', 'label' => $secondsLabel ];
}

$wrapperClasses = trim(
	'bb-ps ' . $planClass
	. ' bb-ps-layout-' . $layout
);

// Per-instance CSS variables.
$css  = "#$id.bb-ps {";
$css .= "--bb-ps-bg: $backgroundColor;";
$css .= "--bb-ps-color: $textColor;";
$css .= "--bb-ps-pad-y: {$paddingV}px;";
$css .= "--bb-ps-pad-x: {$paddingH}px;";
$css .= "--bb-ps-max-w: $maxWidthCss;";
$css .= "--bb-ps-z: $zIndex;";
$css .= "--bb-ps-font-size: {$fontSize}px;";
$css .= "--bb-ps-font-weight: $fontWeight;";
$css .= "--bb-ps-digit-color: $timerDigitColor;";
$css .= "--bb-ps-label-color: $timerLabelColor;";
$css .= "--bb-ps-sep-color: $timerSeparatorColor;";
$css .= "--bb-ps-digit-size: {$timerDigitSize}px;";
$css .= "--bb-ps-label-size: {$timerLabelSize}px;";
$css .= "--bb-ps-btn-bg: $buttonBg;";
$css .= "--bb-ps-btn-text: $buttonTextColor;";
$css .= "--bb-ps-btn-hover-bg: $buttonHoverBg;";
$css .= "--bb-ps-btn-hover-text: $buttonHoverTextColor;";
$css .= "--bb-ps-btn-radius: {$buttonBorderRadius}px;";
$css .= "--bb-ps-btn-pad-y: {$buttonPaddingV}px;";
$css .= "--bb-ps-btn-pad-x: {$buttonPaddingH}px;";
$css .= "}";

// Accessible CTA aria-label (suffix when opening in a new tab).
$ctaAriaLabel = '';
if ( $buttonNewTab && '' !== trim( $buttonLabel ) ) {
	/* translators: %s: CTA button label */
	$ctaAriaLabel = sprintf( __( '%s (opens in a new tab)', 'b-blocks' ), wp_strip_all_tags( $buttonLabel ) );
}
?>
<section
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
	aria-label='<?php echo esc_attr( $sectionLabel ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-ps-inner'>
		<div class='bb-ps-text'>
			<?php
			printf(
				'<%1$s class="bb-ps-headline">%2$s</%1$s>',
				tag_escape( $headlineTag ),
				wp_kses_post( $headlineText )
			);
			?>

			<?php if ( '' !== trim( $subText ) ) : ?>
				<p class='bb-ps-subtext'><?php echo esc_html( $subText ); ?></p>
			<?php endif; ?>
		</div>

		<?php if ( ! empty( $units ) ) : ?>
			<div
				class='bb-ps-timer'
				role='timer'
				aria-label='<?php echo esc_attr__( 'Countdown timer', 'b-blocks' ); ?>'
				aria-live='off'
				aria-atomic='false'
				aria-valuenow='0'
				data-bb-ps-dest='<?php echo esc_attr( $destDate ); ?>'
				data-bb-ps-on-expire='<?php echo esc_attr( $onExpire ); ?>'
				data-bb-ps-expired-msg='<?php echo esc_attr( wp_strip_all_tags( $expiredMessage ) ); ?>'
			>
				<?php foreach ( $units as $index => $unit ) : ?>
					<?php if ( $index > 0 ) : ?>
						<span class='bb-ps-sep' aria-hidden='true'>:</span>
					<?php endif; ?>
					<span class='bb-ps-unit bb-ps-unit-<?php echo esc_attr( $unit['key'] ); ?>'>
						<span class='bb-ps-digit' data-bb-ps-unit='<?php echo esc_attr( $unit['key'] ); ?>'>00</span>
						<span class='bb-ps-unit-label'><?php echo esc_html( $unit['label'] ); ?></span>
					</span>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<?php if ( $showButton && '' !== trim( $buttonLabel ) ) : ?>
			<?php if ( '' !== $buttonUrl ) : ?>
				<a
					class='bb-ps-button'
					href='<?php echo esc_url( $buttonUrl ); ?>'
					<?php if ( $buttonNewTab ) : ?>
						target='_blank'
						rel='noopener noreferrer'
					<?php endif; ?>
					<?php if ( '' !== $ctaAriaLabel ) : ?>
						aria-label='<?php echo esc_attr( $ctaAriaLabel ); ?>'
					<?php endif; ?>
				>
					<?php echo esc_html( $buttonLabel ); ?>
					<?php if ( $buttonNewTab ) : ?>
						<span class='screen-reader-text'><?php echo esc_html__( '(opens in a new tab)', 'b-blocks' ); ?></span>
					<?php endif; ?>
				</a>
			<?php else : ?>
				<button type='button' class='bb-ps-button'>
					<?php echo esc_html( $buttonLabel ); ?>
				</button>
			<?php endif; ?>
		<?php endif; ?>
	</div>
</section>
