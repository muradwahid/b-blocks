<?php
/**
 * Urgency Timer block server-side render.
 *
 * Renders a 100% client-side urgency countdown. The timer can run in two modes:
 *
 *  - "evergreen": a per-visitor deadline computed on first visit (now + duration)
 *    and persisted in localStorage so a returning visitor sees the real remaining
 *    time. view.js owns this logic.
 *  - "recurring": a deadline derived from the next occurrence of a configured
 *    weekday/hour minus a window duration, so it resets automatically each week.
 *
 * The markup ships zero-padded "00" digits and a JSON config blob on the timer
 * wrapper; view.js hydrates the digits, ticks once a second via textContent
 * (never innerHTML), and runs the expiry action.
 *
 * No global helper functions are declared here intentionally — Gutenberg may
 * include this file more than once per request, which would cause a
 * "Cannot redeclare function" fatal. All helpers are inlined as closures.
 *
 * @package bBlocks
 */

$prefix    = 'bBlocksUrgencyTimer';
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
	if ( $value < $min ) {
		return (int) $min;
	}
	if ( $value > $max ) {
		return (int) $max;
	}
	return $value;
};

// --- Mode ---
$timerMode = isset( $attributes['timerMode'] ) ? sanitize_key( (string) $attributes['timerMode'] ) : 'evergreen';
$timerMode = in_array( $timerMode, [ 'evergreen', 'recurring' ], true ) ? $timerMode : 'evergreen';

// --- Evergreen duration ---
$evergreenDays    = $clampInt( $attributes['evergreenDays'] ?? 1, 0, 365, 1 );
$evergreenHours   = $clampInt( $attributes['evergreenHours'] ?? 0, 0, 23, 0 );
$evergreenMinutes = $clampInt( $attributes['evergreenMinutes'] ?? 0, 0, 59, 0 );
$evergreenSeconds = $clampInt( $attributes['evergreenSeconds'] ?? 0, 0, 59, 0 );

// --- Recurring schedule + window ---
$recurringResetDay = isset( $attributes['recurringResetDay'] ) ? sanitize_key( (string) $attributes['recurringResetDay'] ) : 'monday';
$allowedDays       = [ 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday' ];
$recurringResetDay = in_array( $recurringResetDay, $allowedDays, true ) ? $recurringResetDay : 'monday';

$recurringResetHour = $clampInt( $attributes['recurringResetHour'] ?? 0, 0, 23, 0 );
$recurringDays      = $clampInt( $attributes['recurringDays'] ?? 0, 0, 365, 0 );
$recurringHours     = $clampInt( $attributes['recurringHours'] ?? 24, 0, 168, 24 );
$recurringMinutes   = $clampInt( $attributes['recurringMinutes'] ?? 0, 0, 59, 0 );
$recurringSeconds   = $clampInt( $attributes['recurringSeconds'] ?? 0, 0, 59, 0 );

// storageKey: restrict to a safe, predictable character set; blank => auto.
$storageKey = isset( $attributes['storageKey'] ) ? (string) $attributes['storageKey'] : '';
$storageKey = preg_replace( '/[^A-Za-z0-9_\-]/', '', $storageKey );
if ( '' === $storageKey ) {
	$storageKey = 'bb-ut-' . $id;
}

// --- Units ---
$showDays    = isset( $attributes['showDays'] ) ? (bool) $attributes['showDays'] : true;
$showHours   = isset( $attributes['showHours'] ) ? (bool) $attributes['showHours'] : true;
$showMinutes = isset( $attributes['showMinutes'] ) ? (bool) $attributes['showMinutes'] : true;
$showSeconds = isset( $attributes['showSeconds'] ) ? (bool) $attributes['showSeconds'] : true;

$daysLabel    = isset( $attributes['daysLabel'] ) ? sanitize_text_field( (string) $attributes['daysLabel'] ) : __( 'Days', 'b-blocks' );
$hoursLabel   = isset( $attributes['hoursLabel'] ) ? sanitize_text_field( (string) $attributes['hoursLabel'] ) : __( 'Hours', 'b-blocks' );
$minutesLabel = isset( $attributes['minutesLabel'] ) ? sanitize_text_field( (string) $attributes['minutesLabel'] ) : __( 'Minutes', 'b-blocks' );
$secondsLabel = isset( $attributes['secondsLabel'] ) ? sanitize_text_field( (string) $attributes['secondsLabel'] ) : __( 'Seconds', 'b-blocks' );

// --- Expiry ---
$expiredAction = isset( $attributes['expiredAction'] ) ? sanitize_key( (string) $attributes['expiredAction'] ) : 'message';
$expiredAction = in_array( $expiredAction, [ 'message', 'hide' ], true ) ? $expiredAction : 'message';
$expiredMessage = isset( $attributes['expiredMessage'] ) ? sanitize_text_field( (string) $attributes['expiredMessage'] ) : '';

// --- Content ---
$prefixText = isset( $attributes['prefixText'] ) ? sanitize_text_field( (string) $attributes['prefixText'] ) : '';
$suffixText = isset( $attributes['suffixText'] ) ? sanitize_text_field( (string) $attributes['suffixText'] ) : '';

$alignment = isset( $attributes['alignment'] ) ? sanitize_key( (string) $attributes['alignment'] ) : 'center';
$alignment = in_array( $alignment, [ 'left', 'center', 'right' ], true ) ? $alignment : 'center';

$boxLayout = isset( $attributes['boxLayout'] ) ? sanitize_key( (string) $attributes['boxLayout'] ) : 'boxed';
$boxLayout = in_array( $boxLayout, [ 'boxed', 'plain' ], true ) ? $boxLayout : 'boxed';

$separatorVisible = isset( $attributes['separatorVisible'] ) ? (bool) $attributes['separatorVisible'] : true;

// --- Dimensions ---
$maxWidth   = $clampInt( $attributes['maxWidth'] ?? 600, 0, 1800, 600 );
$boxWidth   = $clampInt( $attributes['boxWidth'] ?? 80, 32, 240, 80 );
$boxHeight  = $clampInt( $attributes['boxHeight'] ?? 80, 32, 240, 80 );
$boxGap     = $clampInt( $attributes['boxGap'] ?? 12, 0, 60, 12 );
$boxRadius  = $clampInt( $attributes['boxRadius'] ?? 8, 0, 50, 8 );
$digitSize  = $clampInt( $attributes['digitSize'] ?? 36, 12, 96, 36 );
$labelSize  = $clampInt( $attributes['labelSize'] ?? 13, 8, 32, 13 );
$prefixSize = $clampInt( $attributes['prefixSize'] ?? 18, 10, 64, 18 );
$suffixSize = $clampInt( $attributes['suffixSize'] ?? 14, 10, 48, 14 );
$expiredSize = $clampInt( $attributes['expiredSize'] ?? 16, 10, 48, 16 );
$paddingV   = $clampInt( $attributes['paddingV'] ?? 20, 0, 120, 20 );
$paddingH   = $clampInt( $attributes['paddingH'] ?? 20, 0, 120, 20 );

// --- Colors ---
$digitBg       = $sanitizeColor( $attributes['digitBg'] ?? '', '#146EF5' );
$digitColor    = $sanitizeColor( $attributes['digitColor'] ?? '', '#ffffff' );
$labelColor    = $sanitizeColor( $attributes['labelColor'] ?? '', '#ffffff' );
$separatorColor = $sanitizeColor( $attributes['separatorColor'] ?? '', '#146EF5' );
$prefixColor   = $sanitizeColor( $attributes['prefixColor'] ?? '', '#222222' );
$suffixColor   = $sanitizeColor( $attributes['suffixColor'] ?? '', '#555555' );
$expiredColor  = $sanitizeColor( $attributes['expiredColor'] ?? '', '#cc0000' );
$blockBg       = $sanitizeColor( $attributes['blockBg'] ?? '', 'transparent' );

$maxWidthCss = $maxWidth > 0 ? ( $maxWidth . 'px' ) : 'none';

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

// Frontend config blob. All values are already sanitized / clamped above.
$config = [
	'mode'        => $timerMode,
	'evergreen'   => [
		'days'    => $evergreenDays,
		'hours'   => $evergreenHours,
		'minutes' => $evergreenMinutes,
		'seconds' => $evergreenSeconds,
	],
	'recurring'   => [
		'resetDay'  => array_search( $recurringResetDay, $allowedDays, true ) + 1, // 1=Mon..7=Sun (ISO).
		'resetHour' => $recurringResetHour,
		'days'      => $recurringDays,
		'hours'     => $recurringHours,
		'minutes'   => $recurringMinutes,
		'seconds'   => $recurringSeconds,
	],
	'storageKey'  => $storageKey,
	'onExpire'    => $expiredAction,
	'units'       => wp_list_pluck( $units, 'key' ),
];

$wrapperClasses = trim(
	'bb-ut ' . $planClass
	. ' bb-ut-layout-' . $boxLayout
	. ' bb-ut-align-' . $alignment
);

// Per-instance CSS variables.
$css  = "#$id.bb-ut {";
$css .= "--bb-ut-bg: $blockBg;";
$css .= "--bb-ut-pad-y: {$paddingV}px;";
$css .= "--bb-ut-pad-x: {$paddingH}px;";
$css .= "--bb-ut-max-w: $maxWidthCss;";
$css .= "--bb-ut-digit-bg: $digitBg;";
$css .= "--bb-ut-digit-color: $digitColor;";
$css .= "--bb-ut-label-color: $labelColor;";
$css .= "--bb-ut-sep-color: $separatorColor;";
$css .= "--bb-ut-box-w: {$boxWidth}px;";
$css .= "--bb-ut-box-h: {$boxHeight}px;";
$css .= "--bb-ut-box-gap: {$boxGap}px;";
$css .= "--bb-ut-box-radius: {$boxRadius}px;";
$css .= "--bb-ut-digit-size: {$digitSize}px;";
$css .= "--bb-ut-label-size: {$labelSize}px;";
$css .= "--bb-ut-prefix-size: {$prefixSize}px;";
$css .= "--bb-ut-prefix-color: $prefixColor;";
$css .= "--bb-ut-suffix-size: {$suffixSize}px;";
$css .= "--bb-ut-suffix-color: $suffixColor;";
$css .= "--bb-ut-expired-size: {$expiredSize}px;";
$css .= "--bb-ut-expired-color: $expiredColor;";
$css .= "}";

// Total initial duration in seconds (for aria-valuemax) — best-effort for both modes.
if ( 'recurring' === $timerMode ) {
	$totalSeconds = ( $recurringDays * 86400 ) + ( $recurringHours * 3600 ) + ( $recurringMinutes * 60 ) + $recurringSeconds;
} else {
	$totalSeconds = ( $evergreenDays * 86400 ) + ( $evergreenHours * 3600 ) + ( $evergreenMinutes * 60 ) + $evergreenSeconds;
}
$totalSeconds = max( 0, (int) $totalSeconds );
?>
<div
	<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() is properly escaped. ?>
	<?php echo get_block_wrapper_attributes( [ 'class' => $wrapperClasses ] ); ?>
	id='<?php echo esc_attr( $id ); ?>'
>
	<style>
		<?php echo wp_strip_all_tags( $css ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS-only output, HTML tags stripped. ?>
	</style>

	<div class='bb-ut-inner'>
		<?php if ( '' !== trim( $prefixText ) ) : ?>
			<p class='bb-ut-prefix'><?php echo esc_html( $prefixText ); ?></p>
		<?php endif; ?>

		<?php if ( ! empty( $units ) ) : ?>
			<div
				class='bb-ut-timer'
				role='timer'
				aria-label='<?php echo esc_attr__( 'Countdown timer', 'b-blocks' ); ?>'
				aria-live='off'
				aria-atomic='true'
				aria-valuemin='0'
				aria-valuemax='<?php echo esc_attr( (string) $totalSeconds ); ?>'
				aria-valuenow='<?php echo esc_attr( (string) $totalSeconds ); ?>'
				data-bb-ut-config='<?php echo esc_attr( wp_json_encode( $config ) ); ?>'
			>
				<?php foreach ( $units as $index => $unit ) : ?>
					<?php if ( $index > 0 && $separatorVisible ) : ?>
						<span class='bb-ut-sep' aria-hidden='true'>:</span>
					<?php endif; ?>
					<span class='bb-ut-unit bb-ut-unit-<?php echo esc_attr( $unit['key'] ); ?>'>
						<span class='bb-ut-box'>
							<span class='bb-ut-digit' data-bb-ut-unit='<?php echo esc_attr( $unit['key'] ); ?>' aria-hidden='true'>00</span>
							<span class='screen-reader-text' data-bb-ut-sr='<?php echo esc_attr( $unit['key'] ); ?>'></span>
						</span>
						<span class='bb-ut-unit-label'><?php echo esc_html( $unit['label'] ); ?></span>
					</span>
				<?php endforeach; ?>
			</div>

			<div class='bb-ut-expired' role='status' hidden>
				<?php echo esc_html( $expiredMessage ); ?>
			</div>
		<?php endif; ?>

		<?php if ( '' !== trim( $suffixText ) ) : ?>
			<p class='bb-ut-suffix'><?php echo esc_html( $suffixText ); ?></p>
		<?php endif; ?>
	</div>
</div>
